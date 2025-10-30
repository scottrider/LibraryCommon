# 🚀 LibraryCommon Technology Stack Documentation

## 📊 Project Overview
**LibraryCommon** is a full-stack job search management application featuring a modern web interface with real-time data management capabilities.

### 🎯 Core Purpose
- Job position tracking and management
- Company relationship management
- Real-time CRUD operations
- Active/Inactive record filtering
- Professional UI with responsive design

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LibraryCommon Stack                     │
├─────────────────────┬───────────────────┬───────────────────┤
│     Frontend        │     Backend       │     Data Layer    │
│                     │                   │                   │
│ ┌─────────────────┐ │ ┌───────────────┐ │ ┌───────────────┐ │
│ │   Node.js       │ │ │   FastAPI     │ │ │   JSON Schema │ │
│ │   Express       │ │ │   Python      │ │ │   In-Memory   │ │
│ │   Port 3000     │ │ │   Port 8000   │ │ │   Storage     │ │
│ └─────────────────┘ │ └───────────────┘ │ └───────────────┘ │
│                     │                   │                   │
│ ┌─────────────────┐ │ ┌───────────────┐ │ ┌───────────────┐ │
│ │   JavaScript    │ │ │   Uvicorn     │ │ │   Pydantic    │ │
│ │   DataGrid      │ │ │   Auto-reload │ │ │   Validation  │ │
│ │   Components    │ │ │   CORS        │ │ │   Schemas     │ │
│ └─────────────────┘ │ └───────────────┘ │ └───────────────┘ │
└─────────────────────┴───────────────────┴───────────────────┘
```

---

## 🐍 Backend Technology Stack

### **FastAPI Framework (Python)**
- **Version**: Latest
- **Purpose**: RESTful API server
- **Port**: 8000
- **Features**:
  - Auto-generated OpenAPI documentation
  - Request/Response validation
  - CORS middleware
  - Health check endpoints

### **Core Dependencies**
```python
fastapi>=0.104.0      # Web framework
uvicorn>=0.24.0       # ASGI server
pydantic>=2.0.0       # Data validation
python-multipart      # Form data handling
```

### **API Endpoints**
- `GET /api/positions` - Retrieve all positions
- `POST /api/positions` - Create new position
- `PUT /api/positions/{id}` - Update position
- `DELETE /api/positions/{id}` - Delete position
- `GET /api/companies` - Retrieve all companies
- `GET /api/health` - Health check
- `GET /docs` - Interactive API documentation

---

## 🟢 Frontend Technology Stack

### **Node.js + Express Framework**
- **Version**: Node.js v18+
- **Purpose**: Web server and SSR
- **Port**: 3000
- **Template Engine**: EJS

### **Core Dependencies**
```json
{
  "express": "^4.18.0",
  "ejs": "^3.1.0",
  "dotenv": "^16.0.0",
  "path": "built-in"
}
```

### **Frontend Architecture**
- **JavaScript**: Vanilla ES6+ (No frameworks)
- **CSS**: Modern CSS3 with Flexbox/Grid
- **Methodology**: BEM (Block Element Modifier)
- **Responsive**: Mobile-first design
- **Components**: Modular, reusable architecture

---

## 📊 DataGrid Component Architecture

### **Core Features**
```javascript
class DataGridControl {
  // CRUD Operations
  - loadData()          // Fetch from API
  - createRow()         // Add new record
  - updateRow()         // Edit existing
  - deleteRow()         // Remove record
  
  // UI Features
  - editRow()           // Inline editing
  - saveRow()           // Persist changes
  - cancelEdit()        // Abort changes
  
  // Data Management
  - loadCompanies()     // Populate dropdowns
  - toggleDeleted()     // Filter active/inactive
  - renderTable()       // Dynamic rendering
}
```

### **Integration Points**
- **API Communication**: Fetch API with JSON
- **Event Handling**: Native DOM events
- **State Management**: Class-based state
- **Error Handling**: Try-catch with user feedback

---

## 🎨 UI/UX Design System

### **Component Standards**
- **Buttons**: 24x24 pixel standardization
- **Colors**: Professional blue/green palette
- **Typography**: System fonts (-apple-system, Segoe UI)
- **Spacing**: Consistent 8px grid system

### **Interactive Elements**
```css
/* Toggle Switch (W3C Style) */
.toggle-switch {
  width: 44px;
  height: 24px;
  /* OFF (Red) = Inactive Records */
  /* ON (Green) = Active Records */
}

