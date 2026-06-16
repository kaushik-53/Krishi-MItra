import os
import io
import base64
import hashlib
from PIL import Image
import torch
import torchvision.transforms as transforms
import torchvision.models as models

# List of all 38 classes in the standard PlantVillage dataset
PLANT_VILLAGE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

# Rich metadata mapping for PlantVillage classes to supply frontend-friendly UI data
DISEASE_METADATA = {
    "Apple___Apple_scab": {
        "diseaseName": "Apple Scab (Venturia inaequalis)",
        "severity": "medium",
        "description": "Apple scab is a serious fungal disease that causes olive-green to black velvety spots on leaves and scabby lesions on fruit.",
        "treatments": [
            {"type": "organic", "name": "Sulfur or Copper Fungicide", "dosage": "3g per litre", "application": "Spray thoroughly at bud break and every 10 days"},
            {"type": "organic", "name": "Neem Oil Spray", "dosage": "5ml per litre", "application": "Foliar spray weekly during wet spring periods"},
            {"type": "chemical", "name": "Captan 50 WP", "dosage": "2g per litre", "application": "Apply at green tip and repeat at petal fall"}
        ],
        "prevention": ["Rake and destroy fallen leaves in autumn", "Prune trees to improve air flow", "Plant scab-resistant apple varieties"]
    },
    "Apple___Black_rot": {
        "diseaseName": "Apple Black Rot (Botryosphaeria obtusa)",
        "severity": "high",
        "description": "Fungal disease causing frogeye leaf spots, black rotting areas on fruit, and cankers on branches and limbs.",
        "treatments": [
            {"type": "organic", "name": "Copper Fungicide", "dosage": "4g per litre", "application": "Spray early in spring to protect blooms"},
            {"type": "chemical", "name": "Tebuconazole", "dosage": "1ml per litre", "application": "Apply at pink bud stage and repeat as directed"}
        ],
        "prevention": ["Prune out dead wood and mummified fruit", "Sanitize pruning tools after every cut", "Avoid bark injury during harvesting"]
    },
    "Apple___Cedar_apple_rust": {
        "diseaseName": "Cedar Apple Rust (Gymnosporangium juniperi-virginianae)",
        "severity": "medium",
        "description": "Fungal disease requiring two hosts (apples and red cedars) to complete its lifecycle. Causes striking orange-yellow spots on leaves.",
        "treatments": [
            {"type": "organic", "name": "Sulfur Spray", "dosage": "5g per litre", "application": "Apply immediately when symptoms appear"},
            {"type": "chemical", "name": "Myclobutanil", "dosage": "1.5ml per litre", "application": "Foliar spray at 7-14 day intervals during spring"}
        ],
        "prevention": ["Remove nearby red cedar trees if practical", "Grow rust-resistant apple cultivars", "Apply protective sprays during bud break"]
    },
    "Apple___healthy": {
        "diseaseName": "Healthy Apple Leaf",
        "severity": "low",
        "description": "The leaf appears healthy with normal chlorophyll level and clean margins. No pathogen signatures detected.",
        "treatments": [],
        "prevention": ["Continue regular watering and fertilization", "Perform annual pruning", "Monitor regularly for pests"]
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "diseaseName": "Corn Gray Leaf Spot (Cercospora zeae-maydis)",
        "severity": "high",
        "description": "Gray leaf spot is a devastating fungal pathogen that causes tan-to-gray rectangular lesions running parallel to leaf veins.",
        "treatments": [
            {"type": "organic", "name": "Trichoderma harzianum", "dosage": "10g per litre", "application": "Foliar spray and soil inoculation at transplanting"},
            {"type": "chemical", "name": "Azoxystrobin", "dosage": "1.5ml per litre", "application": "Foliar spray at first signs of lesion development"}
        ],
        "prevention": ["Rotate crops away from corn for at least 1-2 years", "Till plant debris in autumn", "Plant hybrids with high resistance rating"]
    },
    "Corn_(maize)___Common_rust_": {
        "diseaseName": "Corn Common Rust (Puccinia sorghi)",
        "severity": "medium",
        "description": "Common rust causes powdery, reddish-brown pustules on both upper and lower surfaces of leaves under cool, humid conditions.",
        "treatments": [
            {"type": "organic", "name": "Neem Oil & Soap Mixture", "dosage": "5ml per litre", "application": "Spray foliage weekly during high humidity"},
            {"type": "chemical", "name": "Pyraclostrobin", "dosage": "2g per litre", "application": "Apply at early development of rust pustules"}
        ],
        "prevention": ["Use resistant hybrids", "Avoid overhead irrigation in late afternoon", "Ensure proper crop spacing"]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "diseaseName": "Northern Corn Leaf Blight (Exserohilum turcicum)",
        "severity": "high",
        "description": "Fungal disease characterized by long, elliptical grayish-green lesions that resemble cigars, causing premature leaf death.",
        "treatments": [
            {"type": "organic", "name": "Copper Soap Fungicide", "dosage": "3ml per litre", "application": "Apply at the vegetative growth stages"},
            {"type": "chemical", "name": "Propiconazole", "dosage": "1.2ml per litre", "application": "Apply at silking stage or upon early detection"}
        ],
        "prevention": ["Perform crop rotation", "Incorporate crop residue into soil via deep plowing", "Select disease-tolerant corn varieties"]
    },
    "Corn_(maize)___healthy": {
        "diseaseName": "Healthy Corn Leaf",
        "severity": "low",
        "description": "Healthy corn foliage showing good cell structure and leaf turgor. Free from fungal or bacterial lesions.",
        "treatments": [],
        "prevention": ["Ensure balanced nitrogen, phosphorus, and potassium levels", "Control weed competitors", "Maintain adequate drainage"]
    },
    "Grape___Black_rot": {
        "diseaseName": "Grape Black Rot (Guignardia bidwellii)",
        "severity": "critical",
        "description": "A destructive fungal disease that attacks leaves, shoots, and turns grape berries into hard, black, shriveled mummies.",
        "treatments": [
            {"type": "organic", "name": "Copper Oxychloride", "dosage": "3g per litre", "application": "Spray before bloom and post-bloom stages"},
            {"type": "chemical", "name": "Mancozeb", "dosage": "2.5g per litre", "application": "Spray starting at bud break at 10-14 day intervals"}
        ],
        "prevention": ["Remove all mummified grapes from vines and ground", "Keep vines pruned and trellis cleared of weeds for ventilation", "Prune out diseased canes during winter"]
    },
    "Grape___Esca_(Black_Measles)": {
        "diseaseName": "Grape Esca / Black Measles (Fungi Complex)",
        "severity": "high",
        "description": "A complex wood disease causing dark spots on berries ('black measles') and interveinal leaf necrosis resulting in a tiger-stripe pattern.",
        "treatments": [
            {"type": "organic", "name": "Sodium Arsenite Alternative / Liquid Copper", "dosage": "3g per litre", "application": "Apply directly to pruning wounds as a sealant"},
            {"type": "chemical", "name": "Thiophanate-Methyl", "dosage": "1.5ml per litre", "application": "Foliar spray to protect pruning cuts"}
        ],
        "prevention": ["Delay pruning during rainy weather to prevent spore entry", "Apply pruning wound sealants immediately", "Remove severely infected old vines"]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "diseaseName": "Grape Leaf Blight (Pseudocercospora vitis)",
        "severity": "medium",
        "description": "Fungal infection causing dark brown spots on leaves, which merge and lead to premature leaf drop, weakening the vine.",
        "treatments": [
            {"type": "organic", "name": "Sulfur Powder Duster", "dosage": "Dusting method", "application": "Apply dry sulfur powder to canopy in early morning"},
            {"type": "chemical", "name": "Ziram 76 WP", "dosage": "2g per litre", "application": "Spray at 10-day intervals if wet weather persists"}
        ],
        "prevention": ["Collect and burn fallen leaves", "Avoid low-lying damp areas for vineyard layout", "Optimize canopy management"]
    },
    "Grape___healthy": {
        "diseaseName": "Healthy Grape Leaf",
        "severity": "low",
        "description": "Vine leaf shows excellent health, clear veins, and optimal leaf surface area for grape ripening.",
        "treatments": [],
        "prevention": ["Maintain consistent trellis training", "Prune during dormancy", "Provide drip irrigation directly to roots"]
    },
    "Potato___Early_blight": {
        "diseaseName": "Potato Early Blight (Alternaria solani)",
        "severity": "medium",
        "description": "Early blight is a fungal pathogen causing dark brown to black spots with concentric rings (target spots) on older potato leaves first.",
        "treatments": [
            {"type": "organic", "name": "Neem Oil Spray", "dosage": "5ml per litre", "application": "Spray foliage thoroughly every 7 days"},
            {"type": "organic", "name": "Copper Soap Fungicide", "dosage": "3ml per litre", "application": "Foliar spray at the onset of rain season"},
            {"type": "chemical", "name": "Mancozeb 75% WP", "dosage": "2g per litre", "application": "Spray every 10-14 days starting at tuber bulking"}
        ],
        "prevention": ["Practice a 3-year crop rotation with non-solanaceous crops", "Ensure optimal nitrogen fertilization", "Remove and destroy crop residue post-harvest"]
    },
    "Potato___Late_blight": {
        "diseaseName": "Potato Late Blight (Phytophthora infestans)",
        "severity": "critical",
        "description": "The disease responsible for the Irish Potato Famine. Late blight causes large, dark, water-soaked leaf spots with white mold on the underside during humid weather.",
        "treatments": [
            {"type": "organic", "name": "Copper Sulfate (Bordeaux Mixture)", "dosage": "1% solution", "application": "Spray entire vine every 5-7 days under wet weather"},
            {"type": "chemical", "name": "Metalaxyl-M + Mancozeb", "dosage": "2.5g per litre", "application": "Apply immediately at first report of disease in region"}
        ],
        "prevention": ["Plant only certified disease-free seed tubers", "Ensure adequate soil hilling to protect tubers", "Avoid overhead irrigation, use drip instead"]
    },
    "Potato___healthy": {
        "diseaseName": "Healthy Potato Leaf",
        "severity": "low",
        "description": "Potato leaf displays normal green coloring, strong structure, and no fungal mycelium.",
        "treatments": [],
        "prevention": ["Perform hilling regularly", "Monitor for Colorado potato beetle", "Keep soil moist but not waterlogged"]
    },
    "Tomato___Bacterial_spot": {
        "diseaseName": "Tomato Bacterial Spot (Xanthomonas campestris)",
        "severity": "high",
        "description": "Bacterial disease causing dark, water-soaked circular spots on leaves, stems, and rough scabby lesions on tomato fruits.",
        "treatments": [
            {"type": "organic", "name": "Copper Fungicide mixed with Mancozeb", "dosage": "2g copper + 2g mancozeb per litre", "application": "Foliar spray every 7 days in humid weather"},
            {"type": "chemical", "name": "Streptomycin Sulfate", "dosage": "1g per 10 litres", "application": "Foliar spray at seedling stage"}
        ],
        "prevention": ["Purchase disease-free seeds or treat seeds with hot water", "Avoid working in the fields when plants are wet", "Use mulches to prevent soil splashing"]
    },
    "Tomato___Early_blight": {
        "diseaseName": "Tomato Early Blight (Alternaria solani)",
        "severity": "medium",
        "description": "Early blight is a fungal disease affecting lower tomato leaves first. Characterized by dark concentric target rings, leaf yellowing, and eventual drop.",
        "treatments": [
            {"type": "organic", "name": "Neem Oil Spray", "dosage": "5ml per litre", "application": "Spray foliage thoroughly every 7 days"},
            {"type": "organic", "name": "Trichoderma Viride", "dosage": "10g per litre", "application": "Soil drench around root system"},
            {"type": "chemical", "name": "Mancozeb 75% WP", "dosage": "2g per litre", "application": "Foliar spray every 10-14 days"}
        ],
        "prevention": ["Practice crop rotation (avoid tomatoes/potatoes for 3 years)", "Remove lower leaves up to 12 inches to prevent soil splash", "Water at the base of the plant"]
    },
    "Tomato___Late_blight": {
        "diseaseName": "Tomato Late Blight (Phytophthora infestans)",
        "severity": "critical",
        "description": "A rapid and destructive fungal disease that causes large water-soaked spots on leaves that turn brown/purple, with white fungal growth underneath in damp weather.",
        "treatments": [
            {"type": "organic", "name": "Copper Oxychloride", "dosage": "3g per litre", "application": "Spray every 5 days during cloudy, damp periods"},
            {"type": "chemical", "name": "Chlorothalonil or Metalaxyl", "dosage": "2g per litre", "application": "Apply immediately at first sign of disease in the area"}
        ],
        "prevention": ["Avoid overhead irrigation", "Ensure maximum plant spacing to facilitate quick drying", "Destroy infected plants immediately (do not compost)"]
    },
    "Tomato___Leaf_Mold": {
        "diseaseName": "Tomato Leaf Mold (Passalora fulva)",
        "severity": "medium",
        "description": "A fungal pathogen that thrives in high relative humidity. It causes pale green-to-yellow spots on leaf tops, with olive-green velvety spores underneath.",
        "treatments": [
            {"type": "organic", "name": "Bio-fungicide (Bacillus subtilis)", "dosage": "4ml per litre", "application": "Apply to foliage weekly during high humidity"},
            {"type": "chemical", "name": "Difenoconazole", "dosage": "1ml per litre", "application": "Foliar spray at first signs of mold"}
        ],
        "prevention": ["Increase ventilation in greenhouses", "Prune tomatoes to keep canopy open", "Maintain humidity levels below 85%"]
    },
    "Tomato___Septoria_leaf_spot": {
        "diseaseName": "Tomato Septoria Leaf Spot (Septoria lycopersici)",
        "severity": "medium",
        "description": "One of the most common tomato foliar diseases. Causes numerous small, circular spots with dark borders and grey centers containing black pycnidia.",
        "treatments": [
            {"type": "organic", "name": "Copper Octanoate", "dosage": "3ml per litre", "application": "Foliar spray every 7-10 days"},
            {"type": "chemical", "name": "Chlorothalonil 75 WP", "dosage": "2g per litre", "application": "Apply at transplanting and repeat every fortnight"}
        ],
        "prevention": ["Control weeds like horse nettle and nightshade (alternative hosts)", "Apply thick layer of organic mulch under plants", "Rake and destroy residues in autumn"]
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "diseaseName": "Two-Spotted Spider Mite Injury (Tetranychus urticae)",
        "severity": "high",
        "description": "Tiny pests that suck plant juices, causing leaves to become pale and speckled with yellow spots, eventually spinning fine webs on leaf bottoms.",
        "treatments": [
            {"type": "organic", "name": "Insecticidal Soap or Neem Oil", "dosage": "10ml per litre", "application": "Spray heavily under leaves, repeat in 5 days"},
            {"type": "chemical", "name": "Abamectin Miticide", "dosage": "0.5ml per litre", "application": "Apply with a pressure sprayer to penetrate webbing"}
        ],
        "prevention": ["Keep plants well-watered (mites thrive in dry, dusty weather)", "Introduce natural predators like ladybugs or predatory mites", "Remove infested weeds surrounding fields"]
    },
    "Tomato___Target_Spot": {
        "diseaseName": "Tomato Target Spot (Corynespora cassiicola)",
        "severity": "medium",
        "description": "Fungal disease creating small circular lesions with concentric rings, which can merge to form large dead patches, leading to defoliation.",
        "treatments": [
            {"type": "organic", "name": "Copper Soap", "dosage": "4ml per litre", "application": "Spray foliage every 7-10 days"},
            {"type": "chemical", "name": "Pyraclostrobin", "dosage": "1.5ml per litre", "application": "Apply early in the morning to avoid foliage burn"}
        ],
        "prevention": ["Provide adequate nitrogen fertilization to maintain vigor", "Keep crops weed-free", "Rotate crops out of tomato and cucurbits"]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "diseaseName": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "severity": "critical",
        "description": "A viral disease transmitted by Whiteflies (Bemisia tabaci). Causes severe plant stunting, leaf curling upward and yellowing, and complete yield loss.",
        "treatments": [
            {"type": "organic", "name": "Yellow Sticky Traps & Neem Oil", "dosage": "N/A", "application": "Hang traps to catch whiteflies, spray neem to repel nymphs"},
            {"type": "chemical", "name": "Imidacloprid (Systemic Insecticide)", "dosage": "1ml per litre", "application": "Apply as soil drench at transplanting to control whiteflies"}
        ],
        "prevention": ["Grow virus-resistant cultivars", "Use insect-proof netting over seedlings", "Remove and bury infected plants immediately to stop vector spread"]
    },
    "Tomato___Tomato_mosaic_virus": {
        "diseaseName": "Tomato Mosaic Virus (ToMV)",
        "severity": "high",
        "description": "A highly stable plant virus causing mottled dark and light green patterns (mosaic) on leaves, leaf malformation (shoestringing), and poor fruit color.",
        "treatments": [
            {"type": "organic", "name": "Milk Spray (reductive)", "dosage": "100ml milk per litre", "application": "Spray seedlings to reduce mechanical transmission efficiency"}
        ],
        "prevention": ["Sanitize all tools with trisodium phosphate (TSP)", "Avoid handling plants after using tobacco products", "Grow resistant seed lines"]
    },
    "Tomato___healthy": {
        "diseaseName": "Healthy Tomato Leaf",
        "severity": "low",
        "description": "The leaf shows rich green coloration, clean margins, healthy veins, and no viral or fungal signs.",
        "treatments": [],
        "prevention": ["Maintain consistent watering schedule", "Apply organic mulch around stem bases", "Inspect leaves twice weekly for early signs"]
    }
}

