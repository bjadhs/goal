#!/bin/bash

echo "🚀 Goal App - Quick Deploy to Vercel"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Goal app with Supabase"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create a GitHub repository at: https://github.com/new"
echo "2. Run these commands to push your code:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/goal-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'Add New Project'"
echo "   - Import your GitHub repository"
echo "   - Add environment variables:"
echo "     • NEXT_PUBLIC_SUPABASE_URL"
echo "     • NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - Click 'Deploy'"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
