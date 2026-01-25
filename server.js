const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
    // Content Security Policy
    res.set('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://unpkg.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' http://127.0.0.1:8000 http://localhost:8000; " +
        "font-src 'self' https:; " +
        "frame-ancestors 'none';"
    );
    
    // Security headers
    res.set('X-Frame-Options', 'DENY');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('X-XSS-Protection', '1; mode=block');
    
    next();
});

// Cache Control for Development
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.set('Last-Modified', new Date().toUTCString());
    res.set('ETag', Math.random().toString(36));
    next();
});

app.use(express.static(path.join(__dirname, 'public'), {
    etag: false,
    lastModified: false,
    maxAge: 0,
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Last-Modified', new Date().toUTCString());
    }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false); // Disable EJS template caching

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Navigation routes
app.get('/home', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Welcome Home</h1>
            <p>This is the home section of ScottRider.com</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Recent Activity</h3>
                    <p>Latest updates and recent work highlights.</p>
                </div>
                
                <div class="content-card">
                    <h3>Quick Links</h3>
                    <p>Fast access to frequently used resources and tools.</p>
                </div>
            </div>
        </div>
    `);
});

app.get('/projects', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Projects Portfolio</h1>
            <p>A showcase of development projects and contributions</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>IFS PowerShell Project</h3>
                    <p>Interactive File System manager with AI integration and project scaffolding.</p>
                    <button class="btn btn-primary">View Details</button>
                </div>
                
                <div class="content-card">
                    <h3>HTMX Web Applications</h3>
                    <p>Server-rendered applications with dynamic partial updates.</p>
                    <button class="btn btn-primary">View Details</button>
                </div>
                
                <div class="content-card">
                    <h3>CommonLibrary Suite</h3>
                    <p>Reusable utility libraries for multiple programming languages.</p>
                    <button class="btn btn-primary">View Details</button>
                </div>
            </div>
        </div>
    `);
});

app.get('/template1', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Template1</h1>
            <p>Template page with empty content</p>
        </div>
    `);
});

// REST Route: Jobs listing and search
app.get('/jobs', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <div class="tab-container">
                <div class="tab-header">
                    <button class="tab-btn active" data-tab="positions">
                        Positions 
                    </button>
                    
                    <button class="tab-btn" data-tab="companies">Companies</button>
                    <button class="tab-btn" data-tab="contacts">Contacts</button>
                </div>
                <div class="tab-ui">
                    <button class="btn btn-primary" id="add-position-btn" onclick="event.stopPropagation();">+</button>
                </div>
                <div class="tab-content">
                    <div id="positions-tab" class="tab-pane active">
                        <div class="datagrid-container" id="positions-container">
                            <table class="data-grid" id="positions-grid">
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Initial Contact</th>
                                        <th>Last Contact</th>
                                        <th>Contact Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="positions-body">
                                    <!-- Data will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div id="companies-tab" class="tab-pane">
                        <h3>Companies Content</h3>
                        <p>Companies management will go here</p>
                    </div>
                    
                    <div id="contacts-tab" class="tab-pane">
                        <h3>Contacts Content</h3>
                        <p>Contacts management will go here</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Load DataGrid control -->
        <script src="/js/datagrid.js"></script>
        <script>
            // Initialize DataGrid when content loads
            setTimeout(() => {
                initializeJobSearchDataGrid();
            }, 100);
            
            // Demo toggle function for the toggle switch demonstration
            function toggleDemoState(isActive) {
                console.log('Demo toggle changed:', isActive ? 'Active' : 'Inactive');
                
                // Show a visual feedback message
                const messageDiv = document.getElementById('demo-message');
                if (!messageDiv) {
                    // Create message div if it doesn't exist
                    const div = document.createElement('div');
                    div.id = 'demo-message';
                    div.style.cssText = 'margin-top: 10px; padding: 8px 12px; border-radius: 4px; font-size: 0.9em; transition: all 0.3s ease;';
                    
                    // Find the toggle switch parent and add message after it
                    const demoToggle = document.getElementById('demo-toggle');
                    if (demoToggle) {
                        const parent = demoToggle.closest('div[style*="background: white"]');
                        if (parent) {
                            parent.appendChild(div);
                        }
                    }
                }
                
                const msg = document.getElementById('demo-message');
                if (msg) {
                    if (isActive) {
                        msg.textContent = '✅ Toggle is ACTIVE - Green state enabled';
                        msg.style.backgroundColor = '#d4edda';
                        msg.style.borderColor = '#c3e6cb';
                        msg.style.color = '#155724';
                    } else {
                        msg.textContent = '❌ Toggle is INACTIVE - Red state enabled';
                        msg.style.backgroundColor = '#f8d7da';
                        msg.style.borderColor = '#f5c6cb';
                        msg.style.color = '#721c24';
                    }
                    msg.style.border = '1px solid';
                }
            }
        </script>
            
    `);
});

// Backward compatibility redirect for old jobsearch route
app.get('/jobsearch', (req, res) => {
    res.redirect(301, '/jobs');
});

// REST Route: Individual job position page
app.get('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    res.send(`
        <div class="welcome-section">
            <h1>Job Position #${jobId}</h1>
            <p>📋 Individual job position details page</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>🎯 Position Details</h3>
                    <div id="position-details">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                            <p>Loading position #${jobId}...</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-card">
                    <h3>🏢 Company Information</h3>
                    <div id="company-details">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                            <p>Loading company information...</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-card" style="grid-column: 1 / -1;">
                    <h3>⚡ Actions</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="editPosition(${jobId})">✏️ Edit Position</button>
                        <button class="btn btn-secondary" onclick="viewCompany()">🏢 View Company</button>
                        <button class="btn btn-info" onclick="goBack()">← Back to Jobs</button>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function editPosition(id) {
            htmx.ajax('GET', '/jobs/' + id + '/edit', {target: '#main-content'});
        }
        
        function viewCompany() {
            alert('Navigate to company page');
        }
        
        function goBack() {
            htmx.ajax('GET', '/jobs', {target: '#main-content'});
        }
        </script>
    `);
});

// REST Route: Companies listing page
app.get('/companies', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>🏢 Companies</h1>
            <p>Manage and browse company information</p>
            
            <div class="content-grid">
                <div class="content-card" style="grid-column: 1 / -1;">
                    <h3>Company Directory</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                        <p>🏢 Companies feature coming soon! This page will display a list of all companies.</p>
                        <button class="btn btn-info" onclick="goBack()">← Back to Jobs</button>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function goBack() {
            htmx.ajax('GET', '/jobs', {target: '#main-content'});
        }
        </script>
    `);
});