# Add generic fallbacks for other classes that are not fully filled out above
for class_name in PLANT_VILLAGE_CLASSES:
    if class_name not in DISEASE_METADATA:
        # Determine crop and disease from name
        parts = class_name.split("___")
        crop = parts[0].replace("_", " ").title()
        disease_raw = parts[1].replace("_", " ")
        if disease_raw == "healthy":
            disease_name = f"Healthy {crop} Leaf"
            severity = "low"
            desc = f"This {crop.lower()} leaf appears healthy with normal leaf tissue structure."
            treatments = []
            prevention = [f"Practice crop rotation", f"Ensure proper spacing", f"Monitor foliage for pests"]
        else:
            disease_name = f"{crop} {disease_raw.title()}"
            severity = "medium"
            desc = f"Pathological evaluation detected symptoms of {disease_raw.lower()} affecting this {crop.lower()} leaf."
            treatments = [
                {"type": "organic", "name": "Neem Oil Solution", "dosage": "5ml per litre", "application": "Foliar spray weekly"},
                {"type": "organic", "name": "Copper Soap", "dosage": "3ml per litre", "application": "Foliar spray at early symptoms"},
                {"type": "chemical", "name": "Broad-Spectrum Fungicide", "dosage": "2g per litre", "application": "Apply at 10-14 day intervals"}
            ]
            prevention = ["Remove infected foliage immediately", "Disinfect tools before and after pruning", "Avoid overhead watering"]

        DISEASE_METADATA[class_name] = {
            "diseaseName": disease_name,
            "severity": severity,
            "description": desc,
            "treatments": treatments,
            "prevention": prevention
        }


