import sys, json, torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
from datetime import datetime
import os

def log(msg):
    if os.environ.get("PYTHON_DEBUG") == "1":
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"  -- Python process [{timestamp}]: {msg}", file=sys.stderr)

device = "mps" if torch.backends.mps.is_available() else "cpu"
log(f"Using device {device}")

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
log("Model loaded")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
log("Processor loaded")

image_path = sys.argv[1]
image = Image.open(image_path).convert("RGB")
log("Image loaded")

inputs = processor(images=image, return_tensors="pt")
inputs = {k: v.to(device) for k,v in inputs.items()}
log("Image processed")

with torch.no_grad():
    image_features = model.get_image_features(**inputs)
embedding = image_features[0].cpu().tolist()
log("Image embedded")

print(json.dumps(embedding))
