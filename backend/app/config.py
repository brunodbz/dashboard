from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost"]
    
    # Elasticsearch
    ELASTICSEARCH_URL: str
    ELASTICSEARCH_USERNAME: str = ""
    ELASTICSEARCH_PASSWORD: str = ""
    
    # Tenable
    TENABLE_ACCESS_KEY: str
    TENABLE_SECRET_KEY: str
    TENABLE_URL: str = "https://cloud.tenable.com"
    
    # Microsoft Defender
    DEFENDER_TENANT_ID: str
    DEFENDER_CLIENT_ID: str
    DEFENDER_CLIENT_SECRET: str
    
    # OpenCTI
    OPENCTI_URL: str
    OPENCTI_TOKEN: str
    
    # Criticality Thresholds
    CVSS_HIGH_THRESHOLD: float = 7.0
    CVSS_CRITICAL_THRESHOLD: float = 9.0
    RISK_SCORE_HIGH_THRESHOLD: int = 70
    RISK_SCORE_CRITICAL_THRESHOLD: int = 90
    CONFIDENCE_THRESHOLD: int = 75
    
    class Config:
        env_file = ".env"

settings = Settings()
