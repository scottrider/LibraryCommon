# 📋 LibraryCommon Project Edicts

## 🌐 REST Route Architecture Edict

**Date Established**: October 29, 2025  
**Status**: ✅ ACTIVE & MANDATORY  
**Scope**: All page routes and API endpoints

### 📜 Edict Statement
**ALL individual pages MUST be accessible via RESTful routes that follow standard HTTP conventions and resource-based URL patterns.**

### 🎯 Core Principles

#### 1. **Resource-Based URLs**
```
✅ CORRECT: /users/123
✅ CORRECT: /positions/456  
✅ CORRECT: /companies/789
❌ WRONG: /showUser?id=123
❌ WRONG: /getPosition?positionId=456
```

#### 2. **HTTP Method Conventions**
- `GET /resource` - List all resources
- `GET /resource/:id` - Get specific resource
- `POST /resource` - Create new resource
- `PUT /resource/:id` - Update entire resource
- `PATCH /resource/:id` - Partial update resource
- `DELETE /resource/:id` - Delete resource

#### 3. **Page Route Standards**
```
✅ CORRECT: GET /jobs - Jobs listing page
✅ CORRECT: GET /jobs/:id - Individual job page
✅ CORRECT: GET /companies - Companies listing page
✅ CORRECT: GET /companies/:id - Individual company page
✅ CORRECT: GET /users/:id/profile - User profile page
```

#### 4. **API Route Standards**
```
✅ CORRECT: GET /api/positions - API endpoint for positions
✅ CORRECT: GET /api/positions/:id - API endpoint for single position
✅ CORRECT: POST /api/positions - Create position API
✅ CORRECT: PUT /api/positions/:id - Update position API
```

### 🏗️ Implementation Requirements

#### **For All New Pages:**
1. Must use RESTful route patterns
2. Must separate page routes (`/resource`) from API routes (`/api/resource`)
3. Must include proper HTTP status codes
4. Must follow noun-based resource naming

#### **For Existing Pages:**
1. Refactor non-RESTful routes to REST patterns
2. Maintain backward compatibility during transition
3. Add deprecation warnings for old routes
4. Document migration path

### 📊 Current Route Audit

#### **✅ Compliant Routes:**
- `GET /` - Homepage (acceptable)
- `GET /home` - Home page (acceptable)
- `GET /about` - About page (acceptable)
- `GET /contact` - Contact page (acceptable)
- `GET /settings` - Settings page (acceptable)

#### **🔄 Routes Requiring Review:**
- `GET /jobsearch` → Should be `GET /jobs/search` or `GET /search?type=jobs`
- `GET /visual-testing` → Should be `GET /tools/visual-testing`
- `GET /prototyping` → Should be `GET /tools/prototyping`

#### **⚠️ Non-Compliant Routes:**
- None currently identified

### 🛠️ Implementation Guidelines

#### **1. Page Controller Pattern**
```javascript
// Individual resource pages
app.get('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    // Render individual job page
});

// Resource listing pages  
app.get('/jobs', (req, res) => {
    // Render jobs listing page
});
```

#### **2. API Controller Pattern**
```javascript
// API endpoints (separate from page routes)
app.get('/api/jobs/:id', (req, res) => {
    // Return JSON data
});

app.get('/api/jobs', (req, res) => {
    // Return JSON array
});
```

#### **3. Route Organization**
```
/pages/          - Static/informational pages
/users/          - User-related pages  
/jobs/           - Job-related pages
/companies/      - Company-related pages
/tools/          - Development tools
/api/            - All API endpoints
```

### 🎯 Benefits of This Edict

1. **🔍 Predictable URLs** - Developers and users can guess URL patterns
2. **📚 Better SEO** - Search engines prefer RESTful URL structures
3. **🛠️ Easier Maintenance** - Clear separation of concerns
4. **🔄 API Consistency** - Same patterns for web pages and API endpoints
5. **📖 Self-Documenting** - URLs describe the resource they access
6. **🌐 Industry Standard** - Follows widely accepted web conventions

### 🚨 Enforcement

#### **Code Review Requirements:**
- [ ] All new routes must be reviewed for REST compliance
- [ ] Non-compliant routes must be justified or refactored
- [ ] Route patterns must be documented

#### **Development Workflow:**
1. Design route structure before implementation
2. Follow noun-based resource naming
3. Use HTTP methods appropriately
4. Separate page and API concerns

### 📈 Migration Timeline

#### **Phase 1: Documentation & Planning** ✅
- [x] Create this edict document
- [x] Audit existing routes
- [x] Plan refactoring approach

#### **Phase 2: New Development** 🔄
- [ ] Apply REST patterns to all new features
- [ ] Create route planning templates
- [ ] Update development guidelines

#### **Phase 3: Legacy Refactoring** 📋
- [ ] Refactor existing non-compliant routes
- [ ] Add redirect handlers for backward compatibility
- [ ] Update internal links and references

#### **Phase 4: Cleanup** 🧹
- [ ] Remove deprecated route handlers
- [ ] Update documentation
- [ ] Validate compliance across entire application

---

## 🎯 Master Agent Edict Compliance

This edict aligns with the Master Agent architectural principles:
- ✅ **Consistency**: Standardized route patterns
- ✅ **Maintainability**: Clear, predictable structure  
- ✅ **Scalability**: RESTful patterns support growth
- ✅ **Documentation**: Self-documenting URL structure
- ✅ **Best Practices**: Industry-standard conventions

**Status**: 🟢 ACTIVE & ENFORCED