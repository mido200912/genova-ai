# Genova AI - GitHub Deployment Helper
# This script prepares the repository and pushes it to GitHub

Write-Host "🚀 Starting Genova AI GitHub deployment preparation..." -ForegroundColor Cyan

# 1. Ensure we are in a Git repository
if (!(Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
}

# 2. Check for .gitignore (Already created by AI, but ensuring it exists)
if (!(Test-Path .gitignore)) {
    Write-Host "📄 Creating .gitignore..." -ForegroundColor Yellow
    @"
node_modules/
backend/node_modules/
frontend/node_modules/
.env
backend/.env
frontend/.env
build/
dist/
*.log
.vscode/
.idea/
.DS_Store
"@ | Out-File -FilePath .gitignore -Encoding utf8
}

# 3. Cache cleanup (in case node_modules were accidentally added)
Write-Host "🧹 Cleaning Git index (removing node_modules if tracked)..." -ForegroundColor Yellow
git rm -r --cached . -quiet 2>$null

# 4. Add files
Write-Host "➕ Staging files..." -ForegroundColor Yellow
git add .

# 5. Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: Ready for production" -quiet

# 6. Branch management
Write-Host "🌿 Setting branch to main..." -ForegroundColor Yellow
git branch -M main

# 7. Remote management
$remoteUrl = "https://github.com/mido200912/genova-ai.git"
$existingRemote = git remote get-url origin 2>$null

if ($null -eq $existingRemote) {
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
}
else {
    Write-Host "🔗 Updating remote origin URL..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
}

# 8. Final instructions
Write-Host "`n✅ Preparation Complete!" -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "To finish the upload, run this command manually:" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor Magenta
Write-Host "--------------------------------------------------"
Write-Host "Note: If you get an error about 'refusing to merge unrelated histories',"
Write-Host "you might need to use: git push -u origin main --force" -ForegroundColor Gray
