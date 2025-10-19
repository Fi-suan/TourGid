#!/bin/bash

set -e

echo "🔧 Running post-install hook..."

# Убедимся что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

echo "✅ Post-install hook completed successfully"

