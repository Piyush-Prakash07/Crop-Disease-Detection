from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    user_id: int

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# Disease Schemas
class DiseaseCreate(BaseModel):
    disease_name: str
    symptoms: str
    causes: str
    prevention: str
    treatment: str
    crop_type: str

class DiseaseUpdate(BaseModel):
    disease_name: Optional[str] = None
    symptoms: Optional[str] = None
    causes: Optional[str] = None
    prevention: Optional[str] = None
    treatment: Optional[str] = None
    crop_type: Optional[str] = None

class DiseaseOut(BaseModel):
    id: int
    disease_name: str
    symptoms: Optional[str] = None
    causes: Optional[str] = None
    prevention: Optional[str] = None
    treatment: Optional[str] = None
    crop_type: str

    class Config:
        from_attributes = True

# Prediction Schemas
class PredictionSave(BaseModel):
    image_path: str
    disease_name: str
    confidence: float

class PredictionOut(BaseModel):
    id: int
    user_id: int
    image_path: str
    disease_name: str
    confidence: float
    date: datetime

    class Config:
        from_attributes = True

# Admin Stats
class AdminStatsOut(BaseModel):
    total_users: int
    total_predictions: int
    disease_frequency: dict

# Gemini Schemas
class GeminiChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None
    language: Optional[str] = "en"

class GeminiWeatherPlanRequest(BaseModel):
    crop_name: str
    disease_name: str
    weather_data: dict

