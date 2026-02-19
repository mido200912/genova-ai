# Genova AI - Quick Start Script for Windows
# This script helps you set up the project quickly

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Genova AI - Quick Setup Script    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Backend .env file created. Please edit it with your configuration!" -ForegroundColor Green
    Write-Host "  - Add your OpenRouter API key" -ForegroundColor Yellow
    Write-Host "  - Update MongoDB URI if needed" -ForegroundColor Yellow
    Write-Host "  - Set a strong JWT secret" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "Step 2: Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Frontend .env file created" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉                " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend\.env file with your OpenRouter API key" -ForegroundColor White
Write-Host "2. Make sure MongoDB is running" -ForegroundColor White
Write-Host "3. Open two terminals:" -ForegroundColor White
Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "   Terminal 2: cd frontend && npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Access the app at http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "For detailed instructions, see SETUP_GUIDE.md" -ForegroundColor Yellow
