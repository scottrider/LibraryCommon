#!/usr/bin/env python3
"""
Flask Backend for LibraryCommon Job Search
Simple REST API using Flask
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Data storage (JSON file-based for simplicity)
DATA_FILE = "positions_data.json"

def load_positions():
    """Load positions from JSON file"""
    if not os.path.exists(DATA_FILE):
        # Create initial data file with sample data
        sample_data = [
            {
                "id": 1,
                "company": "TechCorp Inc",
                "position": "Senior Software Developer",
                "initialContact": "2025-10-15",
                "lastContact": "2025-10-28",
                "contactType": "email",
                "status": "interviewed",
                "notes": "Great technical interview, awaiting next round"
            },
            {
                "id": 2,
                "company": "InnovateSoft",
                "position": "Full Stack Engineer",
                "initialContact": "2025-10-20",
                "lastContact": "2025-10-25",
                "contactType": "linkedin",
                "status": "applied",
                "notes": "Applied through LinkedIn, recruiter responded"
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

def save_positions(positions):
    """Save positions to JSON file"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(positions, f, indent=2, ensure_ascii=False, default=str)
        return True
    except Exception as e:
        print(f"Error saving positions: {e}")
        return False

def get_next_id(positions):
    """Get the next available ID"""
    if not positions:
        return 1
    return max(pos.get('id', 0) for pos in positions) + 1

# API Routes
@app.route('/')
def root():
    """Root endpoint - API status"""
    return jsonify({
        "message": "LibraryCommon Job Search API",
        "status": "active",
        "version": "1.0.0"
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/docs')
def api_docs():
    """API documentation"""
    return jsonify({
        "title": "LibraryCommon Job Search API",
        "version": "1.0.0",
        "endpoints": {
            "GET /": "API status",
            "GET /health": "Health check",
            "GET /api/positions": "Get all positions",
            "GET /api/positions/<id>": "Get specific position",
            "POST /api/positions": "Create new position",
            "PUT /api/positions/<id>": "Update position",
            "DELETE /api/positions/<id>": "Delete position"
        },
        "position_model": {
            "id": "integer (auto-generated)",
            "company": "string (required)",
            "position": "string (required)",
            "initialContact": "string (YYYY-MM-DD, required)",
            "lastContact": "string (YYYY-MM-DD, required)",
            "contactType": "string (required: email, phone, linkedin, in-person)",
            "status": "string (required: applied, interviewed, offer, rejected, withdrawn)",
            "notes": "string (optional)"
        }
    })

@app.route('/api/positions', methods=['GET'])
def get_positions():
    """Get all positions"""
    try:
        positions = load_positions()
        return jsonify({
            "success": True,
            "data": positions,
            "count": len(positions)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error retrieving positions: {str(e)}"
        }), 500

@app.route('/api/positions/<int:position_id>', methods=['GET'])
def get_position(position_id):
    """Get a specific position by ID"""
    try:
        positions = load_positions()
        position = next((pos for pos in positions if pos.get('id') == position_id), None)
        
        if not position:
            return jsonify({
                "success": False,
                "error": "Position not found"
            }), 404
        
        return jsonify({
            "success": True,
            "data": position
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error retrieving position: {str(e)}"
        }), 500

@app.route('/api/positions', methods=['POST'])
def create_position():
    """Create a new position"""
    try:
        position_data = request.get_json()
        
        if not position_data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        # Validate required fields
        required_fields = ['company', 'position', 'initialContact', 'lastContact', 'contactType', 'status']
        for field in required_fields:
            if field not in position_data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        positions = load_positions()
        
        # Create new position with auto-generated ID
        new_position = {
            "id": get_next_id(positions),
            **position_data
        }
        
        positions.append(new_position)
        
        if save_positions(positions):
            return jsonify({
                "success": True,
                "data": new_position,
                "message": "Position created successfully"
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": "Error saving position"
            }), 500
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error creating position: {str(e)}"
        }), 500

@app.route('/api/positions/<int:position_id>', methods=['PUT'])
def update_position(position_id):
    """Update an existing position"""
    try:
        position_data = request.get_json()
        
        if not position_data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        positions = load_positions()
        position_index = next((i for i, pos in enumerate(positions) if pos.get('id') == position_id), None)
        
        if position_index is None:
            return jsonify({
                "success": False,
                "error": "Position not found"
            }), 404
        
        # Update position with new data
        positions[position_index].update(position_data)
        positions[position_index]['id'] = position_id  # Ensure ID doesn't change
        
        if save_positions(positions):
            return jsonify({
                "success": True,
                "data": positions[position_index],
                "message": "Position updated successfully"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Error saving position"
            }), 500
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error updating position: {str(e)}"
        }), 500

@app.route('/api/positions/<int:position_id>', methods=['DELETE'])
def delete_position(position_id):
    """Delete a position"""
    try:
        positions = load_positions()
        position_index = next((i for i, pos in enumerate(positions) if pos.get('id') == position_id), None)
        
        if position_index is None:
            return jsonify({
                "success": False,
                "error": "Position not found"
            }), 404
        
        deleted_position = positions.pop(position_index)
        
        if save_positions(positions):
            return jsonify({
                "success": True,
                "data": deleted_position,
                "message": "Position deleted successfully"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Error saving positions"
            }), 500
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error deleting position: {str(e)}"
        }), 500

if __name__ == "__main__":
    print("Starting LibraryCommon Job Search API...")
    print("API running at: http://localhost:8000")
    print("API Documentation available at: http://localhost:8000/docs")
    
    app.run(host="127.0.0.1", port=8000, debug=True)