// REST Route: Individual company page
app.get('/companies/:id', (req, res) => {
    const companyId = req.params.id;
    res.send(`
        <div class="welcome-section">
            <h1>Company Profile #${companyId}</h1>
            <p>🏢 Company information and related positions</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>🏢 Company Details</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                        <p>Loading company #${companyId}...</p>
                    </div>
                </div>
                
                <div class="content-card">
                    <h3>📋 Open Positions</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                        <p>Loading positions...</p>
                    </div>
                </div>
                
                <div class="content-card" style="grid-column: 1 / -1;">
                    <h3>⚡ Actions</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="editCompany(${companyId})">✏️ Edit Company</button>
                        <button class="btn btn-success" onclick="addPosition(${companyId})">➕ Add Position</button>
                        <button class="btn btn-info" onclick="goBack()">← Back to Companies</button>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function editCompany(id) {
            htmx.ajax('GET', '/companies/' + id + '/edit', {target: '#main-content'});
        }
        
        function addPosition(companyId) {
            htmx.ajax('GET', '/jobs/new?companyId=' + companyId, {target: '#main-content'});
        }
        
        function goBack() {
            htmx.ajax('GET', '/companies', {target: '#main-content'});
        }
        </script>
    `);
});

// Test page for DataGrid debugging
app.get('/test-datagrid', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>DataGrid Test</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .data-grid { width: 100%; border-collapse: collapse; }
                .data-grid th, .data-grid td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .data-grid th { background-color: #f2f2f2; }
                .btn { padding: 2px; margin: 2px; border: none; border-radius: 3px; cursor: pointer; 
                       width: 24px; height: 24px; display: inline-flex; align-items: center; 
                       justify-content: center; font-size: 14px; }
                .btn-primary { background: #007bff; color: white; }
                .btn--sm { padding: 2px; font-size: 14px; width: 24px; height: 24px; }
                .btn--success { background: #28a745; color: white; }
                .btn--secondary { background: #6c757d; color: white; }
                .btn--danger { background: #dc3545; color: white; }
                #status { background: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; }
            </style>
        </head>
        <body>
            <h1>DataGrid Test Page</h1>
            <div id="status">Initializing...</div>
            
            <button class="btn btn-primary" id="add-position-btn">+</button>
            
            <div class="datagrid-container" id="positions-container">
                <table class="data-grid" id="positions-grid">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Initial Contact</th>
                            <th>Last Contact</th>
                            <th>Contact Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="positions-body">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
            
            <script src="/js/datagrid.js"></script>
            <script>
                document.getElementById('status').innerHTML = 'Loading DataGrid script...';
                
                setTimeout(() => {
                    document.getElementById('status').innerHTML = 'Creating DataGrid instance...';
                    
                    try {
                        window.positionsGrid = new DataGridControl('positions-container', {
                            apiEndpoint: 'http://localhost:8000/api/positions',
                            editable: true,
                            sortable: true
                        });
                        
                        document.getElementById('status').innerHTML = '✅ DataGrid created successfully! Loading data...';
                        
                        // Check if data loaded after 2 seconds
                        setTimeout(() => {
                            const tbody = document.querySelector('#positions-body');
                            const rows = tbody.querySelectorAll('tr');
                            document.getElementById('status').innerHTML = '📊 Found ' + rows.length + ' rows in table';
                        }, 2000);
                        
                    } catch (error) {
                        document.getElementById('status').innerHTML = '❌ Error: ' + error.message;
                        console.error('DataGrid error:', error);
                    }
                }, 500);
            </script>
        </body>
        </html>
    `);
});

app.get('/about', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>About Scott Rider</h1>
            <p>Full-stack developer passionate about clean code and innovative solutions</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Technical Skills</h3>
                    <p>• C# & .NET Development<br>
                       • Node.js & Express<br>
                       • HTMX & Modern Web<br>
                       • PowerShell Automation<br>
                       • Python & Data Analysis</p>
                </div>
                
                <div class="content-card">
                    <h3>Development Philosophy</h3>
                    <p>Focused on creating maintainable, scalable solutions with emphasis on user experience and code quality.</p>
                </div>
                
                <div class="content-card">
                    <h3>Current Focus</h3>
                    <p>Building modern web applications with server-side rendering and enhancing development workflows.</p>
                </div>
            </div>
        </div>
    `);
});

app.get('/contact', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Get In Touch</h1>
            <p>Let's connect and discuss potential collaborations</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Email</h3>
                    <p>scott@scottrider.com</p>
                    <button class="btn btn-primary">Send Email</button>
                </div>
                
                <div class="content-card">
                    <h3>GitHub</h3>
                    <p>github.com/scottrider</p>
                    <button class="btn btn-primary">View Profile</button>
                </div>
                
                <div class="content-card">
                    <h3>LinkedIn</h3>
                    <p>Professional networking and career updates</p>
                    <button class="btn btn-primary">Connect</button>
                </div>
            </div>
        </div>
    `);
});

app.get('/blog', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Technical Blog</h1>
            <p>Insights, tutorials, and development experiences</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>HTMX for Modern Web Development</h3>
                    <p>Exploring server-side rendering with dynamic updates...</p>
                    <small style="color: #7f8c8d;">Published: October 2025</small>
                </div>
                
                <div class="content-card">
                    <h3>PowerShell Automation Techniques</h3>
                    <p>Building sophisticated project management tools...</p>
                    <small style="color: #7f8c8d;">Published: October 2025</small>
                </div>
                
                <div class="content-card">
                    <h3>AI Integration in Development Workflows</h3>
                    <p>Safely incorporating AI assistance in coding projects...</p>
                    <small style="color: #7f8c8d;">Published: October 2025</small>
                </div>
            </div>
        </div>
    `);
});

app.get('/tools', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Development Tools</h1>
            <p>Interactive utilities and development resources</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>IFS Project Manager</h3>
                    <p>PowerShell-based project scaffolding and management system.</p>
                    <button class="btn btn-primary" hx-get="/message" hx-target="#tool-demo">Demo</button>
                    <div id="tool-demo"></div>
                </div>
                
                <div class="content-card">
                    <h3>Code Generators</h3>
                    <p>Automated boilerplate generation for various frameworks.</p>
                    <button class="btn btn-primary">Explore</button>
                </div>
                
                <div class="content-card">
                    <h3>Development Utilities</h3>
                    <p>Collection of helpful scripts and automation tools.</p>
                    <button class="btn btn-primary">Browse</button>
                </div>
            </div>
        </div>
    `);
});

// REST Route: Visual testing tool
app.get('/tools/visual-testing', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>📸 Visual Regression Testing</h1>
            <p>Master Agent Edict compliance tools for UI quality assurance</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>🔍 Quick Screenshot Capture</h3>
                    <p>Capture current state for immediate visual documentation</p>
                    <button class="btn btn-primary" onclick="runVisualCapture('current')">
                        📸 Capture Current State
                    </button>
                    <div id="capture-status"></div>
                </div>
                
                <div class="content-card">
                    <h3>📊 Generate Visual Report</h3>
                    <p>Create comprehensive visual regression report with screenshot analysis</p>
                    <button class="btn btn-secondary" onclick="runVisualCapture('report')">
                        📊 Generate Report
                    </button>
                    <div id="report-status"></div>
                </div>
                
                <div class="content-card">
                    <h3>🎯 Full Workflow</h3>
                    <p>Complete visual regression testing with capture + analysis</p>
                    <button class="btn btn-success" onclick="runVisualCapture('full')">
                        🚀 Run Full Workflow
                    </button>
                    <div id="workflow-status"></div>
                </div>
                
                <div class="content-card">
                    <h3>🌐 Open External Browser</h3>
                    <p>Test in real browser instead of VSCode Simple Browser</p>
                    <button class="btn btn-warning" onclick="openExternalBrowser()">
                        🌐 Open in Chrome
                    </button>
                    <small style="display: block; margin-top: 8px; color: #666;">
                        <strong>Important:</strong> Screenshots from VSCode Simple Browser won't capture accurate visuals. 
                        Use external browser for proper visual regression testing.
                    </small>
                </div>
            </div>
            
            <div class="content-grid" style="margin-top: 30px;">
                <div class="content-card" style="grid-column: 1 / -1;">
                    <h3>⚖️ Master Agent Edict Compliance</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <p><strong>📋 Current Requirements:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>✅ Visual documentation mandatory for all UI changes</li>
                            <li>✅ Before/after screenshot comparison required</li>
                            <li>✅ Multi-viewport testing (desktop, mobile, tablet)</li>
                            <li>✅ External browser testing for accurate capture</li>
                            <li>✅ Quality gate enforcement before deployment</li>
                        </ul>
                        <p><strong>📁 Screenshot Location:</strong> <code>/screenshots/</code></p>
                        <p><strong>🎯 Current Status:</strong> <span style="color: #28a745; font-weight: bold;">ACTIVE & COMPLIANT</span></p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function runVisualCapture(type) {
            const statusEl = document.getElementById(type === 'current' ? 'capture-status' : 
                                                  type === 'report' ? 'report-status' : 'workflow-status');
            statusEl.innerHTML = '<div style="color: #007bff; margin-top: 10px;">🔄 Running visual ' + type + '...</div>';
            
            fetch('/api/visual-testing/' + type, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        statusEl.innerHTML = '<div style="color: #28a745; margin-top: 10px;">✅ ' + data.message + '</div>';
                        if (data.screenshots) {
                            statusEl.innerHTML += '<div style="margin-top: 8px; font-size: 0.9em;">📸 Screenshots: ' + data.screenshots + '</div>';
                        }
                        if (data.reportPath) {
                            statusEl.innerHTML += '<div style="margin-top: 8px;"><a href="' + data.reportPath + '" target="_blank" style="color: #007bff;">📊 View Report</a></div>';
                        }
                    } else {
                        statusEl.innerHTML = '<div style="color: #dc3545; margin-top: 10px;">❌ Error: ' + data.error + '</div>';
                    }
                })
                .catch(error => {
                    statusEl.innerHTML = '<div style="color: #dc3545; margin-top: 10px;">❌ Error: ' + error.message + '</div>';
                });
        }
        
        function openExternalBrowser() {
            window.open('http://localhost:3000', '_blank');
        }
        </script>
    `);
});

