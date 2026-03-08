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
	throw "PRIVATE_KEY must be set in .env"
}

if (-not $env:NETWORK) {
	$env:NETWORK = "testnet"
}

if (-not $env:ENDPOINT) {
	$env:ENDPOINT = "https://api.explorer.aleo.org/v1"
}

if (-not $env:FEE) {
	$env:FEE = "200000"
}

leo deploy --private-key $env:PRIVATE_KEY --network $env:NETWORK --endpoint $env:ENDPOINT --priority-fees $env:FEE --broadcast -y
