#!/usr/bin/env python3
"""
Simple FastAPI Backend for LibraryCommon Job Search
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import json
import os
from datetime import datetime
import uvicorn

app = FastAPI(
    title="LibraryCommon Job Search API",
    description="Simple API for job search management",
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

# Data storage (JSON file-based for simplicity)
DATA_FILE = "positions_data.json"
COMPANIES_FILE = "companies_data.json"

def load_companies() -> List[Dict[str, Any]]:
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

def save_companies(companies: List[Dict[str, Any]]) -> bool:
    """Save companies to JSON file"""
    try:
        with open(COMPANIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(companies, f, indent=2, ensure_ascii=False, default=str)
        return True
    except Exception as e:
        print(f"Error saving companies: {e}")
        return False

def load_positions() -> List[Dict[str, Any]]:
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
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading positions: {e}")
        return []

def save_positions(positions: List[Dict[str, Any]]) -> bool:
    """Save positions to JSON file"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(positions, f, indent=2, ensure_ascii=False, default=str)
        return True
    except Exception as e:
        print(f"Error saving positions: {e}")
        return False

def get_next_id(positions: List[Dict[str, Any]]) -> int:
    """Get the next available ID"""
    if not positions:
        return 1
    return max(pos.get('id', 0) for pos in positions) + 1

# API Routes
@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {"message": "LibraryCommon Job Search API", "status": "active", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/companies")
async def get_companies():
    """Get all companies"""
    try:
        companies = load_companies()
        return {"success": True, "data": companies, "count": len(companies)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving companies: {str(e)}")

@app.get("/api/positions")
async def get_positions():
    """Get all positions"""
    try:
        positions = load_positions()
        return {"success": True, "data": positions, "count": len(positions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving positions: {str(e)}")

@app.get("/api/positions/{position_id}")
async def get_position(position_id: int):
    """Get a specific position by ID"""
    try:
        positions = load_positions()
        position = next((pos for pos in positions if pos.get('id') == position_id), None)
        
        if not position:
            raise HTTPException(status_code=404, detail="Position not found")
        
        return {"success": True, "data": position}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving position: {str(e)}")

@app.post("/api/positions")
async def create_position(position_data: Dict[str, Any]):
    """Create a new position"""
    try:
        positions = load_positions()
        
        # Validate required fields
        required_fields = ['companyId', 'position', 'initialContact', 'lastContact', 'contactType', 'status']
        for field in required_fields:
            if field not in position_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Create new position with auto-generated ID
        new_position = {
            "id": get_next_id(positions),
            **position_data
        }
        
        positions.append(new_position)
        
        if save_positions(positions):
            return {"success": True, "data": new_position, "message": "Position created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Error saving position")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating position: {str(e)}")

@app.put("/api/positions/{position_id}")
async def update_position(position_id: int, position_data: Dict[str, Any]):
    """Update an existing position"""
    try:
        positions = load_positions()
        position_index = next((i for i, pos in enumerate(positions) if pos.get('id') == position_id), None)
        
        if position_index is None:
            raise HTTPException(status_code=404, detail="Position not found")
        
        # Update position with new data
        positions[position_index].update(position_data)
        positions[position_index]['id'] = position_id  # Ensure ID doesn't change
        
        if save_positions(positions):
            return {"success": True, "data": positions[position_index], "message": "Position updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Error saving position")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating position: {str(e)}")

@app.delete("/api/positions/{position_id}")
async def delete_position(position_id: int):
    """Delete a position"""
    try:
        positions = load_positions()
        position_index = next((i for i, pos in enumerate(positions) if pos.get('id') == position_id), None)
        
        if position_index is None:
            raise HTTPException(status_code=404, detail="Position not found")
        
        deleted_position = positions.pop(position_index)
        
        if save_positions(positions):
            return {"success": True, "data": deleted_position, "message": "Position deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Error saving positions")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting position: {str(e)}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"success": False, "error": "Not Found", "detail": str(exc.detail)}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {"success": False, "error": "Internal Server Error", "detail": str(exc.detail)}

if __name__ == "__main__":
    print("Starting LibraryCommon Job Search API...")
    print("API Documentation available at: http://localhost:8000/docs")
    print("OpenAPI JSON available at: http://localhost:8000/openapi.json")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )