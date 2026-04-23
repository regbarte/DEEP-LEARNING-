from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

from utils.preprocess import preprocess_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
model = load_model("model/rice_classifier.h5")

classes = ["Arborio", "Basmati", "Ipsala", "Jasmine", "Karacadag"]

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Validate file
        if not file.content_type.startswith("image/"):
            return {"error": "Please upload an image file"}

        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Preprocess
        img_array = preprocess_image(image)

        # Predict
        prediction = model.predict(img_array)
        class_idx = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        # Probabilities
        probabilities = {
            classes[i]: float(prediction[0][i])
            for i in range(len(classes))
        }

        return {
            "prediction": classes[class_idx],
            "confidence": confidence,
            "probabilities": probabilities
        }

    except Exception as e:
        return {"error": str(e)}