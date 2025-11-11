import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Project Structure', () => {
  it('should have all required directories', () => {
    expect(fs.existsSync('src')).toBe(true);
    expect(fs.existsSync('public')).toBe(true);
    expect(fs.existsSync('uploads')).toBe(true);
  });

  it('should have server entry point', () => {
    expect(fs.existsSync('src/server.ts')).toBe(true);
  });

  it('should have routes directory', () => {
    expect(fs.existsSync('src/routes')).toBe(true);
  });

  it('should have services directory', () => {
    expect(fs.existsSync('src/services')).toBe(true);
  });

  it('should have image processor service', () => {
    expect(fs.existsSync('src/services/imageProcessor.ts')).toBe(true);
  });

  it('should have image routes', () => {
    expect(fs.existsSync('src/routes/imageRoutes.ts')).toBe(true);
  });

  it('should have frontend files', () => {
    expect(fs.existsSync('public/index.html')).toBe(true);
    expect(fs.existsSync('public/style.css')).toBe(true);
    expect(fs.existsSync('public/app.js')).toBe(true);
  });

  it('should have configuration files', () => {
    expect(fs.existsSync('package.json')).toBe(true);
    expect(fs.existsSync('tsconfig.json')).toBe(true);
    expect(fs.existsSync('jest.config.cjs')).toBe(true);
  });
});

describe('Package Configuration', () => {
  it('should have valid package.json', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    expect(packageJson.name).toBe('wonkang-retrotoon');
    expect(packageJson.type).toBe('module');
    expect(packageJson.main).toBe('dist/server.js');
  });

  it('should have all required scripts', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.start).toBeDefined();
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts.lint).toBeDefined();
  });

  it('should have all required dependencies', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    expect(packageJson.dependencies.express).toBeDefined();
    expect(packageJson.dependencies.sharp).toBeDefined();
    expect(packageJson.dependencies.multer).toBeDefined();
    expect(packageJson.dependencies.cors).toBeDefined();
  });

  it('should have all required devDependencies', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    expect(packageJson.devDependencies.typescript).toBeDefined();
    expect(packageJson.devDependencies.jest).toBeDefined();
    expect(packageJson.devDependencies['ts-jest']).toBeDefined();
    expect(packageJson.devDependencies['@types/node']).toBeDefined();
  });
});
