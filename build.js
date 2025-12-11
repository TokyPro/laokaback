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
    const swaggerSrc = path.join(__dirname, 'src', 'docs', 'swagger.yaml');
    const swaggerDestDir = path.join(__dirname, 'dist', 'docs');
    if (!fs.existsSync(swaggerDestDir)){
        fs.mkdirSync(swaggerDestDir, { recursive: true });
    }
    fs.copyFileSync(swaggerSrc, path.join(swaggerDestDir, 'swagger.yaml'));

    // Copy prisma schema
    console.log('Copying prisma schema to dist...');
    const prismaSrc = path.join(__dirname, 'prisma', 'schema.prisma');
    const prismaDest = path.join(__dirname, 'dist', 'schema.prisma');
    fs.copyFileSync(prismaSrc, prismaDest);


    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