// Backward compatibility redirect for old visual-testing route
app.get('/visual-testing', (req, res) => {
    res.redirect(301, '/tools/visual-testing');
});

// REST Route: Prototyping tool
app.get('/tools/prototyping', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>🎨 HTML Prototyping with Silex</h1>
            <p>Visual drag-and-drop website builder for rapid prototyping</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>🚀 Launch Silex Editor</h3>
                    <p>Open the Silex visual editor in a new tab for full-screen design experience</p>
                    <button class="btn btn-primary" onclick="openSilexEditor()">
                        🎨 Open Silex Editor
                    </button>
                    <small style="display: block; margin-top: 8px; color: #666;">
                        Opens in new tab for optimal design experience
                    </small>
                </div>
                
                <div class="content-card">
                    <h3>📱 Responsive Design</h3>
                    <p>Design for desktop, tablet, and mobile with live preview</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px;">
                        <strong>✅ Features:</strong><br>
                        • Visual breakpoint editing<br>
                        • Live responsive preview<br>
                        • Mobile-first design workflow
                    </div>
                </div>
                
                <div class="content-card">
                    <h3>🧩 Component Library</h3>
                    <p>Access to ready-made components and templates</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px;">
                        <strong>📦 Includes:</strong><br>
                        • Navigation bars<br>
                        • Content sections<br>
                        • Forms and buttons<br>
                        • Media galleries
                    </div>
                </div>
                
                <div class="content-card">
                    <h3>💾 Export Options</h3>
                    <p>Download your designs as clean HTML/CSS/JS</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px;">
                        <strong>📁 Export formats:</strong><br>
                        • Static HTML files<br>
                        • CSS stylesheets<br>
                        • JavaScript functionality<br>
                        • Asset files
                    </div>
                </div>
            </div>
            
            <div class="content-grid" style="margin-top: 30px;">
                <div class="content-card" style="grid-column: 1 / -1;">
                    <h3>📖 Quick Start Guide</h3>
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 15px 0;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                            <div>
                                <h4 style="color: #1976d2; margin-bottom: 10px;">1️⃣ Start Creating</h4>
                                <p style="margin: 0; font-size: 0.9em;">Click "Open Silex Editor" to launch the visual builder. No installation required!</p>
                            </div>
                            <div>
                                <h4 style="color: #1976d2; margin-bottom: 10px;">2️⃣ Drag & Drop</h4>
                                <p style="margin: 0; font-size: 0.9em;">Use the component panel to drag elements onto your canvas. Customize with the property panel.</p>
                            </div>
                            <div>
                                <h4 style="color: #1976d2; margin-bottom: 10px;">3️⃣ Style & Layout</h4>
                                <p style="margin: 0; font-size: 0.9em;">Apply CSS styles visually. Use the responsive tools to design for all devices.</p>
                            </div>
                            <div>
                                <h4 style="color: #1976d2; margin-bottom: 10px;">4️⃣ Export Code</h4>
                                <p style="margin: 0; font-size: 0.9em;">Download your finished prototype as HTML/CSS files ready for development.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="content-grid" style="margin-top: 30px;">
                <div class="content-card" style="grid-column: 1 / -1; background: #fff3cd; border: 2px solid #ffc107;">
                    <h3 style="color: #856404;">⚡ Integration with LibraryCommon</h3>
                    <div style="margin-top: 15px;">
                        <p style="color: #856404; margin-bottom: 15px;">Your prototypes can integrate seamlessly with this project:</p>
                        <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
                            <li>📋 Use your HTML Tag Showcase as a reference guide</li>
                            <li>🎨 Apply your existing CSS framework and styles</li>
                            <li>🔄 Import prototype HTML into your LibraryCommon views</li>
                            <li>⚙️ Test prototypes with your current API endpoints</li>
                            <li>📱 Leverage your responsive design patterns</li>
                        </ul>
                        <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
                            <strong style="color: #856404;">💡 Pro Tip:</strong> 
                            <span style="color: #856404;">Export your Silex prototypes and use the generated HTML as templates for new pages in this LibraryCommon project!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function openSilexEditor() {
            // Open Silex editor in a new tab
            window.open('https://editor.silex.me/', '_blank', 'width=1200,height=800');
        }
        </script>
    `);
});

// Backward compatibility redirect for old prototyping route
app.get('/prototyping', (req, res) => {
    res.redirect(301, '/tools/prototyping');
});

app.get('/settings', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>🔧 Technology Stack & Settings</h1>
            <p>Complete snapshot of LibraryCommon project architecture and active components</p>
            
            <!-- System Status Overview -->
            <div class="content-grid" style="margin-bottom: 30px;">
                <div class="content-card" style="grid-column: 1 / -1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <h2 style="color: white; margin-bottom: 20px;">🚀 System Status Dashboard</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🟢</div>
                            <div style="font-weight: bold;">Node.js Server</div>
                            <div style="font-size: 0.9em; opacity: 0.9;">Port 3000 • Express</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🟢</div>
                            <div style="font-weight: bold;">Python API</div>
                            <div style="font-size: 0.9em; opacity: 0.9;">Port 8000 • FastAPI</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🟢</div>
                            <div style="font-weight: bold;">DataGrid</div>
                            <div style="font-size: 0.9em; opacity: 0.9;">CRUD • Toggle • Responsive</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🟢</div>
                            <div style="font-weight: bold;">Cache Control</div>
                            <div style="font-size: 0.9em; opacity: 0.9;">No-Store • Dev-Optimized</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Backend Technology Stack -->
            <div class="content-grid">
                <div class="content-card">
                    <h3>🐍 Python Backend Stack</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span><strong>FastAPI Framework</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Uvicorn ASGI Server</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Running</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Pydantic Data Validation</span>
                            <span style="color: #28a745; font-weight: bold;">✅ V2.x</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>CORS Middleware</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Enabled</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>Auto Documentation</span>
                            <span style="color: #28a745; font-weight: bold;">✅ /docs</span>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 0.9em;">
                        <strong>Endpoints:</strong><br>
                        • <code>/api/positions</code> - CRUD Operations<br>
                        • <code>/api/companies</code> - Company Data<br>
                        • <code>/api/health</code> - Health Check
                    </div>
                </div>

                <div class="content-card">
                    <h3>🟢 Node.js Frontend Stack</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span><strong>Express.js Framework</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>EJS Template Engine</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Configured</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Static File Serving</span>
                            <span style="color: #28a745; font-weight: bold;">✅ /public</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Security Headers</span>
                            <span style="color: #28a745; font-weight: bold;">✅ CSP + XSS</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>Cache Control</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Dev Mode</span>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 0.9em;">
                        <strong>Features:</strong><br>
                        • Server-Side Rendering<br>
                        • HTMX Integration<br>
                        • Real-time Cache Invalidation
                    </div>
                </div>

                <div class="content-card">
                    <h3>🎨 Frontend Technology</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span><strong>Vanilla JavaScript</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ ES6+</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>CSS3 + Flexbox/Grid</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Modern</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>BEM Methodology</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Consistent</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Responsive Design</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Mobile-First</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>Component Architecture</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Modular</span>
                        </div>
                    </div>
                </div>

                <div class="content-card">
                    <h3>📊 DataGrid Component</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span><strong>CRUD Operations</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ Full</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Real-time API Integration</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Active/Inactive Toggle</span>
                            <span style="color: #28a745; font-weight: bold;">✅ W3C Style</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Company Dropdown</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Dynamic</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>24x24 Button Standard</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Consistent</span>
                        </div>
                    </div>
                </div>

                <div class="content-card">
                    <h3>🛡️ Security & Performance</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span><strong>Content Security Policy</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ Enabled</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>XSS Protection</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Headers</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Frame Protection</span>
                            <span style="color: #28a745; font-weight: bold;">✅ DENY</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Cache Control</span>
                            <span style="color: #28a745; font-weight: bold;">✅ No-Store</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>Environment Variables</span>
                            <span style="color: #28a745; font-weight: bold;">✅ dotenv</span>
                        </div>
                    </div>
                </div>

                <div class="content-card">
                    <h3>🔧 Development Tools</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span><strong>Auto-Reload (Python)</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ Uvicorn</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Cache Invalidation</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Headers</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>API Documentation</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Swagger</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Debug Endpoints</span>
                            <span style="color: #28a745; font-weight: bold;">✅ /dev/*</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>Visual Testing</span>
                            <span style="color: #28a745; font-weight: bold;">✅ Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Schema Documentation -->
            <div class="content-grid" style="margin-top: 30px;">
                <div class="content-card" style="grid-column: 1 / -1;">
                    <h3>📋 Data Schema & Relationships</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <div>
                            <h4 style="color: #2c3e50; margin-bottom: 10px;">🏢 Companies Entity</h4>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 0.9em;">
                                <div><strong>id:</strong> integer (PK)</div>
                                <div><strong>name:</strong> string (required)</div>
                                <div><strong>address1-3:</strong> string</div>
                                <div><strong>city:</strong> string</div>
                                <div><strong>state:</strong> string</div>
                                <div><strong>zip:</strong> string</div>
                                <div><strong>phone:</strong> string (format: phone)</div>
                                <div><strong>email:</strong> string (format: email)</div>
                                <div><strong>website:</strong> string (format: uri)</div>
                            </div>
                        </div>
                        <div>
                            <h4 style="color: #2c3e50; margin-bottom: 10px;">💼 Positions Entity</h4>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 0.9em;">
                                <div><strong>id:</strong> integer (PK)</div>
                                <div><strong>companyId:</strong> integer (FK → companies.id)</div>
                                <div><strong>position:</strong> string (required)</div>
                                <div><strong>initialContactDate:</strong> date (readonly)</div>
                                <div><strong>lastContactDate:</strong> date (editable)</div>
                                <div><strong>contactTypeId:</strong> integer (FK)</div>
                                <div><strong>statusId:</strong> integer (FK)</div>
                                <div><strong>isInactive:</strong> boolean (filter toggle)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Configuration Panel -->
            <div class="content-grid" style="margin-top: 30px;">
                <div class="content-card" style="grid-column: 1 / -1; background: #2c3e50; color: white;">
                    <h3 style="color: white; margin-bottom: 20px;">⚙️ System Configuration</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        <div>
                            <h4 style="color: #ecf0f1; margin-bottom: 15px;">🌐 Server Configuration</h4>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                                <div style="margin-bottom: 10px;"><strong>Node.js Port:</strong> 3000</div>
                                <div style="margin-bottom: 10px;"><strong>Python Port:</strong> 8000</div>
                                <div style="margin-bottom: 10px;"><strong>Environment:</strong> Development</div>
                                <div style="margin-bottom: 10px;"><strong>Cache Mode:</strong> No-Store</div>
                                <div><strong>Auto-Reload:</strong> Enabled</div>
                            </div>
                        </div>
                        <div>
                            <h4 style="color: #ecf0f1; margin-bottom: 15px;">🎯 Feature Toggles</h4>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <input type="checkbox" checked disabled style="margin-right: 10px;">
                                    DataGrid CRUD Operations
                                </label>
                                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <input type="checkbox" checked disabled style="margin-right: 10px;">
                                    Active/Inactive Toggle
                                </label>
                                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <input type="checkbox" checked disabled style="margin-right: 10px;">
                                    Company Dropdown Integration
                                </label>
                                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <input type="checkbox" checked disabled style="margin-right: 10px;">
                                    Visual Testing Suite
                                </label>
                                <label style="display: flex; align-items: center;">
                                    <input type="checkbox" checked disabled style="margin-right: 10px;">
                                    API Documentation
                                </label>
                            </div>
                        </div>
                        <div>
                            <h4 style="color: #ecf0f1; margin-bottom: 15px;">🔗 Quick Actions</h4>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                                <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;" onclick="window.open('http://localhost:8000/docs', '_blank')">
                                    📚 Open API Docs
                                </button>
                                <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;" onclick="window.open('http://localhost:3000/test-datagrid', '_blank')">
                                    🧪 Test DataGrid
                                </button>
                                <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;" onclick="window.open('http://localhost:3000/visual-testing', '_blank')">
                                    📸 Visual Testing
                                </button>
                                <button class="btn btn-primary" style="width: 100%;" onclick="fetch('/dev/reload').then(() => alert('Cache cleared! Refresh browser.'))">
                                    🔄 Clear Cache
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- HTML Tag Showcase -->
            <div class="content-grid" style="margin-top: 30px;">
                <div class="content-card" style="grid-column: 1 / -1; background: #f8f9fa; border: 2px solid #007bff;">
                    <h3 style="color: #007bff; margin-bottom: 20px;">🏷️ HTML Tag Showcase & Reference</h3>
                    <p style="margin-bottom: 25px; color: #6c757d;">Complete collection of HTML elements with live examples for development reference</p>
                    
                    <!-- Text Content Tags -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">📝 Text Content Elements</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3498db;">
                                <strong>Headings:</strong><br>
                                <h1 style="margin: 5px 0; font-size: 1.5em;">H1 Heading</h1>
                                <h2 style="margin: 5px 0; font-size: 1.3em;">H2 Heading</h2>
                                <h3 style="margin: 5px 0; font-size: 1.1em;">H3 Heading</h3>
                                <h4 style="margin: 5px 0; font-size: 1em;">H4 Heading</h4>
                                <h5 style="margin: 5px 0; font-size: 0.9em;">H5 Heading</h5>
                                <h6 style="margin: 5px 0; font-size: 0.8em;">H6 Heading</h6>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #e74c3c;">
                                <strong>Text Formatting:</strong><br>
                                <p><strong>Bold text</strong> with &lt;strong&gt;</p>
                                <p><b>Bold text</b> with &lt;b&gt;</p>
                                <p><em>Italic text</em> with &lt;em&gt;</p>
                                <p><i>Italic text</i> with &lt;i&gt;</p>
                                <p><u>Underlined text</u> with &lt;u&gt;</p>
                                <p><s>Strikethrough text</s> with &lt;s&gt;</p>
                                <p><mark>Highlighted text</mark> with &lt;mark&gt;</p>
                                <p><small>Small text</small> with &lt;small&gt;</p>
                                <p><sup>Superscript</sup> and <sub>Subscript</sub></p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Elements -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #2c3e50; border-bottom: 2px solid #e67e22; padding-bottom: 5px;">📋 Form Elements</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #e67e22;">
                                <strong>Input Types:</strong><br>
                                <div style="margin: 10px 0;">
                                    <label>Text: <input type="text" placeholder="Text input" style="margin-left: 5px; padding: 4px;"></label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Password: <input type="password" placeholder="Password" style="margin-left: 5px; padding: 4px;"></label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Email: <input type="email" placeholder="email@example.com" style="margin-left: 5px; padding: 4px;"></label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Number: <input type="number" min="0" max="100" style="margin-left: 5px; padding: 4px;"></label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Date: <input type="date" style="margin-left: 5px; padding: 4px;"></label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Range: <input type="range" min="0" max="100" style="margin-left: 5px;"></label>
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f39c12;">
                                <strong>Selection Elements:</strong><br>
                                <div style="margin: 10px 0;">
                                    <label><input type="checkbox" style="margin-right: 5px;"> Checkbox option</label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label><input type="radio" name="radio-demo" style="margin-right: 5px;"> Radio option 1</label><br>
                                    <label><input type="radio" name="radio-demo" style="margin-right: 5px;"> Radio option 2</label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Select: 
                                        <select style="margin-left: 5px; padding: 4px;">
                                            <option>Option 1</option>
                                            <option>Option 2</option>
                                            <option>Option 3</option>
                                        </select>
                                    </label>
                                </div>
                                <div style="margin: 10px 0;">
                                    <label>Textarea:<br>
                                        <textarea rows="3" cols="30" placeholder="Multi-line text input" style="margin-top: 5px; padding: 4px;"></textarea>
                                    </label>
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #27ae60;">
                                <strong>Buttons & Actions:</strong><br>
                                <div style="margin: 10px 0;">
                                    <button type="button" style="margin: 2px; padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 4px;">Primary Button</button>
                                </div>
                                <div style="margin: 10px 0;">
                                    <button type="button" style="margin: 2px; padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 4px;">Success Button</button>
                                </div>
                                <div style="margin: 10px 0;">
                                    <button type="button" style="margin: 2px; padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 4px;">Danger Button</button>
                                </div>
                                <div style="margin: 10px 0;">
                                    <button type="button" disabled style="margin: 2px; padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 4px;">Disabled Button</button>
                                </div>
                                <div style="margin: 10px 0;">
                                    <input type="submit" value="Submit Input" style="margin: 2px; padding: 8px 12px; background: #17a2b8; color: white; border: none; border-radius: 4px;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Structural Elements -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #2c3e50; border-bottom: 2px solid #9b59b6; padding-bottom: 5px;">🏗️ Structural Elements</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #9b59b6;">
                                <strong>Lists:</strong><br>
                                <div style="margin: 10px 0;">
                                    <strong>Unordered List:</strong>
                                    <ul style="margin: 5px 0; padding-left: 20px;">
                                        <li>First item</li>
                                        <li>Second item</li>
                                        <li>Third item</li>
                                    </ul>
                                </div>
                                <div style="margin: 10px 0;">
                                    <strong>Ordered List:</strong>
                                    <ol style="margin: 5px 0; padding-left: 20px;">
                                        <li>First step</li>
                                        <li>Second step</li>
                                        <li>Third step</li>
                                    </ol>
                                </div>
                                <div style="margin: 10px 0;">
                                    <strong>Definition List:</strong>
                                    <dl style="margin: 5px 0;">
                                        <dt style="font-weight: bold;">HTML</dt>
                                        <dd style="margin-left: 20px;">HyperText Markup Language</dd>
                                        <dt style="font-weight: bold;">CSS</dt>
                                        <dd style="margin-left: 20px;">Cascading Style Sheets</dd>
                                    </dl>
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #1abc9c;">
                                <strong>Tables:</strong><br>
                                <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 0.9em;">
                                    <thead>
                                        <tr style="background: #f8f9fa;">
                                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Name</th>
                                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Age</th>
                                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="border: 1px solid #dee2e6; padding: 8px;">John Doe</td>
                                            <td style="border: 1px solid #dee2e6; padding: 8px;">30</td>
                                            <td style="border: 1px solid #dee2e6; padding: 8px;">Developer</td>
                                        </tr>
                                        <tr style="background: #f8f9fa;">
                                            <td style="border: 1px solid #dee2e6; padding: 8px;">Jane Smith</td>
                                            <td style="border: 1px solid #dee2e6; padding: 8px;">25</td>
                                            <td style="border: 1px solid #dee2e6; padding: 8px;">Designer</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #e91e63;">
                                <strong>Semantic Elements:</strong><br>
                                <div style="margin: 10px 0;">
                                    <article style="border: 1px dashed #ccc; padding: 10px; margin: 5px 0;">
                                        <header style="background: #f8f9fa; padding: 5px; margin-bottom: 10px;">
                                            <h5 style="margin: 0;">Article Header</h5>
                                        </header>
                                        <p style="margin: 5px 0;">Article content goes here...</p>
                                        <footer style="background: #f8f9fa; padding: 5px; margin-top: 10px; font-size: 0.8em;">
                                            Article Footer
                                        </footer>
                                    </article>
                                </div>
                                <div style="margin: 10px 0;">
                                    <section style="border: 1px dashed #ccc; padding: 10px; margin: 5px 0;">
                                        <h6 style="margin: 0 0 5px 0;">Section Element</h6>
                                        <p style="margin: 0; font-size: 0.9em;">Section content...</p>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Media & Interactive Elements -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 5px;">🎬 Media & Interactive Elements</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #e74c3c;">
                                <strong>Links & Navigation:</strong><br>
                                <div style="margin: 10px 0;">
                                    <a href="#" style="color: #007bff; text-decoration: underline;">Regular link</a>
                                </div>
                                <div style="margin: 10px 0;">
                                    <a href="#" style="color: #28a745; text-decoration: none;">Link without underline</a>
                                </div>
                                <div style="margin: 10px 0;">
                                    <a href="mailto:test@example.com" style="color: #dc3545;">Email link</a>
                                </div>
                                <div style="margin: 10px 0;">
                                    <a href="tel:+1234567890" style="color: #17a2b8;">Phone link</a>
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #fd7e14;">
                                <strong>Code & Preformatted:</strong><br>
                                <div style="margin: 10px 0;">
                                    <p>Inline <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-family: monospace;">code example</code> here</p>
                                </div>
                                <div style="margin: 10px 0;">
                                    <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 0.8em;"><code>function example() {
    return "Hello World!";
}</code></pre>
                                </div>
                                <div style="margin: 10px 0;">
                                    <kbd style="background: #212529; color: white; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.8em;">Ctrl + C</kbd>
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #20c997;">
                                <strong>Special Elements:</strong><br>
                                <div style="margin: 10px 0;">
                                    <blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 10px 0; font-style: italic; color: #6c757d;">
                                        "This is a blockquote example with some quoted text content."
                                    </blockquote>
                                </div>
                                <div style="margin: 10px 0;">
                                    <details style="border: 1px solid #dee2e6; border-radius: 4px; padding: 10px;">
                                        <summary style="cursor: pointer; font-weight: bold;">Click to expand details</summary>
                                        <p style="margin-top: 10px; margin-bottom: 0;">Hidden content that appears when expanded!</p>
                                    </details>
                                </div>
                                <div style="margin: 10px 0;">
                                    <progress value="70" max="100" style="width: 100%;">70%</progress>
                                    <div style="font-size: 0.8em; color: #6c757d;">Progress bar (70%)</div>
                                </div>
                                <div style="margin: 10px 0;">
                                    <meter value="0.6" style="width: 100%;">60%</meter>
                                    <div style="font-size: 0.8em; color: #6c757d;">Meter element (60%)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- HTML5 Semantic Structure -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #2c3e50; border-bottom: 2px solid #6f42c1; padding-bottom: 5px;">🌟 HTML5 Semantic Structure</h4>
                        <div style="background: white; padding: 20px; border-radius: 6px; border: 2px dashed #6f42c1; margin-top: 15px;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                <div style="text-align: center;">
                                    <div style="background: #6f42c1; color: white; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;header&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Page/section header</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="background: #17a2b8; color: white; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;nav&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Navigation links</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="background: #28a745; color: white; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;main&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Main content area</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="background: #ffc107; color: #212529; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;aside&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Sidebar content</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="background: #fd7e14; color: white; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;section&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Content section</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="background: #e83e8c; color: white; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;article&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Independent content</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="background: #6c757d; color: white; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                        <strong>&lt;footer&gt;</strong>
                                    </div>
                                    <div style="font-size: 0.8em; color: #6c757d;">Page/section footer</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Custom Elements & Advanced Features -->
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #2c3e50; border-bottom: 2px solid #dc3545; padding-bottom: 5px;">⚡ Advanced Elements & Custom Components</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545;">
                                <strong>Toggle Switch (Your Implementation):</strong><br>
                                <div style="margin: 15px 0;">
                                    <label class="toggle-label">
                                        <span class="toggle-text">Inactive</span>
                                        <div class="toggle-switch">
                                            <input type="checkbox" id="demo-toggle" class="toggle-input" onchange="toggleDemoState(this.checked)">
                                            <span class="toggle-slider"></span>
                                        </div>
                                        <span class="toggle-text">Active</span>
                                    </label>
                                </div>
                                <div style="font-size: 0.8em; color: #6c757d;">Custom CSS-styled checkbox as toggle switch</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff;">
                                <strong>Data Attributes & ARIA:</strong><br>
                                <div style="margin: 10px 0;">
                                    <button data-toggle="tooltip" data-placement="top" title="Tooltip example" style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 4px;">
                                        Hover for tooltip
                                    </button>
                                </div>
                                <div style="margin: 10px 0;">
                                    <div role="alert" aria-live="polite" style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 10px; border-radius: 4px;">
                                        ⚠️ ARIA alert example
                                    </div>
                                </div>
                                <div style="margin: 10px 0;">
                                    <span aria-label="Required field" style="color: #dc3545;">*</span>
                                    <input type="text" aria-describedby="help-text" placeholder="Required field" style="padding: 4px;">
                                    <div id="help-text" style="font-size: 0.8em; color: #6c757d;">This field is required</div>
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
                                <strong>Fieldset & Form Structure:</strong><br>
                                <fieldset style="border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin: 10px 0;">
                                    <legend style="font-weight: bold; padding: 0 10px;">Personal Information</legend>
                                    <div style="margin: 10px 0;">
                                        <label for="fname">First name:</label><br>
                                        <input type="text" id="fname" name="fname" style="padding: 4px; width: 100%; max-width: 200px;">
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <label for="lname">Last name:</label><br>
                                        <input type="text" id="lname" name="lname" style="padding: 4px; width: 100%; max-width: 200px;">
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Login</h1>
            <p>Sign in to access your account and personalized content</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Sign In</h3>
                    <form hx-post="/auth/login" hx-target="#login-result" style="display: block;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Email:</label>
                            <input type="email" name="email" placeholder="your@email.com" required 
                                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Password:</label>
                            <input type="password" name="password" placeholder="Your password" required
                                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
                        <div id="login-result" style="margin-top: 15px;"></div>
                    </form>
                </div>
                
                <div class="content-card">
                    <h3>Quick Access</h3>
                    <p>Alternative sign-in methods</p>
                    <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">Sign in with GitHub</button>
                    <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">Sign in with Google</button>
                    <button class="btn btn-primary" style="width: 100%;">Sign in with Microsoft</button>
                </div>
                
                <div class="content-card">
                    <h3>New User?</h3>
                    <p>Create an account to get started</p>
                    <button class="btn btn-primary" style="width: 100%;">Create Account</button>
                    <p style="margin-top: 15px; font-size: 14px; color: #7f8c8d;">
                        <a href="#" style="color: #3498db;">Forgot your password?</a>
                    </p>
                </div>
            </div>
        </div>
    `);
});

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Simulate login process
    setTimeout(() => {
        res.send(`<div class="message-response" style="background: #e8f5e8; border-color: #4caf50; color: #2e7d32;">
            <p>✅ Login successful for ${email}</p>
            <small>Welcome back! Redirecting to dashboard...</small>
        </div>`);
    }, 1000);
});

