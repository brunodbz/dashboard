from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import UserRole

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.VIEWER

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class DataSourceCreate(BaseModel):
    name: str
    source_type: str
    config: Dict[str, Any]
    is_enabled: bool = True

class DataSourceResponse(BaseModel):
    id: int
    name: str
    source_type: str
    is_enabled: bool
    last_sync: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class CriticalAlert(BaseModel):
    id: str
    source: str
    severity: str
    title: str
    description: Optional[str]
    asset: Optional[str]
    score: float
    timestamp: datetime
    correlation_count: int = 0
    related_indicators: List[str] = []

class CorrelationResult(BaseModel):
    asset: str
    risk_score: int
    alerts: List[CriticalAlert]
    vulnerability_count: int
    threat_indicators: List[str]
    mitre_techniques: List[str]
