import os
import urllib.request
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from inference import disease_model

app = FastAPI(
    title="Krishi Mitra Disease Detection & AI API",
    description="Local high-accuracy crop disease detection API and AI Chatbot proxy powered by PyTorch and Gemini",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development; adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_gemini_key():
    # Try reading from system environment variables
    key = os.getenv("VITE_GEMINI_API_KEY")
    if key:
        return key
    
    # Try reading from parent directory's .env file
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip().startswith("VITE_GEMINI_API_KEY="):
                        return line.strip().split("=", 1)[1].strip()
        except Exception:
            pass
    return ""

class DetectionRequest(BaseModel):
    image: str  # Base64 encoded crop leaf image (excluding metadata headers)

@app.get("/")
def get_status():
    """
    Check the status of the local ML server and confirm if PyTorch model weights are loaded.
    """
    has_weights = disease_model.model is not None
    device = str(disease_model.device)
    return {
        "status": "online",
        "model_loaded": has_weights,
        "device": device,
        "mode": "production" if has_weights else "simulation/fallback"
    }

@app.post("/api/v1/detect")
def detect_disease(payload: DetectionRequest):
    """
    Receives a base64 encoded image, runs prediction using the PyTorch CNN,
    and returns a unified crop disease detection result.
    """
    if not payload.image:
        raise HTTPException(status_code=400, detail="Missing image data in request payload")
        
    try:
        # Strip data URL prefix if present (e.g. data:image/jpeg;base64,...)
        base64_str = payload.image
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
            
        result = disease_model.predict(base64_str)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

@app.post("/api/v1/chat")
def chat_with_gemini(payload: dict):
    """
    Proxy endpoint to forward chatbot requests to Gemini API from the backend,
    avoiding CORS and network status 503 issues in the browser.
    """
    message = payload.get("message", "")
    context = payload.get("context") or {}
    
    key = get_gemini_key()
    if not key:
        return {
            "response": "AI service not configured. Please add your Gemini API key.",
            "fallback": True
        }
        
    lang = context.get("preferredLanguage", "en")
    lang_instruction = (
        'CRITICAL: You MUST respond ONLY in Hindi (Devanagari script). Do not use English.'
        if lang == 'hi'
        else 'CRITICAL: You MUST respond ONLY in English.'
        if lang == 'en'
        else 'CRITICAL: You MUST respond in the EXACT same language the user uses in their prompt.'
    )
    
    crops = context.get("crops")
    state = context.get("state")
    soil_type = context.get("soilType")
    
    farmer_context = f"Farmer grows {crops} in {state}. Soil: {soil_type}." if crops else ""
    
    system_prompt = (
        f"You are Krishi Mitra, a friendly AI assistant for Indian farmers.\n"
        f"{lang_instruction}\n"
        f"{farmer_context}\n"
        f"Always give practical, actionable advice specific to Indian agriculture.\n"
        f"Reference ICAR guidelines when possible. Keep responses concise and friendly.\n"
        f"When unsure, recommend consulting local KVK (Krishi Vigyan Kendra)."
    )
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
        body = {
            "contents": [{"parts": [{"text": f"{system_prompt}\n\nUser: {message}"}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192}
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        
        with urllib.request.urlopen(req, timeout=20) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            
        candidates = res_data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts:
                text = parts[0].get("text", "I could not process your request.")
                return {"response": text, "fallback": False}
                
        return {"response": "I could not process your request.", "fallback": True}
        
    except Exception as e:
        print(f"Gemini API request failed: {e}")
        return {"response": "Unable to connect to AI service. Please try again later.", "fallback": True}

if __name__ == "__main__":
    # Start server on local port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
