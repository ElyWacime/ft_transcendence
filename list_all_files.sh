#!/bin/bash 

rm setup.txt 2>/dev/null || true 
find . \( -type d -name ".git" -o -name "node_modules" -o -name "dist" \) -prune -o \
  -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.env" -o -name "Dockerfile" -o -name "*.yml" -o -name "*.yaml" \) -print |
while read -r file; do
    echo "===== $file =====" >> setup.txt
    cat "$file" >> setup.txt
    echo >> setup.txt
done
