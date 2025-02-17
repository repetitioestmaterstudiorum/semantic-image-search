import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
from datetime import datetime
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"  -- Python process [{timestamp}]: {msg}")

class ImageEmbedder:
    def __init__(self):
        self.device = "mps" if torch.backends.mps.is_available() else "cpu"
        log(f"Using device {self.device}")
        
        self.model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14").to(self.device)
        log("Model loaded")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14")
        log("Processor loaded")

    def embed(self, image_path):
        log(f"Starting embedding for {image_path}")
        image = Image.open(image_path).convert("RGB")
        log("Image loaded")

        inputs = self.processor(images=image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k,v in inputs.items()}
        log("Image processed")

        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
        embedding = image_features[0].cpu().tolist()
        log("Image embedded")

        return embedding

# Initialize embedder and FastAPI app
log("Starting Python server...")
embedder = ImageEmbedder()
app = FastAPI()

class ImageRequest(BaseModel):
    image_path: str

@app.post("/embed")
async def embed_image(request: ImageRequest):
    log(f"Received request to embed: {request.image_path}")
    try:
        embedding = embedder.embed(request.image_path)
        log("Successfully generated embedding")
        return {"embedding": embedding}
    except Exception as e:
        log(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    log(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
