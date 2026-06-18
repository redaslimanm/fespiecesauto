#Requires -Version 5.1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-Command($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Test-PortListening($Port) {
  try {
    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return [bool]$connections
  } catch {
    return $false
  }
}

function Install-Ngrok {
  Write-Step "ngrok not found - attempting installation via winget"
  if (-not (Test-Command winget)) {
    throw "ngrok is not installed. Download from https://ngrok.com/download or run: winget install Ngrok.Ngrok"
  }

  winget install --id Ngrok.Ngrok -e --accept-source-agreements --accept-package-agreements
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

  if (-not (Test-Command ngrok)) {
    throw "ngrok installation finished but the command is still not on PATH. Restart your terminal and run this script again."
  }
}

function Get-NgrokAuthtokenConfigured {
  $configPaths = @(
    "$env:LOCALAPPDATA\ngrok\ngrok.yml",
    "$env:USERPROFILE\.ngrok2\ngrok.yml"
  )

  foreach ($path in $configPaths) {
    if (Test-Path $path) {
      $content = Get-Content $path -Raw
      if ($content -match 'authtoken:\s*\S+') { return $true }
    }
  }

  if ($env:NGROK_AUTHTOKEN) { return $true }
  return $false
}

Write-Step "Detecting application ports"
$portsJson = node "$ProjectRoot\scripts\detect-ports.mjs"
$ports = $portsJson | ConvertFrom-Json
$webPort = [int]$ports.webPort
$apiPort = [int]$ports.apiPort

Write-Host "  Frontend (Vite): http://localhost:$webPort"
Write-Host "  API (Express):   http://localhost:$apiPort"

Write-Step "Generating ngrok configuration"
node "$ProjectRoot\scripts\generate-ngrok-config.mjs" | Out-Host

if (-not (Test-Command ngrok)) {
  Install-Ngrok
}

if (-not (Get-NgrokAuthtokenConfigured) -and -not $env:NGROK_AUTHTOKEN) {
  throw "ngrok authtoken is not configured. Run: ngrok config add-authtoken YOUR_TOKEN (get one at https://dashboard.ngrok.com/get-started/your-authtoken)"
}

Write-Step "Checking dev servers"
$webUp = Test-PortListening $webPort
$apiUp = Test-PortListening $apiPort

if (-not $webUp) {
  Write-Host "  WARNING: Nothing listening on port $webPort (frontend)." -ForegroundColor Yellow
  Write-Host "  Start it in another terminal: npm run dev"
}
if (-not $apiUp) {
  Write-Host "  WARNING: Nothing listening on port $apiPort (API)." -ForegroundColor Yellow
  Write-Host "  Start it in another terminal: npm run dev:api"
}
if (-not ($webUp -and $apiUp)) {
  Write-Host ""
  Write-Host "Start both servers first, then run this script again." -ForegroundColor Yellow
  exit 1
}

Write-Step "Starting ngrok tunnels"
$ngrokConfig = Join-Path $ProjectRoot "ngrok.yml"
$globalNgrokConfig = "$env:LOCALAPPDATA\ngrok\ngrok.yml"

Get-Process ngrok -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$ngrokArgs = @("start", "--all", "--config", $globalNgrokConfig, "--config", $ngrokConfig)
if ($env:NGROK_AUTHTOKEN) {
  $ngrokArgs += @("--authtoken", $env:NGROK_AUTHTOKEN)
}

$ngrokProcess = Start-Process -FilePath "ngrok" -ArgumentList $ngrokArgs -PassThru -WindowStyle Hidden
Write-Host "  ngrok PID: $($ngrokProcess.Id)"

Write-Step "Waiting for public URLs"
Start-Sleep -Seconds 2
$urlsJson = node "$ProjectRoot\scripts\wait-for-ngrok-urls.mjs"
if ($LASTEXITCODE -ne 0) {
  Stop-Process -Id $ngrokProcess.Id -Force -ErrorAction SilentlyContinue
  throw "Failed to retrieve ngrok tunnel URLs."
}
$urls = $urlsJson | ConvertFrom-Json

$webUrl = $urls.webUrl

# Vite proxies /api and /uploads — no separate API tunnel or VITE_API_URL needed.
$envLocalPath = Join-Path $ProjectRoot ".env.local"
if (Test-Path $envLocalPath) {
  $cleaned = Get-Content $envLocalPath | Where-Object { $_ -notmatch '^VITE_API_URL=' }
  if ($cleaned.Count -gt 0) {
    Set-Content -Path $envLocalPath -Value $cleaned -Encoding UTF8
  } else {
    Remove-Item $envLocalPath -Force
  }
  Write-Host "  Removed stale VITE_API_URL from .env.local (proxy handles API on mobile)."
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  OPEN THIS URL ON YOUR PHONE:" -ForegroundColor Green
Write-Host "  $webUrl" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  ngrok dashboard: http://127.0.0.1:4040"
Write-Host ""
Write-Host "IMPORTANT:"
Write-Host "  1. Keep this terminal open (ngrok is running)."
Write-Host "  2. Both servers must run: npm run dev AND npm run dev:api"
Write-Host "  3. On mobile, tap Visit Site if ngrok shows a warning page (free tier)."
Write-Host "  4. Use the HTTPS link above, not localhost."
Write-Host ""
Write-Host "To stop ngrok: Stop-Process -Name ngrok"
