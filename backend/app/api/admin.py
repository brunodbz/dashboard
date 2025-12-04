from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models import User, DataSource, UserRole
from app.schemas import UserCreate, UserResponse, DataSourceCreate, DataSourceResponse
from app.auth import get_current_user, require_role, get_password_hash

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Listar todos os usuários (apenas admin)"""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Criar novo usuário (apenas admin)"""
    
    # Verificar duplicação
    result = await db.execute(
        select(User).where(User.username == user_data.username)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role: UserRole,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Atualizar role de usuário"""
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role
    await db.commit()
    
    return {"message": "User role updated successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Deletar usuário"""
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.delete(user)
    await db.commit()
    
    return {"message": "User deleted successfully"}

@router.get("/sources", response_model=List[DataSourceResponse])
async def list_data_sources(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Listar fontes de dados configuradas"""
    result = await db.execute(select(DataSource))
    sources = result.scalars().all()
    return sources

@router.post("/sources", response_model=DataSourceResponse, status_code=status.HTTP_201_CREATED)
async def create_data_source(
    source_data: DataSourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Criar nova fonte de dados"""
    
    db_source = DataSource(
        name=source_data.name,
        source_type=source_data.source_type,
        config=source_data.config,
        is_enabled=source_data.is_enabled
    )
    
    db.add(db_source)
    await db.commit()
    await db.refresh(db_source)
    
    return db_source

@router.patch("/sources/{source_id}")
async def update_data_source(
    source_id: int,
    source_data: DataSourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Atualizar configuração de fonte de dados"""
    
    result = await db.execute(select(DataSource).where(DataSource.id == source_id))
    source = result.scalar_one_or_none()
    
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    source.name = source_data.name
    source.config = source_data.config
    source.is_enabled = source_data.is_enabled
    
    await db.commit()
    
    return {"message": "Data source updated successfully"}

@router.delete("/sources/{source_id}")
async def delete_data_source(
    source_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Deletar fonte de dados"""
    
    result = await db.execute(select(DataSource).where(DataSource.id == source_id))
    source = result.scalar_one_or_none()
    
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    await db.delete(source)
    await db.commit()
    
    return {"message": "Data source deleted successfully"}
