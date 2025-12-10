#!/usr/bin/env node

const { execSync } = require('child_process');

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

    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