app.get('/message', (req, res) => {
    const serverTime = new Date().toLocaleTimeString();
    res.send(`<div class="message-response" style="margin-top: 15px; padding: 15px; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px; color: #2e7d32;">
        <p>✅ Tool Demo: Server time is ${serverTime}</p>
        <small>This demonstrates HTMX partial content loading.</small>
    </div>`);
});

// Development helper endpoint to force reload
app.get('/dev/reload', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json({
        status: 'reload',
        timestamp: new Date().toISOString(),
        message: 'Cache cleared, please refresh your browser'
    });
});

// System status endpoint for technology dashboard
app.get('/api/system/status', (req, res) => {
    const status = {
        timestamp: new Date().toISOString(),
        servers: {
            node: {
                status: 'running',
                port: PORT,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.version
            },
            python: {
                status: 'assumed_running',
                port: 8000,
                endpoint: 'http://localhost:8000/api/health'
            }
        },
        features: {
            dataGrid: true,
            toggleSwitch: true,
            companyDropdown: true,
            cacheControl: true,
            securityHeaders: true,
            visualTesting: true
        },
        environment: {
            nodeEnv: process.env.NODE_ENV || 'development',
            cacheMode: 'no-store',
            autoReload: true
        }
    };
    
    res.json(status);
});

app.post('/submit', (req, res) => {
    const { message } = req.body;
    const timestamp = new Date().toLocaleTimeString();
    res.send(`<div class="message-response">
        <p>✅ Received: "${message}"</p>
        <small>Processed at: ${timestamp}</small>
    </div>`);
});

