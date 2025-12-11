#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

try {
    // Generate Prisma Client
    console.log('Generating Prisma Client...');
    execSync('node ./node_modules/prisma/build/index.js generate', {
        stdio: 'inherit',
        env: process.env
    });

    // Compile TypeScript
    console.log('Compiling TypeScript...');
    execSync('node ./node_modules/typescript/lib/tsc.js', {
        stdio: 'inherit',
        env: process.env
    });

    // Copy swagger.yaml
    console.log('Copying swagger.yaml to dist...');
    const srcFile = path.join(__dirname, 'src', 'docs', 'swagger.yaml');
    const destDir = path.join(__dirname, 'dist', 'docs');
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcFile, path.join(destDir, 'swagger.yaml'));


    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
