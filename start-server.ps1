# LibraryCommon Server Startup Script
# This script ensures the Node.js server starts with the correct working directory

Write-Host "🚀 Starting LibraryCommon Server..." -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "📋 Stopping existing Node.js processes..." -ForegroundColor Yellow
try {
    taskkill /f /im node.exe 2>$null | Out-Null
    Start-Sleep -Seconds 1
} catch {
    # No existing processes to kill
}

# Set the correct paths
$LibraryCommonPath = "C:\Users\Scott\source\repos\LibraryCommon"
$ServerScript = "server.js"

# Verify the server file exists
if (-not (Test-Path (Join-Path $LibraryCommonPath $ServerScript))) {
    Write-Host "❌ Error: server.js not found in $LibraryCommonPath" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Working Directory: $LibraryCommonPath" -ForegroundColor Cyan
Write-Host "🔧 Starting Node.js server..." -ForegroundColor Cyan

# Start the Node.js server with explicit working directory (Method #3)
try {
    Start-Process -FilePath "node" -ArgumentList $ServerScript -WorkingDirectory $LibraryCommonPath -NoNewWindow
    
    # Wait a moment for the server to start
    Start-Sleep -Seconds 2
    
    # Test if the server is responding
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/system/status" -Method Get -TimeoutSec 5
        Write-Host "✅ Server started successfully!" -ForegroundColor Green
        Write-Host "🌐 Server available at: http://localhost:3000" -ForegroundColor Green
        Write-Host "📊 System Status: OK" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Server started but may still be initializing..." -ForegroundColor Yellow
        Write-Host "🌐 Server should be available at: http://localhost:3000" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "✨ Server startup complete!" -ForegroundColor Green