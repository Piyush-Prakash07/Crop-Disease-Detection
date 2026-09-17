import os
import tensorflow as tf
import numpy as np
from PIL import Image
import json

# Dynamically resolve path to model/ labels in the project workspace
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "model", "crop_disease_model.keras")
labels_path = os.path.join(BASE_DIR, "model", "class_labels.json")

if not os.path.exists(model_path):
    model_path = "model/crop_disease_model.keras"

if not os.path.exists(labels_path):
    labels_path = "model/class_labels.json"

model = tf.keras.models.load_model(model_path)

with open(labels_path) as f:
    class_labels = json.load(f)

def predict_disease(image_path):
    img = Image.open(image_path).convert("RGB")  # Ensure RGB (handles RGBA, grayscale, etc.)
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    # MobileNetV2 requires preprocess_input which scales pixels to [-1, 1]
    # Using simple /255.0 causes all predictions to be the same (preprocessing mismatch)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    predictions = model.predict(img_array)
    class_index = str(np.argmax(predictions))
    confidence = float(np.max(predictions)) * 100
    disease = class_labels[class_index]
    return disease, confidence