// Visual Testing API Endpoints
app.post('/api/visual-testing/:type', (req, res) => {
    const { type } = req.params;
    const { exec } = require('child_process');
    
    console.log(`🎯 Visual testing requested: ${type}`);
    
    let command;
    switch (type) {
        case 'current':
            command = 'npm run visual:current';
            break;
        case 'baseline':
            command = 'npm run visual:baseline';
            break;
        case 'report':
            command = 'npm run visual:report';
            break;
        case 'full':
            command = 'npm run visual:full';
            break;
        default:
            return res.status(400).json({ success: false, error: 'Invalid test type' });
    }
    
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Visual testing error: ${error}`);
            return res.json({ 
                success: false, 
                error: error.message,
                stderr: stderr 
            });
        }
        
        console.log(`Visual testing output: ${stdout}`);
        
        // Parse output for screenshot count and report info
        const screenshotMatch = stdout.match(/Total screenshots:\s*(\d+)/);
        const reportMatch = stdout.match(/report generated:\s*(.+\.html)/);
        
        const response = {
            success: true,
            message: `Visual ${type} testing completed successfully`,
            output: stdout
        };
        
        if (screenshotMatch) {
            response.screenshots = screenshotMatch[1];
        }
        
        if (reportMatch) {
            response.reportPath = `/screenshots/${path.basename(reportMatch[1])}`;
        }
        
        res.json(response);
    });
});

// Serve screenshot files and reports
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Project: HTMX Node.js Starter`);
});