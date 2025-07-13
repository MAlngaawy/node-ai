/**
 * Deployment Configuration Helper
 * 
 * This script helps you configure the backend for different deployment scenarios.
 * Run this script to generate the appropriate .env file for your deployment.
 */

const fs = require('fs');
const path = require('path');

const deploymentConfigs = {
  development: {
    PORT: 4000,
    MONGODB_URI: 'mongodb://localhost:27017/askme-app',
    JWT_SECRET: 'dev-secret-key-change-in-production',
    JWT_REFRESH_SECRET: 'dev-refresh-secret-key-change-in-production',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    FRONTEND_URL: 'http://localhost:5173',
    NODE_ENV: 'development'
  },
  production: {
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/askme-app',
    JWT_SECRET: process.env.JWT_SECRET || 'your-production-jwt-secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-production-refresh-secret',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://your-app-name.netlify.app',
    NODE_ENV: 'production'
  }
};

function generateEnvFile(config, filename = '.env') {
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, envContent);
  
  console.log(`✅ Generated ${filename} with ${Object.keys(config).length} environment variables`);
  console.log(`📁 File location: ${filePath}`);
}

function showUsage() {
  console.log(`
🚀 AskMe Backend Deployment Configuration

Usage:
  node deploy-config.js [environment]

Environments:
  development  - Local development setup
  production   - Production deployment setup

Examples:
  node deploy-config.js development
  node deploy-config.js production

Notes:
  - For production, you should set actual environment variables
  - Update FRONTEND_URL with your actual Netlify domain
  - Use strong, unique JWT secrets in production
  - Set up MongoDB Atlas or your preferred database
`);
}

const environment = process.argv[2];

if (!environment || !deploymentConfigs[environment]) {
  showUsage();
  process.exit(1);
}

const config = deploymentConfigs[environment];
generateEnvFile(config);

if (environment === 'production') {
  console.log(`
⚠️  IMPORTANT PRODUCTION NOTES:
1. Update the generated .env file with your actual values
2. Set up environment variables in your hosting platform
3. Update FRONTEND_URL with your Netlify app URL
4. Use strong, unique JWT secrets
5. Set up a production MongoDB database
`);
} 