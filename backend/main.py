import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from inference import disease_model

app = FastAPI(
    title="Krishi Mitra Disease Detection API",
    description="Local high-accuracy crop disease detection API powered by PyTorch",
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

if __name__ == "__main__":
    # Start server on local port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
