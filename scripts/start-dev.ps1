#Requires -Version 5.1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

function Test-PortListening($Port) {
  try {
    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return [bool]$connections
  } catch {
    return $false
  }
}

$portsJson = node "$ProjectRoot\scripts\detect-ports.mjs"
$ports = $portsJson | ConvertFrom-Json
$webPort = [int]$ports.webPort
$apiPort = [int]$ports.apiPort

Write-Host ""
Write-Host "AutoPieces Fes - Starting dev servers" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-PortListening $apiPort)) {
  Write-Host "Starting API on port $apiPort..." -ForegroundColor Yellow
  Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$ProjectRoot'; npm run dev:api"
  )
  Start-Sleep -Seconds 3
} else {
  Write-Host "API already running on port $apiPort" -ForegroundColor Green
}

if (-not (Test-PortListening $webPort)) {
  Write-Host "Starting frontend on port $webPort..." -ForegroundColor Yellow
  Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$ProjectRoot'; npm run dev"
  )
  Start-Sleep -Seconds 3
} else {
  Write-Host "Frontend already running on port $webPort" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  App ready at: http://localhost:$webPort" -ForegroundColor Green
Write-Host "  API ready at: http://localhost:$apiPort" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "To share with a friend (after ngrok authtoken is set): npm run share"
Write-Host ""
