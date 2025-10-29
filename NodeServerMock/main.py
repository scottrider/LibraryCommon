from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import json
import os
from datetime import date

app = FastAPI(
    title="Job Search API",
    description="HTMX-compatible API for job search data management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for HTMX integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data from JSON schema
def load_data():
    # Try multiple possible paths for data.json
    possible_paths = [
        os.path.join("..", "..", "ServerMock", "data.json"),
        os.path.join("..", "..", "..", "ServerMock", "data.json"),
        "data.json"  # fallback to local file
    ]
    
    for data_path in possible_paths:
        try:
            if os.path.exists(data_path):
                with open(data_path, 'r') as f:
                    return json.load(f)
        except (FileNotFoundError, PermissionError):
            continue
    
    # Return default data if no file found
    print("Warning: data.json not found, using default data")
    return {
        "entities": {
            "positions": {
                "data": [
                    {
                        "id": 1,
                        "companyId": 1,
                        "position": "Sample Position",
                        "initialContactDate": "2025-10-28",
                        "lastContactDate": "2025-10-28",
                        "contactTypeId": 1,
                        "statusId": 1,
                        "isInactive": False
                    }
                ]
            },
            "companies": {
                "data": [
                    {"id": 1, "name": "Sample Company", "city": "Sample City", "state": "XX"}
                ]
            },
            "contactTypes": {
                "data": [
                    {"id": 1, "name": "Email"},
                    {"id": 2, "name": "Phone"},
                    {"id": 3, "name": "Video Call"}
                ]
            },
            "positionStatuses": {
                "data": [
                    {"id": 1, "name": "Applied"},
                    {"id": 2, "name": "Interviewed"},
                    {"id": 3, "name": "Offer"}
                ]
            }
        }
    }

def save_data(data):
    # Try to save to the original data.json location if it exists
    possible_paths = [
        os.path.join("..", "..", "ServerMock", "data.json"),
        os.path.join("..", "..", "..", "ServerMock", "data.json")
    ]
    
    for data_path in possible_paths:
        try:
            if os.path.exists(os.path.dirname(data_path)):
                with open(data_path, 'w') as f:
                    json.dump(data, f, indent=2)
                return
        except (FileNotFoundError, PermissionError):
            continue
    
    # Fallback: save to local directory
    print("Warning: Could not save to original data.json location, saving locally")
    with open("data.json", 'w') as f:
        json.dump(data, f, indent=2)

# Pydantic models based on schema
class PositionBase(BaseModel):
    companyId: int = Field(..., description="Foreign key to company")
    position: str = Field(..., description="Job position title")
    lastContactDate: str = Field(..., description="Last contact date (YYYY-MM-DD)")
    contactTypeId: int = Field(..., description="Foreign key to contact type")
    statusId: int = Field(..., description="Foreign key to position status")

class PositionCreate(PositionBase):
    pass

class PositionUpdate(BaseModel):
    companyId: Optional[int] = None
    position: Optional[str] = None
    lastContactDate: Optional[str] = None
    contactTypeId: Optional[int] = None
    statusId: Optional[int] = None

class Position(PositionBase):
    id: int
    initialContactDate: str
    isInactive: bool = False

class Company(BaseModel):
    id: int
    name: str
    address1: str = ""
    address2: str = ""
    address3: str = ""
    city: str = ""
    state: str = ""
    zip: str = ""
    phone: str = ""
    email: str = ""
    website: str = ""

class ContactType(BaseModel):
    id: int
    name: str

class PositionStatus(BaseModel):
    id: int
    name: str

# API Endpoints
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Job Search API - Visit /docs for Swagger UI"}

@app.get("/positions", response_model=List[Position], tags=["Positions"])
def get_positions():
    """Get all positions with company and status information"""
    data = load_data()
    return data["entities"]["positions"]["data"]

@app.get("/positions/{position_id}", response_model=Position, tags=["Positions"])
def get_position(position_id: int):
    """Get a specific position by ID"""
    data = load_data()
    positions = data["entities"]["positions"]["data"]
    position = next((p for p in positions if p["id"] == position_id), None)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    return position

@app.post("/positions", response_model=Position, tags=["Positions"])
def create_position(position: PositionCreate):
    """Create a new position"""
    data = load_data()
    positions = data["entities"]["positions"]["data"]
    
    # Generate new ID
    new_id = max([p["id"] for p in positions], default=0) + 1
    
    # Create new position with auto-generated fields
    new_position = {
        "id": new_id,
        "companyId": position.companyId,
        "position": position.position,
        "initialContactDate": str(date.today()),
        "lastContactDate": position.lastContactDate,
        "contactTypeId": position.contactTypeId,
        "statusId": position.statusId,
        "isInactive": False
    }
    
    positions.append(new_position)
    save_data(data)
    return new_position

@app.put("/positions/{position_id}", response_model=Position, tags=["Positions"])
def update_position(position_id: int, position_update: PositionUpdate):
    """Update an existing position"""
    data = load_data()
    positions = data["entities"]["positions"]["data"]
    
    position_index = next((i for i, p in enumerate(positions) if p["id"] == position_id), None)
    if position_index is None:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Update only provided fields
    current_position = positions[position_index]
    update_data = position_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        current_position[field] = value
    
    save_data(data)
    return current_position

@app.delete("/positions/{position_id}", tags=["Positions"])
def delete_position(position_id: int):
    """Delete a position"""
    data = load_data()
    positions = data["entities"]["positions"]["data"]
    
    position_index = next((i for i, p in enumerate(positions) if p["id"] == position_id), None)
    if position_index is None:
        raise HTTPException(status_code=404, detail="Position not found")
    
    deleted_position = positions.pop(position_index)
    save_data(data)
    return {"message": f"Position {position_id} deleted successfully"}

# Lookup endpoints for dropdowns
@app.get("/companies", response_model=List[Company], tags=["Lookups"])
def get_companies():
    """Get all companies for dropdown selection"""
    data = load_data()
    return data["entities"]["companies"]["data"]

@app.get("/contact-types", response_model=List[ContactType], tags=["Lookups"])
def get_contact_types():
    """Get all contact types for dropdown selection"""
    data = load_data()
    return data["entities"]["contactTypes"]["data"]

@app.get("/position-statuses", response_model=List[PositionStatus], tags=["Lookups"])
def get_position_statuses():
    """Get all position statuses for dropdown selection"""
    data = load_data()
    return data["entities"]["positionStatuses"]["data"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)