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
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

app.use(express.static(path.join(__dirname, 'public'), {
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
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

app.get('/jobsearch', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Job Search</h1>
            <p>Manage your job search activities</p>
            
            <div class="tab-container">
                <div class="tab-header">
                    <button class="tab-btn active" data-tab="positions">Positions</button>
                    <button class="tab-btn" data-tab="companies">Companies</button>
                    <button class="tab-btn" data-tab="contacts">Contacts</button>
                </div>
                
                <div class="tab-content">
                    <div id="positions-tab" class="tab-pane active">
                        <div class="tab-actions">
                            <button class="btn btn-primary" id="add-position-btn">+</button>
                        </div>
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
                .btn { padding: 5px 10px; margin: 2px; border: none; border-radius: 3px; cursor: pointer; }
                .btn-primary { background: #007bff; color: white; }
                .btn--sm { padding: 3px 6px; font-size: 12px; }
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

app.get('/visual-testing', (req, res) => {
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

app.get('/settings', (req, res) => {
    res.send(`
        <div class="welcome-section">
            <h1>Settings</h1>
            <p>Configure your preferences and application settings</p>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Theme Settings</h3>
                    <p>Customize the appearance and color scheme</p>
                    <div style="margin-top: 15px;">
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="radio" name="theme" value="light" checked style="margin-right: 8px;">
                            Light Theme
                        </label>
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="radio" name="theme" value="dark" style="margin-right: 8px;">
                            Dark Theme
                        </label>
                        <label style="display: block;">
                            <input type="radio" name="theme" value="auto" style="margin-right: 8px;">
                            Auto (System)
                        </label>
                    </div>
                </div>
                
                <div class="content-card">
                    <h3>Notification Preferences</h3>
                    <p>Control how and when you receive notifications</p>
                    <div style="margin-top: 15px;">
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="checkbox" checked style="margin-right: 8px;">
                            Email notifications
                        </label>
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="checkbox" checked style="margin-right: 8px;">
                            Push notifications
                        </label>
                        <label style="display: block;">
                            <input type="checkbox" style="margin-right: 8px;">
                            SMS notifications
                        </label>
                    </div>
                </div>
                
                <div class="content-card">
                    <h3>Account Settings</h3>
                    <p>Manage your account information and security</p>
                    <button class="btn btn-primary" style="margin-right: 10px;">Update Profile</button>
                    <button class="btn btn-primary">Change Password</button>
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