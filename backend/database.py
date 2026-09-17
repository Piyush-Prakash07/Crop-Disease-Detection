import pymysql
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_USER = "root"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "crop_disease_db"

# Create database if it doesn't exist
try:
    conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, port=int(DB_PORT))
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Database creation hook warning: {e}")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DATABASE_URL, 
    pool_size=10, 
    max_overflow=20, 
    pool_recycle=3600,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
