import os
import uuid
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

import models
import schemas
import crud
import auth
import prediction_service
import gemini_service
from database import engine, SessionLocal, get_db

# Create DB Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crop Disease Detection API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Startup Seeding Event
@app.on_event("startup")
def startup_db_seeding():
    db = SessionLocal()
    try:
        # Seed diseases table if empty
        if db.query(models.Disease).count() == 0:
            print("No diseases found. Seeding initial disease classes...")
            diseases_seed = [
                {
                    "disease_name": "Pepper__bell___Bacterial_spot",
                    "symptoms": "Small, yellow-green spots on leaves that turn brown and water-soaked. Lesions may expand and merge, causing leaves to drop.",
                    "causes": "Xanthomonas campestris pv. vesicatoria bacterium, spread by rain splash, overhead watering, and contaminated seeds.",
                    "prevention": "Use certified pathogen-free seeds, practice crop rotation, keep foliage dry, and sanitize garden tools regularly.",
                    "treatment": "Copper-based fungicides can help manage the spread of the disease when applied early and combined with pruning.",
                    "crop_type": "Pepper Bell"
                },
                {
                    "disease_name": "Pepper__bell___healthy",
                    "symptoms": "Leaves are vibrant green, free of spots, blemishes, or wilting. Plant displays normal growth and healthy fruit development.",
                    "causes": "N/A - Plant is in healthy state with proper nutrients, water, and environment.",
                    "prevention": "Maintain regular watering, appropriate sunlight, proper spacing, and routine monitoring for pests.",
                    "treatment": "None required. Continue standard cultural practices.",
                    "crop_type": "Pepper Bell"
                },
                {
                    "disease_name": "Potato___Early_blight",
                    "symptoms": "Small, dark brown to black spots with concentric rings ('target-board' effect) on older, lower leaves first.",
                    "causes": "Alternaria solani fungus, which overwinters in plant debris and soil, favored by warm, humid weather and wet leaves.",
                    "prevention": "Rotate crops, clean field debris after harvest, plant resistant potato varieties, and apply mulch to reduce soil splash.",
                    "treatment": "Apply protective fungicides like chlorothalonil, mancozeb, or copper-based sprays upon first sign of symptoms.",
                    "crop_type": "Potato"
                },
                {
                    "disease_name": "Potato___Late_blight",
                    "symptoms": "Large, irregular water-soaked spots on leaves that turn dark brown to black. White velvety mold appears on leaf undersides in wet conditions.",
                    "causes": "Phytophthora infestans oomycete, a highly destructive pathogen that thrives in cool, wet, and humid conditions.",
                    "prevention": "Plant certified healthy seed tubers, eliminate volunteer potatoes, and avoid overhead irrigation.",
                    "treatment": "Immediately apply systemic or protective fungicides (e.g., metalaxyl, chlorothalonil, copper). Destroy infected crops to prevent epidemic.",
                    "crop_type": "Potato"
                },
                {
                    "disease_name": "Potato___healthy",
                    "symptoms": "Foliage is green and bushy without spots, yellowing, or decay. Tubers are firm and clean.",
                    "causes": "N/A - Plant is in healthy state.",
                    "prevention": "Maintain healthy soil, crop rotation, and correct moisture levels. Check for early signs of pests.",
                    "treatment": "None required. Continue standard watering and weeding.",
                    "crop_type": "Potato"
                },
                {
                    "disease_name": "Tomato_Bacterial_spot",
                    "symptoms": "Small, dark, water-soaked spots on leaves, stems, and fruit. Leaves may turn yellow and drop prematurely, exposing fruit to sunscald.",
                    "causes": "Xanthomonas bacterium species, spread by splashing rain, dew, or contaminated tools.",
                    "prevention": "Use disease-free seeds and transplants, avoid overhead watering, rotate crops, and do not work in wet fields.",
                    "treatment": "Apply copper-based fungicides mixed with mancozeb to reduce bacterial spread on healthy leaves.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato_Early_blight",
                    "symptoms": "Dark, concentric rings forming circular spots on older leaves. Leaves yellow around spots and eventually drop.",
                    "causes": "Alternaria solani fungus, which thrives in warm temperatures and high humidity/wetness.",
                    "prevention": "Mulch soil, prune lower leaves, ensure wide plant spacing for airflow, and clean up crop residues at season end.",
                    "treatment": "Use fungicides containing chlorothalonil, mancozeb, or copper fungicides at regular intervals when conditions favor disease.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato_Late_blight",
                    "symptoms": "Dark, water-soaked patches on leaves and stems that rapidly turn black. White fuzzy growth appears on the undersides of leaves in humid weather.",
                    "causes": "Phytophthora infestans oomycete, which can kill tomato plants within days under wet, cool conditions.",
                    "prevention": "Plant resistant varieties, destroy volunteer tomatoes, and ensure excellent air circulation.",
                    "treatment": "Apply preventative copper-based or systemic fungicides. Promptly pull and dispose of infected plants.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato_Leaf_Mold",
                    "symptoms": "Pale green or yellow spots on upper leaf surfaces, corresponding to olive-green to purple velvety mold on leaf undersides.",
                    "causes": "Passalora fulva fungus, very common in high humidity and greenhouse environments.",
                    "prevention": "Improve ventilation in greenhouses, reduce humidity, prune lower leaves, and water at the base of plants.",
                    "treatment": "Apply copper fungicides or sulfur-based sprays to manage outbreaks in high-risk environments.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato_Septoria_leaf_spot",
                    "symptoms": "Numerous small, circular spots with dark borders and grey/tan centers. Tiny black specks (pycnidia) appear in centers.",
                    "causes": "Septoria lycopersici fungus, which is splash-dispersed from soil or infected plant debris.",
                    "prevention": "Prune lower leaves to prevent contact with soil, apply mulch, avoid overhead watering, and weed regularly.",
                    "treatment": "Spray fungicides containing chlorothalonil or copper-based compounds at the first sign of leaf spots.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato_Spider_mites_Two_spotted_spider_mite",
                    "symptoms": "Yellow stippling or tiny specks on leaves, fine webbing on leaf undersides and stems. Leaves turn bronze, dry out, and drop.",
                    "causes": "Tetranychus urticae spider mites, tiny arachnids that thrive in hot, dry, and dusty conditions.",
                    "prevention": "Spray plants with water to disrupt webs and wash off mites, encourage natural predators like ladybugs, and keep plants watered.",
                    "treatment": "Apply insecticidal soaps, horticultural oils, neem oil, or specific miticides if populations are high.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato__Target_Spot",
                    "symptoms": "Small, dark brown spots on leaves with faint concentric rings. Lesions can also form on stems and fruit, causing rot.",
                    "causes": "Corynespora cassiicola fungus, favored by warm, wet weather and prolonged leaf wetness.",
                    "prevention": "Practice crop rotation, space plants well, and avoid overhead watering to reduce canopy moisture.",
                    "treatment": "Apply azoxystrobin, chlorothalonil, or copper-based fungicides to protect healthy foliage.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato__Tomato_YellowLeaf__Curl_Virus",
                    "symptoms": "Leaves curl upward and inward, turn yellow along margins, and show severe puckering. Plant growth is severely stunted.",
                    "causes": "Begomovirus transmitted by silverleaf whiteflies. Not spread by contact or seeds.",
                    "prevention": "Use whitefly-resistant netting in greenhouses, set up yellow sticky traps, and control whitefly hosts.",
                    "treatment": "No cure for the virus. Immediately remove and destroy infected plants. Use insecticidal soaps or systemic insecticides to control whiteflies.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato__Tomato_mosaic_virus",
                    "symptoms": "Mottling of leaves with light and dark green patches, leaf crinkling, leaf narrowing, and stunted growth.",
                    "causes": "Tomato mosaic virus, highly stable and easily transmitted mechanically by hands, tools, and clothing.",
                    "prevention": "Disinfect tools, wash hands with soap, plant certified seeds, and use resistant varieties.",
                    "treatment": "No chemical treatment. Pull and burn infected plants. Sanitize the area and avoid planting solanaceous crops there next season.",
                    "crop_type": "Tomato"
                },
                {
                    "disease_name": "Tomato_healthy",
                    "symptoms": "Foliage is healthy green, leaves are firm, and stems are strong. Free of spots, molds, wilting, or discoloration.",
                    "causes": "N/A - Plant is healthy and growing under optimal environmental conditions.",
                    "prevention": "Maintain healthy soil nutrients, appropriate watering schedules, weed control, and general observation.",
                    "treatment": "None required. Continue standard plant care.",
                    "crop_type": "Tomato"
                }
            ]
            for d in diseases_seed:
                db_disease = models.Disease(**d)
                db.add(db_disease)
            db.commit()
            print("Successfully seeded 15 crop diseases!")

        # Seed admin user if it does not exist
        admin_email = "admin@cropdetector.com"
        if db.query(models.User).filter(models.User.email == admin_email).count() == 0:
            print("No admin user found. Seeding default administrator account...")
            hashed_pw = auth.hash_password("AdminPassword123")
            admin_user = models.User(
                name="Admin Farmer",
                email=admin_email,
                password=hashed_pw,
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("Admin user seeded: admin@cropdetector.com / AdminPassword123")
            
    except Exception as e:
        print(f"Startup seeding warning: {e}")
    finally:
        db.close()

# API Endpoints

# 1. Register User
@app.post("/api/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud.create_user(db=db, user=user)

# 2. Login User
@app.post("/api/login", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Generate Access Token
    access_token = auth.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,
        "name": db_user.name,
        "user_id": db_user.id
    }

# 3. Predict Crop Disease (Protected - supports Local Model & Gemini Vision Hybrid Diagnosis)
@app.post("/api/predict")
def predict_crop(
    file: UploadFile = File(...), 
    mode: str = Form("hybrid"), # "local", "gemini", or "hybrid"
    crop_hint: str = Form(""),
    db: Session = Depends(get_db), 
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    # Retrieve user from token
    user = crud.get_user_by_email(db, current_user.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Save uploaded file
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save uploaded file: {str(e)}"
        )

    relative_img_path = f"uploads/{unique_filename}"
    disease_name = "Unknown"
    confidence = 0.0
    disease_info = None
    gemini_analysis = None

    # 1. Run Local ML prediction if requested
    if mode in ["local", "hybrid"]:
        try:
            disease_name, confidence = prediction_service.predict_disease(file_path)
            disease_info = crud.get_disease_by_name(db, disease_name)
        except Exception as e:
            print(f"Local model prediction notice: {e}")
            if mode == "local":
                if os.path.exists(file_path):
                    os.remove(file_path)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Local model prediction failed: {str(e)}"
                )

    # 2. Run Smart AI Vision Diagnosis if requested
    if mode in ["gemini", "hybrid"]:
        try:
            gemini_analysis = gemini_service.diagnose_crop_with_gemini(file_path, crop_hint=crop_hint)
            if gemini_analysis and "disease_detected" in gemini_analysis and gemini_analysis.get("disease_detected"):
                crop = str(gemini_analysis.get("crop_name", "")).strip()
                dis = str(gemini_analysis.get("disease_detected", "")).strip()
                
                # Format clean disease name e.g. "Cucumber Downy Mildew" or "Cucumber Healthy"
                if crop and not dis.lower().startswith(crop.lower()):
                    full_disease_name = f"{crop} {dis}".strip()
                else:
                    full_disease_name = dis or crop or "Unknown"

                # In hybrid and vision modes, prioritize the accurate AI diagnosis
                disease_name = full_disease_name
                if "confidence_score" in gemini_analysis:
                    try:
                        confidence = float(gemini_analysis["confidence_score"])
                    except (ValueError, TypeError):
                        pass

                # Check if this disease is already in the database catalog
                db_disease = crud.get_disease_by_name(db, disease_name)
                if not db_disease:
                    # Auto-catalog this new crop/disease into the database!
                    symptoms_raw = gemini_analysis.get("symptoms_observed", [])
                    symptoms_str = "\n".join(symptoms_raw) if isinstance(symptoms_raw, list) else str(symptoms_raw)

                    causes_str = str(gemini_analysis.get("biological_cause", ""))

                    prev_raw = gemini_analysis.get("preventive_measures", [])
                    prev_str = "\n".join(prev_raw) if isinstance(prev_raw, list) else str(prev_raw)

                    chem_raw = gemini_analysis.get("chemical_treatments", [])
                    org_raw = gemini_analysis.get("organic_treatments", [])
                    chem_str = "\n".join(chem_raw) if isinstance(chem_raw, list) else str(chem_raw)
                    org_str = "\n".join(org_raw) if isinstance(org_raw, list) else str(org_raw)
                    treatment_str = f"Chemical: {chem_str}\nOrganic: {org_str}".strip()

                    new_disease_data = schemas.DiseaseCreate(
                        disease_name=disease_name,
                        crop_type=crop or "General Crop",
                        symptoms=symptoms_str or "Visual spotting or discoloration on foliage.",
                        causes=causes_str or "Pathogenic infection or environmental stress.",
                        prevention=prev_str or "Maintain proper spacing, crop rotation, and sanitary practices.",
                        treatment=treatment_str or "Apply recommended protective treatments."
                    )
                    try:
                        db_disease = crud.create_disease(db, new_disease_data)
                        print(f"Auto-cataloged new crop/disease into catalog: {disease_name}")
                    except Exception as cat_err:
                        print(f"Auto-catalog notice: {cat_err}")
                        db.rollback()
                        db_disease = crud.get_disease_by_name(db, disease_name)

                disease_info = db_disease
        except Exception as e:
            print(f"Smart Vision diagnosis notice: {e}")

    return {
        "image_path": relative_img_path,
        "disease_name": disease_name,
        "confidence": confidence,
        "disease_details": disease_info,
        "gemini_analysis": gemini_analysis,
        "diagnosis_mode": mode
    }

# 3b. Direct Gemini Multimodal Diagnosis Endpoint
@app.post("/api/gemini/diagnose")
def gemini_diagnose_endpoint(
    file: UploadFile = File(...),
    crop_hint: str = Form(""),
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save uploaded file: {str(e)}"
        )

    analysis = gemini_service.diagnose_crop_with_gemini(file_path, crop_hint=crop_hint)
    return {
        "image_path": f"uploads/{unique_filename}",
        "gemini_analysis": analysis
    }

# 3c. AgriDoctor AI Chatbot
@app.post("/api/gemini/chat")
def gemini_chat_endpoint(
    req: schemas.GeminiChatRequest,
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    reply = gemini_service.chat_with_agronomist(
        message=req.message,
        context=req.context,
        language=req.language or "en"
    )
    return {"reply": reply}

# 3d. 7-Day Weather & Spray Action Plan
@app.post("/api/gemini/weather-plan")
def gemini_weather_plan_endpoint(
    req: schemas.GeminiWeatherPlanRequest,
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    plan = gemini_service.generate_weather_spray_plan(
        crop_name=req.crop_name,
        disease_name=req.disease_name,
        weather_data=req.weather_data
    )
    return plan


# 4. Save Prediction to History (Protected)
@app.post("/api/history", response_model=schemas.PredictionOut)
def save_prediction(
    prediction: schemas.PredictionSave,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    user = crud.get_user_by_email(db, current_user.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return crud.create_prediction(db=db, prediction=prediction, user_id=user.id)

# 5. Get User History (Protected)
@app.get("/api/history/{user_id}", response_model=List[schemas.PredictionOut])
def get_user_history(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    # Ensure users can only access their own history unless they are an admin
    token_user = crud.get_user_by_email(db, current_user.email)
    if not token_user:
         raise HTTPException(status_code=404, detail="User not found")
         
    if token_user.id != user_id and token_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to user history"
        )
    return crud.get_predictions_by_user(db=db, user_id=user_id)

# 5b. Delete Single Prediction (Protected)
@app.delete("/api/history/{prediction_id}")
def delete_user_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    token_user = crud.get_user_by_email(db, current_user.email)
    if not token_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    is_admin = (token_user.role == "admin")
    success = crud.delete_prediction(db=db, prediction_id=prediction_id, user_id=token_user.id, is_admin=is_admin)
    if not success:
        raise HTTPException(status_code=404, detail="Scan record not found or unauthorized to delete")
        
    return {"message": "Scan record deleted successfully", "id": prediction_id}

# 5c. Clear All User Scan History (Protected)
@app.delete("/api/history/clear/{user_id}")
def clear_all_history(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user_payload)
):
    token_user = crud.get_user_by_email(db, current_user.email)
    if not token_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if token_user.id != user_id and token_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
        
    deleted_count = crud.clear_user_predictions(db=db, user_id=user_id)
    return {"message": f"Successfully cleared all {deleted_count} scan records", "deleted_count": deleted_count}

# 6. Get Disease Details
@app.get("/api/disease/{disease_name}", response_model=schemas.DiseaseOut)
def get_disease(disease_name: str, db: Session = Depends(get_db)):
    db_disease = crud.get_disease_by_name(db, disease_name=disease_name)
    if not db_disease:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disease not found"
        )
    return db_disease

# 7. Admin - Get All Users
@app.get("/api/admin/users", response_model=List[schemas.UserOut])
def get_admin_users(
    db: Session = Depends(get_db), 
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    return crud.get_all_users(db=db)

# 8. Admin - Delete User
@app.delete("/api/admin/users/{user_id}")
def delete_admin_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    success = crud.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# 9. Admin - Get Stats
@app.get("/api/admin/stats", response_model=schemas.AdminStatsOut)
def get_stats(
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    return crud.get_admin_stats(db=db)

# 9b. Admin - Get All Diseases
@app.get("/api/admin/diseases", response_model=List[schemas.DiseaseOut])
def get_all_diseases_admin(
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    return crud.get_all_diseases(db=db)

# 10. Admin - Add Disease
@app.post("/api/admin/disease", response_model=schemas.DiseaseOut)
def add_disease(
    disease: schemas.DiseaseCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    db_disease = crud.get_disease_by_name(db, disease_name=disease.disease_name)
    if db_disease:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Disease class name already exists"
        )
    return crud.create_disease(db=db, disease=disease)

# 11. Admin - Edit Disease
@app.put("/api/admin/disease/{disease_id}", response_model=schemas.DiseaseOut)
def edit_disease(
    disease_id: int,
    disease_update: schemas.DiseaseUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    db_disease = crud.update_disease(db=db, disease_id=disease_id, disease_update=disease_update)
    if not db_disease:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disease definition not found"
        )
    return db_disease

# 12. Admin - Delete Disease
@app.delete("/api/admin/disease/{disease_id}")
def remove_disease(
    disease_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.require_admin)
):
    success = crud.delete_disease(db=db, disease_id=disease_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disease definition not found"
        )
    return {"message": "Disease definition deleted successfully"}
