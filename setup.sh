#!/bin/bash

# Fantasy Tome Keeper Setup Script
echo "🏗️  Setting up Fantasy Tome Keeper..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your API keys and database URLs"
    echo ""
    echo "You'll need to set up:"
    echo "  - Supabase project (https://supabase.com)"
    echo "  - Google Books API key (https://developers.google.com/books/docs/v1/using#APIKey)"
    echo "  - Optional: YouTube API key for enhanced audiobook integration"
fi

# Create placeholder icons (will be replaced with actual icons)
echo "🎨 Creating placeholder PWA icons..."
mkdir -p public/icons
mkdir -p public/screenshots

# Check if development server can start
echo "🚀 Testing development server..."
npm run dev &
DEV_PID=$!
sleep 5

# Kill the test server
kill $DEV_PID 2>/dev/null

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Set up your Supabase database (see README.md)"
echo "3. Run 'npm run dev' to start development"
echo ""
echo "🔗 Useful links:"
echo "  - Supabase Dashboard: https://app.supabase.com"
echo "  - Google Books API: https://developers.google.com/books"
echo "  - Project Documentation: ./README.md"
