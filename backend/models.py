from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    created_at = Column(DateTime, server_default=func.now())

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String(255), unique=True, index=True, nullable=False)
    symptoms = Column(Text, nullable=True)
    causes = Column(Text, nullable=True)
    prevention = Column(Text, nullable=True)
    treatment = Column(Text, nullable=True)
    crop_type = Column(String(255), nullable=False)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(String(255), nullable=False)
    disease_name = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False)
    date = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="predictions")