/* Button Standardization */
.btn--sm {
  width: 24px !important;
  height: 24px !important;
  padding: 2px !important;
}
```

---

## 🛡️ Security Implementation

### **Content Security Policy**
```javascript
"default-src 'self'; " +
"script-src 'self' 'unsafe-inline' https://unpkg.com; " +
"style-src 'self' 'unsafe-inline'; " +
"connect-src 'self' http://127.0.0.1:8000 http://localhost:8000;"
```

### **Security Headers**
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### **Development Security**
- Environment variable protection (dotenv)
- CORS configuration for local development
- Input validation via Pydantic

---

## ⚡ Performance Optimization

### **Cache Control Strategy**
```javascript
// Aggressive Development Cache Control
res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
res.set('Pragma', 'no-cache');
res.set('Expires', '0');
res.set('Last-Modified', new Date().toUTCString());
```

### **Development Features**
- **Auto-reload**: Python server watches file changes
- **Cache invalidation**: Dynamic headers prevent stale content
- **Debug endpoints**: `/dev/reload` for manual cache clearing

---

## 📋 Data Schema

### **Companies Entity**
```json
{
  "id": "integer (Primary Key)",
  "name": "string (Required)",
  "address1": "string",
  "address2": "string", 
  "address3": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "phone": "string (Phone format)",
  "email": "string (Email format)",
  "website": "string (URI format)"
}
```

### **Positions Entity**
```json
{
  "id": "integer (Primary Key)",
  "companyId": "integer (Foreign Key → companies.id)",
  "position": "string (Required)",
  "initialContactDate": "date (Read-only)",
  "lastContactDate": "date (Editable)",
  "contactTypeId": "integer (Foreign Key)",
  "statusId": "integer (Foreign Key)",
  "isInactive": "boolean (Toggle filter)"
}
```

---

## 🔧 Development Workflow

### **Starting the Application**
```bash
# Terminal 1: Start Python API
cd C:\Users\Scott\source\repos\LibraryCommon
python api_server.py

# Terminal 2: Start Node.js Web Server
cd C:\Users\Scott\source\repos\LibraryCommon
node server.js
```

### **Development URLs**
- **Main Application**: http://localhost:3000/jobsearch
- **API Documentation**: http://localhost:8000/docs
- **Test DataGrid**: http://localhost:3000/test-datagrid
- **System Status**: http://localhost:3000/settings
- **Cache Clear**: http://localhost:3000/dev/reload

### **File Structure**
```
LibraryCommon/
├── server.js                 # Node.js Express server
├── api_server.py             # Python FastAPI server
├── package.json              # Node.js dependencies
├── requirements.txt          # Python dependencies
├── public/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   └── js/
│       └── datagrid.js       # DataGrid component
├── views/
│   └── index.ejs             # Main template
└── screenshots/              # Visual testing output
```

---

## 🚀 Deployment Considerations

### **Production Readiness Checklist**
- [ ] Environment variable configuration
- [ ] Database integration (replace in-memory storage)
- [ ] SSL/TLS certificate setup
- [ ] Production cache strategy
- [ ] Error logging and monitoring
- [ ] API rate limiting
- [ ] User authentication/authorization

### **Scaling Recommendations**
- **Database**: PostgreSQL or MongoDB
- **Caching**: Redis for session management
- **Load Balancing**: Nginx reverse proxy
- **Monitoring**: Application performance monitoring
- **CI/CD**: Automated testing and deployment

---

## 📈 Feature Roadmap

### **Completed Features** ✅
- Full-stack CRUD operations
- Real-time data synchronization
- Active/Inactive record filtering
- Company dropdown integration
- Responsive design
- Security headers implementation
- Development cache optimization

### **Future Enhancements** 🎯
- User authentication system
- Advanced search and filtering
- Data export functionality
- Email integration for contacts
- Calendar integration for follow-ups
- Mobile app development
- Real-time notifications

---

## 🤝 Master Agent Edict Compliance

This project follows Master Agent Edict principles:
- **Modular Architecture**: Separation of concerns
- **Documentation**: Comprehensive inline and external docs
- **Testing**: Visual regression testing capability
- **Security**: Defense-in-depth approach
- **Performance**: Optimized for development workflow
- **Maintainability**: Clean, readable codebase

---

*Last Updated: October 29, 2025*
*Version: 1.0.0*
*Maintainer: Scott Rider*