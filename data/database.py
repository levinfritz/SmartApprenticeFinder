import sqlite3
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class Company(Base):
    __tablename__ = 'companies'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    website = Column(String(500))
    size = Column(String(50))  # "klein", "mittel", "gross"
    rating = Column(Float)
    location = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

class Apprenticeship(Base):
    __tablename__ = 'apprenticeships'
    
    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    profession = Column(String(100), nullable=False)
    description = Column(Text)
    requirements = Column(Text)
    benefits = Column(Text)
    location = Column(String(255), nullable=False)
    postal_code = Column(String(10))
    start_date = Column(String(50))
    duration_years = Column(Integer)
    salary_min = Column(Float)
    salary_max = Column(Float)
    application_deadline = Column(DateTime)
    application_url = Column(String(500))
    source_url = Column(String(500), nullable=False)
    source_platform = Column(String(50), nullable=False)  # "yousty", "company_website", etc.
    company_name = Column(String(255))  # Temporary field for scraped company name
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class ScrapingLog(Base):
    __tablename__ = 'scraping_logs'
    
    id = Column(Integer, primary_key=True)
    platform = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)  # "success", "error", "partial"
    items_found = Column(Integer, default=0)
    items_new = Column(Integer, default=0)
    items_updated = Column(Integer, default=0)
    error_message = Column(Text)
    started_at = Column(DateTime, nullable=False)
    finished_at = Column(DateTime)
    duration_seconds = Column(Float)

def create_database(db_path="data/apprenticeships.db"):
    """Create database and tables if they don't exist"""
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    # Create engine and tables
    engine = create_engine(f'sqlite:///{db_path}')
    Base.metadata.create_all(engine)
    
    return engine

def get_session(db_path="data/apprenticeships.db"):
    """Get database session"""
    engine = create_database(db_path)
    Session = sessionmaker(bind=engine)
    return Session()

if __name__ == "__main__":
    # Test database creation
    engine = create_database()
    print("Database created successfully!")
    
    # Test session
    session = get_session()
    print("Database session created successfully!")
    session.close()