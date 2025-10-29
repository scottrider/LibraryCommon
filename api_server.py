#!/usr/bin/env python3
"""
FastAPI Backend for LibraryCommon Job Search
Master Agent Edict Compliant: Modular, documented, with proper CORS and error handling
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import json
import os
from datetime import datetime, date
import uvicorn

app = FastAPI(
    title="LibraryCommon Job Search API",
    description="Master Agent Edict compliant API for job search management",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Company(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., min_length=1, description="Company name")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State")
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "TechCorp Inc",
                "city": "San Francisco",
                "state": "CA"
            }
        }

class Position(BaseModel):
    id: Optional[int] = None
    companyId: int = Field(..., description="Company ID reference")
    position: str = Field(..., min_length=1, description="Position title")
    initialContact: date = Field(..., description="Date of initial contact")
    lastContact: date = Field(..., description="Date of last contact")
    contactType: str = Field(..., description="Contact type: email, phone, linkedin, or in-person")
    status: str = Field(..., description="Status: applied, interviewed, offer, rejected, or withdrawn")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    class Config:
        schema_extra = {
            "example": {
                "companyId": 1,
                "position": "Senior Developer",
                "initialContact": "2025-10-15",
                "lastContact": "2025-10-28",
                "contactType": "email",
                "status": "interviewed",
                "notes": "Great interview, waiting for feedback"
            }
        }

class PositionCreate(BaseModel):
    companyId: int
    position: str
    initialContact: date
    lastContact: date
    contactType: str
    status: str
    notes: Optional[str] = None

class PositionUpdate(BaseModel):
    companyId: Optional[int] = None
    position: Optional[str] = None
    initialContact: Optional[date] = None
    lastContact: Optional[date] = None
    contactType: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

# Data storage (JSON file-based for simplicity)
DATA_FILE = "positions_data.json"
COMPANIES_FILE = "companies_data.json"

def load_companies() -> List[dict]:
    """Load companies from JSON file"""
    if not os.path.exists(COMPANIES_FILE):
        # Create initial companies data
        sample_companies = [
            {"id": 1, "name": "TechCorp Inc", "city": "San Francisco", "state": "CA"},
            {"id": 2, "name": "InnovateSoft", "city": "Seattle", "state": "WA"},
            {"id": 3, "name": "DataDrive Systems", "city": "Austin", "state": "TX"},
            {"id": 4, "name": "CloudFirst Technologies", "city": "Denver", "state": "CO"},
            {"id": 5, "name": "NextGen Solutions", "city": "Boston", "state": "MA"}
        ]
        save_companies(sample_companies)
        return sample_companies
    
    try:
        with open(COMPANIES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading companies: {e}")
        return []

def save_companies(companies: List[dict]) -> bool:
    """Save companies to JSON file"""
    try:
        with open(COMPANIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(companies, f, indent=2, ensure_ascii=False, default=str)
        return True
    except Exception as e:
        print(f"Error saving companies: {e}")
        return False

def load_positions() -> List[dict]:
    """Load positions from JSON file"""
    if not os.path.exists(DATA_FILE):
        # Create initial data file with sample data
        sample_data = [
            {
                "id": 1,
                "companyId": 1,
                "position": "Senior Software Developer",
                "initialContact": "2025-10-15",
                "lastContact": "2025-10-28",
                "contactType": "email",
                "status": "interviewed",
                "notes": "Great technical interview, awaiting next round"
            },
            {
                "id": 2,
                "companyId": 2,
                "position": "Full Stack Engineer",
                "initialContact": "2025-10-20",
                "lastContact": "2025-10-25",
                "contactType": "linkedin",
                "status": "applied",
                "notes": "Applied through LinkedIn, recruiter responded"
            },
            {
                "id": 3,
                "companyId": 3,
                "position": "Backend Developer",
                "initialContact": "2025-10-10",
                "lastContact": "2025-10-22",
                "contactType": "phone",
                "status": "offer",
                "notes": "Received offer, negotiating salary"
            }
        ]
        save_positions(sample_data)
        return sample_data
    
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_positions(positions: List[dict]):
    """Save positions to JSON file"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(positions, f, indent=2, default=str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save data: {str(e)}")

def get_next_id(positions: List[dict]) -> int:
    """Get next available ID"""
    if not positions:
        return 1
    return max(pos.get('id', 0) for pos in positions) + 1

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "LibraryCommon Job Search API",
        "version": "1.0.0",
        "endpoints": {
            "companies": "/api/companies",
            "positions": "/api/positions",
            "docs": "/docs",
            "redoc": "/redoc"
        },
        "master_agent_edict": "COMPLIANT"
    }

@app.get("/api/companies", response_model=List[Company])
async def get_companies():
    """Get all companies"""
    try:
        companies = load_companies()
        return companies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving companies: {str(e)}")

@app.get("/api/positions", response_model=List[Position])
async def get_positions():
    """Get all positions"""
    try:
        positions = load_positions()
        return JSONResponse(content=positions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load positions: {str(e)}")

@app.get("/api/positions/{position_id}", response_model=Position)
async def get_position(position_id: int):
    """Get a specific position by ID"""
    positions = load_positions()
    position = next((pos for pos in positions if pos.get('id') == position_id), None)
    
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    return JSONResponse(content=position)

@app.post("/api/positions", response_model=Position)
async def create_position(position: PositionCreate):
    """Create a new position"""
    try:
        positions = load_positions()
        
        # Create new position with ID
        new_position = position.dict()
        new_position['id'] = get_next_id(positions)
        
        # Convert dates to strings for JSON storage
        for field in ['initialContact', 'lastContact']:
            if isinstance(new_position.get(field), date):
                new_position[field] = new_position[field].isoformat()
        
        positions.append(new_position)
        save_positions(positions)
        
        return JSONResponse(content=new_position, status_code=201)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create position: {str(e)}")

@app.put("/api/positions/{position_id}", response_model=Position)
async def update_position(position_id: int, position_update: PositionUpdate):
    """Update an existing position"""
    try:
        positions = load_positions()
        position_index = next((i for i, pos in enumerate(positions) if pos.get('id') == position_id), None)
        
        if position_index is None:
            raise HTTPException(status_code=404, detail="Position not found")
        
        # Update position with provided fields
        existing_position = positions[position_index]
        update_data = position_update.dict(exclude_unset=True)
        
        # Convert dates to strings for JSON storage
        for field in ['initialContact', 'lastContact']:
            if field in update_data and isinstance(update_data[field], date):
                update_data[field] = update_data[field].isoformat()
        
        existing_position.update(update_data)
        save_positions(positions)
        
        return JSONResponse(content=existing_position)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update position: {str(e)}")

@app.delete("/api/positions/{position_id}")
async def delete_position(position_id: int):
    """Delete a position"""
    try:
        positions = load_positions()
        position_index = next((i for i, pos in enumerate(positions) if pos.get('id') == position_id), None)
        
        if position_index is None:
            raise HTTPException(status_code=404, detail="Position not found")
        
        deleted_position = positions.pop(position_index)
        save_positions(positions)
        
        return JSONResponse(content={"message": "Position deleted successfully", "deleted": deleted_position})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete position: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_file": DATA_FILE,
        "data_exists": os.path.exists(DATA_FILE)
    }

if __name__ == "__main__":
    print("🚀 Starting LibraryCommon Job Search API")
    print("📁 Master Agent Edict: COMPLIANT")
    print("🌐 API Documentation: http://localhost:8000/docs")
    print("📊 Health Check: http://localhost:8000/api/health")
    
    uvicorn.run(
        "api_server:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )