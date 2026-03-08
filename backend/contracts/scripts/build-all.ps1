$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$projects = @(
  "profile_registry",
  "data_market",
  "access_ticketing",
  "inference_settlement",
  "payment_router"
)

foreach ($p in $projects) {
  Write-Host "Building $p..." -ForegroundColor Cyan
  Push-Location "$p"
  leo build
  Pop-Location
}

Write-Host "All contracts built." -ForegroundColor Green
