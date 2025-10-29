# Visual Regression Testing - External Browser Launcher
# Master Agent Edict Compliance Tool
# Opens external browsers for accurate visual regression testing

param(
    [string]$Browser = "chrome",
    [string]$Url = "http://localhost:3000",
    [switch]$Incognito
)

Write-Host "🎯 Master Agent Edict: Visual Regression Testing" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Server detected at $Url" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not running at $Url" -ForegroundColor Red
    Write-Host "💡 Start server with: npm start" -ForegroundColor Yellow
    exit 1
}

Write-Host "🌐 Opening external browser for accurate visual testing..." -ForegroundColor Yellow
Write-Host "⚠️  VSCode Simple Browser screenshots are not accurate for visual regression" -ForegroundColor Yellow
Write-Host ""

# Browser launch commands
$chromeArgs = @("--new-window", "--disable-web-security", "--force-device-scale-factor=1")
$firefoxArgs = @("-new-window")
$edgeArgs = @("--new-window", "--disable-web-security")

if ($Incognito) {
    $chromeArgs += "--incognito"
    $firefoxArgs += "-private-window"
    $edgeArgs += "--inprivate"
}

switch ($Browser.ToLower()) {
    "chrome" {
        Write-Host "🚀 Launching Google Chrome..." -ForegroundColor Green
        try {
            # Try multiple Chrome locations
            $chromePaths = @(
                "$env:PROGRAMFILES\Google\Chrome\Application\chrome.exe",
                "$env:PROGRAMFILES(X86)\Google\Chrome\Application\chrome.exe",
                "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
            )
            
            $chromePath = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
            
            if ($chromePath) {
                Start-Process -FilePath $chromePath -ArgumentList ($chromeArgs + $Url)
                Write-Host "✅ Chrome launched successfully" -ForegroundColor Green
            } else {
                Write-Host "❌ Chrome not found. Trying Edge..." -ForegroundColor Yellow
                & $MyInvocation.MyCommand.Path -Browser "edge" -Url $Url
            }
        } catch {
            Write-Host "❌ Failed to launch Chrome: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    "firefox" {
        Write-Host "🚀 Launching Mozilla Firefox..." -ForegroundColor Green
        try {
            $firefoxPaths = @(
                "$env:PROGRAMFILES\Mozilla Firefox\firefox.exe",
                "$env:PROGRAMFILES(X86)\Mozilla Firefox\firefox.exe"
            )
            
            $firefoxPath = $firefoxPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
            
            if ($firefoxPath) {
                Start-Process -FilePath $firefoxPath -ArgumentList ($firefoxArgs + $Url)
                Write-Host "✅ Firefox launched successfully" -ForegroundColor Green
            } else {
                Write-Host "❌ Firefox not found. Trying Chrome..." -ForegroundColor Yellow
                & $MyInvocation.MyCommand.Path -Browser "chrome" -Url $Url
            }
        } catch {
            Write-Host "❌ Failed to launch Firefox: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    "edge" {
        Write-Host "🚀 Launching Microsoft Edge..." -ForegroundColor Green
        try {
            $edgePaths = @(
                "$env:PROGRAMFILES(X86)\Microsoft\Edge\Application\msedge.exe",
                "$env:PROGRAMFILES\Microsoft\Edge\Application\msedge.exe"
            )
            
            $edgePath = $edgePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
            
            if ($edgePath) {
                Start-Process -FilePath $edgePath -ArgumentList ($edgeArgs + $Url)
                Write-Host "✅ Edge launched successfully" -ForegroundColor Green
            } else {
                Write-Host "❌ Edge not found. Trying default browser..." -ForegroundColor Yellow
                Start-Process $Url
            }
        } catch {
            Write-Host "❌ Failed to launch Edge: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "🚀 Launching default browser..." -ForegroundColor Green
        Start-Process $Url
    }
}

Write-Host ""
Write-Host "📸 Visual Testing Instructions:" -ForegroundColor Cyan
Write-Host "1. Navigate through the application in the external browser" -ForegroundColor White
Write-Host "2. Test responsive behavior at different screen sizes" -ForegroundColor White
Write-Host "3. Run visual regression capture commands:" -ForegroundColor White
Write-Host "   - npm run visual:current  (capture current state)" -ForegroundColor Gray
Write-Host "   - npm run visual:baseline (capture baseline)" -ForegroundColor Gray
Write-Host "   - npm run visual:report   (generate report)" -ForegroundColor Gray
Write-Host "4. Screenshots will be saved to /screenshots/ directory" -ForegroundColor White
Write-Host ""
Write-Host "⚖️ Master Agent Edict: External browser testing ensures accurate visual regression detection" -ForegroundColor Green