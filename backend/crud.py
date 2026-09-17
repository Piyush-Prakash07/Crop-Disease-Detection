from sqlalchemy.orm import Session
import models
import schemas
import auth
from sqlalchemy import func

# User Operations
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = auth.hash_password(user.password)
    # Check if this email is the proposed default admin
    role = "user"
    if user.email.lower() == "admin@cropdetector.com":
        role = "admin"
    db_user = models.User(name=user.name, email=user.email.lower(), password=hashed_pw, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_all_users(db: Session):
    return db.query(models.User).all()

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# Prediction Operations
def create_prediction(db: Session, prediction: schemas.PredictionSave, user_id: int):
    db_prediction = models.Prediction(
        user_id=user_id,
        image_path=prediction.image_path,
        disease_name=prediction.disease_name,
        confidence=prediction.confidence
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_predictions_by_user(db: Session, user_id: int):
    return db.query(models.Prediction).filter(models.Prediction.user_id == user_id).order_by(models.Prediction.date.desc()).all()

def delete_prediction(db: Session, prediction_id: int, user_id: int, is_admin: bool = False):
    query = db.query(models.Prediction).filter(models.Prediction.id == prediction_id)
    if not is_admin:
        query = query.filter(models.Prediction.user_id == user_id)
    prediction = query.first()
    if prediction:
        db.delete(prediction)
        db.commit()
        return True
    return False

def clear_user_predictions(db: Session, user_id: int):
    deleted_count = db.query(models.Prediction).filter(models.Prediction.user_id == user_id).delete()
    db.commit()
    return deleted_count

# Disease Operations
def get_disease_by_name(db: Session, disease_name: str):
    if not disease_name:
        return None
        
    # 1. Direct exact match
    exact = db.query(models.Disease).filter(models.Disease.disease_name == disease_name).first()
    if exact:
        return exact

    # 2. Case-insensitive exact match
    ci = db.query(models.Disease).filter(func.lower(models.Disease.disease_name) == disease_name.lower()).first()
    if ci:
        return ci

    # 3. Cleaned string match (stripping underscores, spaces, hyphens)
    clean_target = disease_name.lower().replace("_", "").replace(" ", "").replace("-", "")
    all_diseases = db.query(models.Disease).all()
    for d in all_diseases:
        clean_db_name = d.disease_name.lower().replace("_", "").replace(" ", "").replace("-", "")
        if clean_db_name == clean_target:
            return d

    # 4. Normalized substring / keyword match
    for d in all_diseases:
        clean_db_name = d.disease_name.lower().replace("_", "").replace(" ", "").replace("-", "")
        if clean_target in clean_db_name or clean_db_name in clean_target:
            return d

    return None

def get_disease_by_id(db: Session, disease_id: int):
    return db.query(models.Disease).filter(models.Disease.id == disease_id).first()

def get_all_diseases(db: Session):
    return db.query(models.Disease).all()

def create_disease(db: Session, disease: schemas.DiseaseCreate):
    db_disease = models.Disease(
        disease_name=disease.disease_name,
        symptoms=disease.symptoms,
        causes=disease.causes,
        prevention=disease.prevention,
        treatment=disease.treatment,
        crop_type=disease.crop_type
    )
    db.add(db_disease)
    db.commit()
    db.refresh(db_disease)
    return db_disease

def update_disease(db: Session, disease_id: int, disease_update: schemas.DiseaseUpdate):
    db_disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not db_disease:
        return None
    
    # Update properties dynamically
    update_data = disease_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_disease, key, value)
        
    db.commit()
    db.refresh(db_disease)
    return db_disease

def delete_disease(db: Session, disease_id: int):
    db_disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if db_disease:
        db.delete(db_disease)
        db.commit()
        return True
    return False

# Admin Dashboard Stats
def get_admin_stats(db: Session):
    total_users = db.query(models.User).count()
    total_predictions = db.query(models.Prediction).count()
    
    # Query prediction counts grouped by disease_name
    freq_query = db.query(models.Prediction.disease_name, func.count(models.Prediction.id))\
        .group_by(models.Prediction.disease_name).all()
        
    disease_frequency = {disease_name: count for disease_name, count in freq_query}
    
    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "disease_frequency": disease_frequency
    }
