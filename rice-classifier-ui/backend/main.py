

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware # Added this
import io
import numpy as np
from PIL import Image
import tensorflow as tf
from utils.preprocess import prepare_image

app = FastAPI()

# 1. Load model with compile=False to avoid version conflicts
model = tf.keras.models.load_model('model/best_rice_model.keras', compile=False)

# 2. Setup CORS so your Frontend can talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define class names (Make sure this matches your training order!)
CLASS_NAMES = ["Arborio", "Basmati", "Ipsala", "Jasmine", "Karacadag"]

@app.get("/")
def home():
    return {"message": "Rice Classifier API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    processed_image = prepare_image(io.BytesIO(contents))
    
    predictions = model.predict(processed_image)
    raw_scores = predictions[0] # The list of probabilities
    
    # 1. Prepare the distribution list
    distribution = []
    for i in range(len(CLASS_NAMES)):
        distribution.append({
            "label": CLASS_NAMES[i],
            "score": float(raw_scores[i]) # Convert to float for JSON
        })

    # 2. Sort distribution by highest score first
    distribution = sorted(distribution, key=lambda x: x['score'], reverse=True)

    idx = np.argmax(raw_scores)
    
    return {
        "prediction": CLASS_NAMES[idx],
        "confidence": float(np.max(raw_scores)), # Send as decimal for React to handle
        "distribution": distribution
    }