# LibraryCommon Server Management

## Default Method: Start-Process with Working Directory (Method #3)

The LibraryCommon project now uses **Method #3** as the default for starting servers to avoid working directory issues.

## Quick Commands

### 🚀 Restart Both Servers (Recommended)
```powershell
.\reboot-server.ps1
```

### 📋 Full Server Management
```powershell
.\server-manager.ps1 -Action [start|stop|restart|status]
```

### 🎯 Individual Server Control
```powershell
# Node.js only
.\start-server.ps1

# Python only (manual)
Start-Process -FilePath "python" -ArgumentList "api_server.py" -WorkingDirectory "C:\Users\Scott\source\repos\LibraryCommon" -NoNewWindow
```

## Server Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| **Node.js Express** | http://localhost:3000 | Main web application |
| **Python FastAPI** | http://localhost:8000 | API backend |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| **Health Check** | http://localhost:8000/api/health | API status |
| **System Status** | http://localhost:3000/api/system/status | Full system status |

## Why Method #3?

**Problem**: PowerShell terminals often don't maintain the correct working directory context, causing `node server.js` to fail with "Cannot find module" errors.

**Solution**: Use `Start-Process` with explicit `-WorkingDirectory` parameter:

```powershell
# ✅ Method #3 (DEFAULT) - Always works
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "C:\Users\Scott\source\repos\LibraryCommon" -NoNewWindow

# ❌ Method #1 - Unreliable working directory
cd C:\Users\Scott\source\repos\LibraryCommon
node server.js

# ⚠️ Method #2 - Better but can still fail
Push-Location "C:\Users\Scott\source\repos\LibraryCommon" && node server.js
```

## Features

✅ **Automatic Process Cleanup** - Kills existing servers before starting new ones  
✅ **Server Health Checks** - Tests connectivity after startup  
✅ **Colored Output** - Easy to read status messages  
✅ **Error Handling** - Graceful failure with helpful messages  
✅ **Cross-Server Management** - Handles both Node.js and Python servers  
✅ **Working Directory Guarantee** - Method #3 ensures correct context  

## Troubleshooting

### Server Won't Start
1. Check if files exist: `ls server.js` and `ls api_server.py`
2. Verify working directory: `Get-Location`
3. Run with verbose output: `.\server-manager.ps1 -Action status`

### Port Already in Use
The scripts automatically kill existing processes, but if needed:
```powershell
taskkill /f /im node.exe
taskkill /f /im python.exe
```

### Permission Issues
If execution policy blocks scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```