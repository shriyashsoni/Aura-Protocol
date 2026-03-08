$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

Get-Content ".env" | ForEach-Object {
  if ($_ -match "^([^#=]+)=(.*)$") {
    [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
  }
}

if (-not $env:PRIVATE_KEY) {
  throw "PRIVATE_KEY must be set in backend/contracts/.env"
}

if (-not $env:NETWORK) {
  $env:NETWORK = "testnet"
}

if (-not $env:ENDPOINT) {
  $env:ENDPOINT = "https://api.explorer.provable.com/v1"
}

if (-not $env:FEE) {
  $env:FEE = "200000"
}

$projects = @(
  "profile_registry",
  "data_market",
  "access_ticketing",
  "inference_settlement",
  "payment_router"
)

foreach ($p in $projects) {
  $programId = "$p.aleo"
  $checkUrl = "$($env:ENDPOINT)/$($env:NETWORK)/program/$programId"

  $alreadyDeployed = $false
  try {
    $null = Invoke-RestMethod -Uri $checkUrl -Method Get
    $alreadyDeployed = $true
  }
  catch {
    $alreadyDeployed = $false
  }

  if ($alreadyDeployed) {
    Write-Host "Skipping $programId (already deployed)." -ForegroundColor Yellow
    continue
  }

  Write-Host "Deploying $programId..." -ForegroundColor Cyan
  Push-Location "$p"
  leo deploy --private-key $env:PRIVATE_KEY --network $env:NETWORK --endpoint $env:ENDPOINT --priority-fees $env:FEE --broadcast -y
  Pop-Location
}

Write-Host "Remaining deployment pass completed." -ForegroundColor Green