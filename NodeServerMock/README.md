# Job Search API Backend

Python FastAPI backend providing RESTful API endpoints for the Job Search application.

## Features

- **RESTful API Design**: Full CRUD operations for positions data
- **Swagger UI**: Interactive API documentation at `/docs`
- **Schema Validation**: Pydantic models with automatic validation
- **CORS Support**: Configured for HTMX frontend integration
- **Data Persistence**: JSON file-based storage with schema compliance

## Quick Start

### Prerequisites
- Python 3.8+ installed
- pip package manager

### Installation & Startup

**Windows:**
```powershell
cd NodeServerMock
.\start.bat
```

**Unix/macOS:**
```bash
cd NodeServerMock
chmod +x start.sh
./start.sh
```

**Manual Setup:**
```bash
cd NodeServerMock
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## API Endpoints

### Base URL: `http://127.0.0.1:8000`

### Positions
- `GET /positions` - Get all positions
- `GET /positions/{id}` - Get specific position
- `POST /positions` - Create new position
- `PUT /positions/{id}` - Update position
- `DELETE /positions/{id}` - Delete position

### Lookups
- `GET /companies` - Get all companies for dropdowns
- `GET /contact-types` - Get all contact types
- `GET /position-statuses` - Get all position statuses

## Documentation

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## Data Schema

Position model follows the data.json schema:
```json
{
  "id": "integer (auto-generated)",
  "companyId": "integer (required)",
  "position": "string (required)",
  "initialContactDate": "string (auto-generated)",
  "lastContactDate": "string (required)",
  "contactTypeId": "integer (required)",
  "statusId": "integer (required)",
  "isInactive": "boolean (default: false)"
}
```

## Integration

The API is designed to work seamlessly with the HTMX frontend:
- CORS configured for `http://localhost:3000`
- JSON responses compatible with JavaScript fetch API
- Proper HTTP status codes for error handling
- Auto-reload during development

## Development

The API uses file-based JSON storage located at `../../ServerMock/data.json` and automatically handles:
- ID generation for new records
- Date formatting
- Foreign key validation
- Schema compliance