#!/usr/bin/env node
/**
 * Diagnostic build script to understand Hostinger's environment
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n=== DIAGNOSTIC INFO ===\n');
console.log('Current directory:', __dirname);
console.log('Node version:', process.version);
console.log('NPM version:', execSync('npm --version').toString().trim());

// Check if node_modules exists
const nodeModulesPath = join(__dirname, 'node_modules');
console.log('\nnode_modules exists?', existsSync(nodeModulesPath));

if (existsSync(nodeModulesPath)) {
  console.log('\nnode_modules contents (first 20):');
  const contents = readdirSync(nodeModulesPath);
  console.log(contents.slice(0, 20).join(', '));
  console.log(`\nTotal packages: ${contents.length}`);
  
  // Check for vite specifically
  const vitePath = join(nodeModulesPath, 'vite');
  console.log('\nvite exists?', existsSync(vitePath));
  
  // Check for .bin
  const binPath = join(nodeModulesPath, '.bin');
  console.log('.bin exists?', existsSync(binPath));
  if (existsSync(binPath)) {
    const binContents = readdirSync(binPath);
    console.log('.bin contents:', binContents.slice(0, 10).join(', '));
  }
} else {
  console.log('\n❌ node_modules directory does NOT exist!');
  console.log('This means npm install did not work correctly.');
}

// Try to find where packages might be
console.log('\n=== Trying to run vite anyway ===\n');
try {
  execSync('which vite', { stdio: 'inherit' });
} catch (e) {
  console.log('vite not found in PATH');
}

// Try using npx with --no-install flag
console.log('\n=== Attempting build with npx --no-install ===\n');
try {
  execSync('npx --no-install vite build', { stdio: 'inherit', cwd: __dirname });
  console.log('\n✅ Vite build succeeded!');
  
  execSync('npx --no-install esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit', cwd: __dirname });
  console.log('\n✅ Build completed successfully!\n');
} catch (error) {
  console.error('\n❌ Build failed with npx --no-install');
  process.exit(1);
}
