# LibraryCommon Full Server Management Script
# Handles both Node.js Express server and Python FastAPI server

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action = "restart"
)

$LibraryCommonPath = "C:\Users\Scott\source\repos\LibraryCommon"

function Write-ColorMessage {
    param($Message, $Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Stop-Servers {
    Write-ColorMessage "🛑 Stopping all servers..." "Yellow"
    
    try {
        taskkill /f /im node.exe 2>$null | Out-Null
        Write-ColorMessage "   ✓ Node.js processes stopped" "Gray"
    } catch {
        Write-ColorMessage "   ℹ No Node.js processes to stop" "Gray"
    }
    
    try {
        taskkill /f /im python.exe 2>$null | Out-Null
        Write-ColorMessage "   ✓ Python processes stopped" "Gray"
    } catch {
        Write-ColorMessage "   ℹ No Python processes to stop" "Gray"
    }
    
    Start-Sleep -Seconds 1
}

function Start-NodeServer {
    Write-ColorMessage "🟢 Starting Node.js Express Server..." "Green"
    
    if (-not (Test-Path (Join-Path $LibraryCommonPath "server.js"))) {
        Write-ColorMessage "❌ Error: server.js not found in $LibraryCommonPath" "Red"
        return $false
    }
    
    try {
        # Method #3: Start-Process with explicit working directory (DEFAULT METHOD)
        Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $LibraryCommonPath -NoNewWindow
        Write-ColorMessage "   ✓ Node.js server started (Method #3: Start-Process)" "Green"
        return $true
    } catch {
        Write-ColorMessage "   ❌ Failed to start Node.js server: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Start-PythonServer {
    Write-ColorMessage "🐍 Starting Python FastAPI Server..." "Blue"
    
    if (-not (Test-Path (Join-Path $LibraryCommonPath "api_server.py"))) {
        Write-ColorMessage "❌ Error: api_server.py not found in $LibraryCommonPath" "Red"
        return $false
    }
    
    try {
        # Use same method for consistency
        Start-Process -FilePath "python" -ArgumentList "api_server.py" -WorkingDirectory $LibraryCommonPath -NoNewWindow
        Write-ColorMessage "   ✓ Python server started (Method #3: Start-Process)" "Blue"
        return $true
    } catch {
        Write-ColorMessage "   ❌ Failed to start Python server: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Test-Servers {
    Write-ColorMessage "🔍 Testing server connectivity..." "Cyan"
    
    # Wait for servers to initialize
    Start-Sleep -Seconds 3
    
    # Test Node.js server
    try {
        $nodeResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/system/status" -Method Get -TimeoutSec 5
        Write-ColorMessage "   ✅ Node.js server responding at http://localhost:3000" "Green"
    } catch {
        Write-ColorMessage "   ⚠️  Node.js server not responding (may still be starting)" "Yellow"
    }
    
    # Test Python server
    try {
        $pythonResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Method Get -TimeoutSec 5
        Write-ColorMessage "   ✅ Python server responding at http://localhost:8000" "Green"
    } catch {
        Write-ColorMessage "   ⚠️  Python server not responding (may still be starting)" "Yellow"
    }
}

function Show-Status {
    Write-ColorMessage "📊 Server Status Check" "Cyan"
    
    # Check for running processes
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    $pythonProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue
    
    if ($nodeProcesses) {
        Write-ColorMessage "   🟢 Node.js processes running: $($nodeProcesses.Count)" "Green"
    } else {
        Write-ColorMessage "   🔴 Node.js not running" "Red"
    }
    
    if ($pythonProcesses) {
        Write-ColorMessage "   🟢 Python processes running: $($pythonProcesses.Count)" "Green"
    } else {
        Write-ColorMessage "   🔴 Python not running" "Red"
    }
    
    Test-Servers
}

# Main execution
Write-ColorMessage "🚀 LibraryCommon Server Manager (Default Method: #3 Start-Process)" "Magenta"
Write-ColorMessage "📁 Working Directory: $LibraryCommonPath" "Gray"

switch ($Action) {
    "start" {
        $nodeOk = Start-NodeServer
        $pythonOk = Start-PythonServer
        if ($nodeOk -and $pythonOk) {
            Test-Servers
            Write-ColorMessage "✨ All servers started successfully!" "Green"
        }
    }
    "stop" {
        Stop-Servers
        Write-ColorMessage "✨ All servers stopped!" "Yellow"
    }
    "restart" {
        Stop-Servers
        $nodeOk = Start-NodeServer
        $pythonOk = Start-PythonServer
        if ($nodeOk -and $pythonOk) {
            Test-Servers
            Write-ColorMessage "✨ Server restart complete!" "Green"
        }
    }
    "status" {
        Show-Status
    }
}