class PlantDiseaseModel:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.classes = PLANT_VILLAGE_CLASSES
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Load weights if available
        self.weights_path = os.path.join(os.path.dirname(__file__), "weights", "best_model.pth")
        if os.path.exists(self.weights_path):
            try:
                print(f"Loading PyTorch weights from {self.weights_path}...")
                # Use EfficientNet-B0 as standard backbone (can change based on train.py)
                self.model = models.efficientnet_b0(pretrained=False)
                # Modify output layer to match the 38 classes
                num_features = self.model.classifier[1].in_features
                self.model.classifier[1] = torch.nn.Linear(num_features, len(self.classes))
                
                # Load saved state dictionary
                self.model.load_state_dict(torch.load(self.weights_path, map_location=self.device))
                self.model.to(self.device)
                self.model.eval()
                print("Model loaded successfully!")
            except Exception as e:
                print(f"Error loading trained model weights: {e}. Falling back to simulation mode.")
                self.model = None
        else:
            print(f"No weights found at {self.weights_path}. Running in simulation/mock mode.")
            self.model = None

    def predict(self, image_base64: str) -> dict:
        """
        Predicts the crop disease from the base64 encoded image.
        Returns a dict containing diseaseName, confidence, severity, description, treatments, and prevention.
        """
        # If no model is loaded, run mock prediction based on the hash of the image content
        if self.model is None:
            return self._mock_prediction(image_base64)
            
        try:
            # Decode base64 image to PIL
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            
            # Apply PyTorch transformations and add batch dimension
            tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Run inference
            with torch.no_grad():
                outputs = self.model(tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence, predicted_idx = torch.max(probabilities, dim=0)
                
            class_name = self.classes[predicted_idx.item()]
            conf_percent = round(confidence.item() * 100, 1)
            
            # Confidence Thresholding (65%) to filter out random objects/unclear photos
            if confidence.item() < 0.65:
                return {
                    "diseaseName": "Unknown / Unrecognized Image",
                    "confidence": conf_percent,
                    "severity": "low",
                    "description": "The uploaded image does not appear to be a crop leaf, or the disease cannot be identified with high confidence. Please ensure the image is clear, well-lit, and focused on a single plant leaf.",
                    "treatments": [],
                    "prevention": [
                        "Ensure the leaf is the primary subject in the frame.",
                        "Avoid blurry, dark, or out-of-focus photographs.",
                        "Do not upload non-agricultural objects or multi-leaf branches."
                    ]
                }
            
            # Retrieve rich metadata
            meta = DISEASE_METADATA.get(class_name)
            return {
                "diseaseName": meta["diseaseName"],
                "confidence": conf_percent,
                "severity": meta["severity"],
                "description": meta["description"],
                "treatments": meta["treatments"],
                "prevention": meta["prevention"]
            }
        except Exception as e:
            print(f"Error during PyTorch inference: {e}")
            return self._mock_prediction(image_base64)

    def _mock_prediction(self, image_base64: str) -> dict:
        """
        Deterministic mock prediction helper that maps base64 image hashes to realistic plant diseases.
        Ensures full end-to-end integration works prior to running training scripts.
        """
        # Choose a disease deterministically based on image base64 hash
        hasher = hashlib.md5(image_base64.encode('utf-8'))
        hash_val = int(hasher.hexdigest(), 16)
        
        # We'll pick from a few interesting classes to simulate variety
        demo_classes = [
            "Tomato___Early_blight",
            "Potato___Late_blight",
            "Apple___Apple_scab",
            "Grape___Black_rot",
            "Corn_(maize)___Common_rust_",
            "Tomato___healthy"
        ]
        chosen_class = demo_classes[hash_val % len(demo_classes)]
        meta = DISEASE_METADATA[chosen_class]
        
        # Confidence score randomly between 88.5% and 97.4% based on hash
        confidence = round(88.5 + (hash_val % 90) * 0.1, 1)
        
        return {
            "diseaseName": meta["diseaseName"] + " (Simulated)",
            "confidence": confidence,
            "severity": meta["severity"],
            "description": meta["description"] + " [NOTE: Running in backend simulation mode because no trained model weights were found.]",
            "treatments": meta["treatments"],
            "prevention": meta["prevention"]
        }

# Instantiate singleton model instance
disease_model = PlantDiseaseModel()
