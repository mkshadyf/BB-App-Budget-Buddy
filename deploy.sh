#!/bin/bash

# BudgetBuddy v1.0 - GitHub Pages Deployment Script
# This script helps you deploy your app to GitHub Pages

echo "🚀 BudgetBuddy v1.0 - GitHub Pages Deployment"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ No git repository found. Please initialize git first:"
    echo "   git init"
    echo "   git remote add origin https://github.com/yourusername/budget-buddy.git"
    exit 1
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  You're on branch '$CURRENT_BRANCH'. Switching to main..."
    git checkout main 2>/dev/null || git checkout -b main
fi

echo "📦 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "📤 Committing changes..."
git add .
git commit -m "feat: BudgetBuddy v1.0 - Production ready with GitHub Pages deployment"

echo "🌐 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your app is being deployed to GitHub Pages!"
    echo ""
    echo "Next steps:"
    echo "1. Go to your GitHub repository settings"
    echo "2. Navigate to 'Pages' in the left sidebar"
    echo "3. Under 'Source', select 'GitHub Actions'"
    echo "4. Your app will be live at: https://yourusername.github.io/repository-name/"
    echo ""
    echo "🎯 The deployment will complete automatically in 2-3 minutes."
else
    echo "❌ Push failed. Please check your GitHub repository settings."
    exit 1
fi