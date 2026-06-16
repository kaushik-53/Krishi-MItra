import os
import argparse
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import torchvision.models as models

# The list of 38 classes matching inference.py
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

def train_model(data_dir, epochs=10, batch_size=32, lr=0.001, fine_tune_epochs=5, fine_tune_lr=0.0001):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Benchmark disabled for stability on Windows notebook GPUs (RTX 3050 Laptop) to prevent TDR errors
    if device.type == 'cuda':
        torch.backends.cudnn.benchmark = False

    # 1. Define transforms (augmentations for training, standard normalize for validation)
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # 2. Load dataset
    if not os.path.exists(data_dir):
        print(f"Error: Dataset directory '{data_dir}' not found.")
        print("Please place the PlantVillage dataset folders in that directory or pass it via --data-dir.")
        return

    # Normalization helper to map varying naming conventions (e.g. Tomato_healthy vs Tomato___healthy)
    def normalize_name(name):
        return name.lower().replace("_", "").replace(" ", "").replace(",", "").replace("-", "")

    # Create mapping from normalized class names to standard class indices
    class_to_target_idx = {}
    for idx, cls_name in enumerate(PLANT_VILLAGE_CLASSES):
        norm = normalize_name(cls_name)
        class_to_target_idx[norm] = idx

    # Load dataset
    raw_dataset = datasets.ImageFolder(data_dir)
    
    # Map raw targets to standard PLANT_VILLAGE_CLASSES indices
    mapped_samples = []
    ignored_folders = set()
    matched_classes = set()
    
    for path, label in raw_dataset.samples:
        folder_name = os.path.basename(os.path.dirname(path))
        norm_folder = normalize_name(folder_name)
        
        if norm_folder in class_to_target_idx:
            target_idx = class_to_target_idx[norm_folder]
            mapped_samples.append((path, target_idx))
            matched_classes.add(PLANT_VILLAGE_CLASSES[target_idx])
        else:
            ignored_folders.add(folder_name)
            
    if not mapped_samples:
        print("Error: No matching crop class directories found in the dataset.")
        print(f"Looked for normalized folder names matching 38 PlantVillage classes.")
        if ignored_folders:
            print(f"Ignored directories: {sorted(list(ignored_folders))}")
        return
        
    print(f"Successfully mapped {len(mapped_samples)} images to {len(matched_classes)} of {len(PLANT_VILLAGE_CLASSES)} standard classes.")
    if ignored_folders:
        print(f"Ignored non-matching directories: {sorted(list(ignored_folders))}")

    # Build the custom dataset with mapped targets
    full_dataset = raw_dataset
    full_dataset.samples = mapped_samples
    full_dataset.targets = [target for _, target in mapped_samples]
    full_dataset.classes = PLANT_VILLAGE_CLASSES
    full_dataset.class_to_idx = {name: idx for idx, name in enumerate(PLANT_VILLAGE_CLASSES)}

    num_classes = len(PLANT_VILLAGE_CLASSES)
        
    # Split into train and validation sets (80/20)
    val_size = int(len(full_dataset) * 0.2)
    train_size = len(full_dataset) - val_size
    train_subset, val_subset = random_split(full_dataset, [train_size, val_size])

    # Apply specific transforms to training/validation splits
    train_subset.dataset.transform = train_transform
    val_subset.dataset.transform = val_transform

    train_loader = DataLoader(train_subset, batch_size=batch_size, shuffle=True, num_workers=0, pin_memory=True)
    val_loader = DataLoader(val_subset, batch_size=batch_size, shuffle=False, num_workers=0, pin_memory=True)

    print(f"Dataset summary: {train_size} training samples, {val_size} validation samples.")

    # 3. Create Model
    print("Initializing pre-trained EfficientNet-B0 backbone...")
    try:
        from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights
        model = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)
    except ImportError:
        model = models.efficientnet_b0(pretrained=True)

    # Freeze backbone parameters
    for param in model.parameters():
        param.requires_grad = False

    # Replace the classification head
    num_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_features, len(PLANT_VILLAGE_CLASSES))
    model = model.to(device)

    # 4. Define Loss, Optimizer, and AMP Scaler
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier[1].parameters(), lr=lr)
    
    # Initialize AMP GradScaler if CUDA is active to save VRAM and speed up training
    scaler = torch.amp.GradScaler('cuda') if device.type == 'cuda' else None
    if scaler is not None:
        print("Mixed Precision (AMP) training enabled.")

    best_val_acc = 0.0
    weights_dir = os.path.join(os.path.dirname(__file__), "weights")
    os.makedirs(weights_dir, exist_ok=True)
    best_model_path = os.path.join(weights_dir, "best_model.pth")

    # 5. Training Loop - Classification Head only
    print("\n--- Phase 1: Training Classification Head ---")
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for i, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            
            if scaler is not None:
                # Runs forward pass with autocasting
                with torch.amp.autocast('cuda'):
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
            else:
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            _, predicted = torch.max(outputs.data, 1)
            total_train += labels.size(0)
            correct_train += (predicted == labels).sum().item()

            if (i + 1) % 20 == 0:
                print(f"Epoch [{epoch+1}/{epochs}], Step [{i+1}/{len(train_loader)}], Loss: {loss.item():.4f}")

        epoch_loss = running_loss / train_size
        epoch_acc = (correct_train / total_train) * 100
        print(f"Epoch [{epoch+1}/{epochs}] - Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc:.2f}%")

        # Validation phase
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                
                if scaler is not None:
                    with torch.amp.autocast('cuda'):
                        outputs = model(inputs)
                        loss = criterion(outputs, labels)
                else:
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                
                val_loss += loss.item() * inputs.size(0)
                _, predicted = torch.max(outputs.data, 1)
                total_val += labels.size(0)
                correct_val += (predicted == labels).sum().item()

        val_epoch_loss = val_loss / val_size
        val_epoch_acc = (correct_val / total_val) * 100
        print(f"Epoch [{epoch+1}/{epochs}] - Val Loss: {val_epoch_loss:.4f}, Val Acc: {val_epoch_acc:.2f}%")

        if device.type == 'cuda':
            torch.cuda.empty_cache()

        # Save best model
        if val_epoch_acc > best_val_acc:
            best_val_acc = val_epoch_acc
            torch.save(model.state_dict(), best_model_path)
            print(f"✔ Best model checkpoint saved to {best_model_path} with Acc: {best_val_acc:.2f}%")

    # 6. Fine-tuning Phase (optional)
    if fine_tune_epochs > 0:
        print("\n--- Phase 2: Fine-Tuning Entire Network ---")
        # Unfreeze all parameters
        for param in model.parameters():
            param.requires_grad = True

        # Use a smaller learning rate for fine-tuning
        optimizer = optim.Adam(model.parameters(), lr=fine_tune_lr)

        for epoch in range(fine_tune_epochs):
            model.train()
            running_loss = 0.0
            correct_train = 0
            total_train = 0

            for i, (inputs, labels) in enumerate(train_loader):
                inputs, labels = inputs.to(device), labels.to(device)
                optimizer.zero_grad()
                
                if scaler is not None:
                    with torch.amp.autocast('cuda'):
                        outputs = model(inputs)
                        loss = criterion(outputs, labels)
                    scaler.scale(loss).backward()
                    scaler.step(optimizer)
                    scaler.update()
                else:
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                    loss.backward()
                    optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                _, predicted = torch.max(outputs.data, 1)
                total_train += labels.size(0)
                correct_train += (predicted == labels).sum().item()

            epoch_loss = running_loss / train_size
            epoch_acc = (correct_train / total_train) * 100
            print(f"Fine-Tune Epoch [{epoch+1}/{fine_tune_epochs}] - Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc:.2f}%")

            # Validation phase
            model.eval()
            val_loss = 0.0
            correct_val = 0
            total_val = 0

            with torch.no_grad():
                for inputs, labels in val_loader:
                    inputs, labels = inputs.to(device), labels.to(device)
                    
                    if scaler is not None:
                        with torch.amp.autocast('cuda'):
                            outputs = model(inputs)
                            loss = criterion(outputs, labels)
                    else:
                        outputs = model(inputs)
                        loss = criterion(outputs, labels)
                    
                    val_loss += loss.item() * inputs.size(0)
                    _, predicted = torch.max(outputs.data, 1)
                    total_val += labels.size(0)
                    correct_val += (predicted == labels).sum().item()

            val_epoch_loss = val_loss / val_size
            val_epoch_acc = (correct_val / total_val) * 100
            print(f"Fine-Tune Epoch [{epoch+1}/{fine_tune_epochs}] - Val Loss: {val_epoch_loss:.4f}, Val Acc: {val_epoch_acc:.2f}%")

            if device.type == 'cuda':
                torch.cuda.empty_cache()

            if val_epoch_acc > best_val_acc:
                best_val_acc = val_epoch_acc
                torch.save(model.state_dict(), best_model_path)
                print(f"✔ Best model checkpoint saved to {best_model_path} with Acc: {best_val_acc:.2f}%")

    print(f"\nTraining completed! Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"Model weights are stored at: {best_model_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train EfficientNet-B0 on PlantVillage dataset")
    parser.add_argument("--data-dir", type=str, default=os.path.join(os.path.dirname(__file__), "data", "PlantVillage"),
                        help="Path to PlantVillage dataset root directory")
    parser.add_argument("--epochs", type=int, default=10, help="Number of head training epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size for training")
    parser.add_argument("--lr", type=float, default=0.001, help="Learning rate for head training")
    parser.add_argument("--ft-epochs", type=int, default=5, help="Number of fine-tuning epochs")
    parser.add_argument("--ft-lr", type=float, default=0.0001, help="Learning rate for fine-tuning")

    args = parser.parse_args()
    train_model(
        data_dir=args.data_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        fine_tune_epochs=args.ft_epochs,
        fine_tune_lr=args.ft_lr
    )
