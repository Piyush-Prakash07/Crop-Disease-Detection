# 🌱 AI-Powered Crop Disease Detection & Advisory System

An intelligent end-to-end web application that leverages Deep Learning (Convolutional Neural Networks / Keras) and Google Gemini AI to detect crop diseases from leaf images and provide actionable treatment recommendations, fertilizer suggestions, and real-time advisory.

---

## 🚀 Key Features

- **Leaf Disease Classification**: High-accuracy deep learning model predicting plant diseases from uploaded leaf images.
- **AI Agricultural Advisory**: Integrated with Google Gemini API for contextual treatment plans, disease prevention tips, and biological/chemical remedies.
- **Interactive Web UI**: Modern, responsive frontend built with React, Vite, and Lucide icons.
- **FastAPI Backend**: High-performance RESTful API endpoints for prediction, auth, user history, and AI insights.
- **Database & History Tracking**: Tracks user scan histories, disease prevalence records, and recommendations.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS / Vanilla CSS, Lucide React
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy
- **Machine Learning**: TensorFlow / Keras, NumPy, OpenCV / Pillow
- **AI / LLM**: Google Gemini API (`@google/genai` / `google-generativeai`)
- **Database**: SQLite / PostgreSQL (SQLAlchemy models)

---

## 📁 Project Structure

```plaintext
Crop-Disease-Detection/
├── backend/
│   ├── auth.py                  # JWT / Authentication routes & helpers
│   ├── crud.py                  # Database CRUD operations
│   ├── database.py              # DB connection setup
│   ├── gemini_service.py        # Gemini AI advisory integration
│   ├── main.py                  # FastAPI application entrypoint
│   ├── models.py                # SQLAlchemy ORM models
│   ├── prediction_service.py    # Keras model inference service
│   ├── requirements.txt         # Python dependencies
│   ├── schemas.py               # Pydantic data schemas
│   └── .env.example             # Example environment configuration
├── frontend/
│   ├── src/                     # React source files & components
│   ├── package.json             # Frontend dependencies & scripts
│   └── vite.config.js           # Vite configuration
├── model/
│   ├── class_labels.json        # Disease label mapping
│   └── crop_disease_model.keras # Trained Keras deep learning model
├── database/
│   ├── schema.sql               # Database schema definition
│   └── seed_data.sql            # Seed data for initial setup
├── notebooks/
│   └── 01_dataset_analysis.ipynb# Model training and exploration notebook
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Crop-Disease-Detection.git
cd Crop-Disease-Detection
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
# Edit .env and insert your GEMINI_API_KEY

# Start backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install node dependencies
npm install

# Start development server
npm run dev
```

---

## 🛡️ License

This project is licensed under the MIT License.
