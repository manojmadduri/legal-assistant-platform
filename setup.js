const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('\n🚀 Starting Legal Assistant Platform setup...\n');

  try {
    // Create necessary directories
    const dirs = [
      'backend/src/logs',
      'backend/src/uploads',
      'frontend/src/assets',
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });

    // Collect environment variables
    console.log('\n📝 Please provide the following configuration details:\n');

    // Firebase config
    console.log('\n🔥 Firebase Configuration:');
    const firebaseApiKey = await question('Firebase API Key: ');
    const firebaseAuthDomain = await question('Firebase Auth Domain: ');
    const firebaseProjectId = await question('Firebase Project ID: ');
    const firebaseStorageBucket = await question('Firebase Storage Bucket: ');
    const firebaseMessagingSenderId = await question('Firebase Messaging Sender ID: ');
    const firebaseAppId = await question('Firebase App ID: ');

    // Database config
    console.log('\n🗄️ Database Configuration:');
    const dbUsername = await question('Database Username (default: postgres): ') || 'postgres';
    const dbPassword = await question('Database Password: ');
    const dbName = await question('Database Name (default: legal_assistant_db): ') || 'legal_assistant_db';

    // OpenAI config
    console.log('\n🤖 OpenAI Configuration:');
    const openaiApiKey = await question('OpenAI API Key: ');

    // Create frontend .env
    const frontendEnv = `REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_FIREBASE_API_KEY=${firebaseApiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${firebaseAuthDomain}
REACT_APP_FIREBASE_PROJECT_ID=${firebaseProjectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${firebaseStorageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${firebaseMessagingSenderId}
REACT_APP_FIREBASE_APP_ID=${firebaseAppId}`;

    fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
    console.log('\n✅ Created frontend .env file');

    // Create backend .env
    const backendEnv = `PORT=3001
NODE_ENV=development

# Database
DB_USERNAME=${dbUsername}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Firebase Admin
FIREBASE_PROJECT_ID=${firebaseProjectId}
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# OpenAI
OPENAI_API_KEY=${openaiApiKey}

# Email (configure later)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=`;

    fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
    console.log('✅ Created backend .env file');

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    
    console.log('\nInstalling backend dependencies...');
    execSync('cd backend && npm install', { stdio: 'inherit' });
    
    console.log('\nInstalling frontend dependencies...');
    execSync('cd frontend && npm install', { stdio: 'inherit' });

    console.log('\n✅ Dependencies installed successfully');

    // Create database
    console.log('\n🗄️ Setting up database...');
    try {
      execSync('cd backend && npx sequelize-cli db:create', { stdio: 'inherit' });
      execSync('cd backend && npx sequelize-cli db:migrate', { stdio: 'inherit' });
      console.log('✅ Database setup completed');
    } catch (error) {
      console.error('⚠️ Database setup failed. Please check your database configuration.');
    }

    console.log('\n🎉 Setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Configure Firebase Admin SDK credentials in backend/.env');
    console.log('2. Start the backend server: cd backend && npm run dev');
    console.log('3. Start the frontend server: cd frontend && npm start');
    console.log('\nHappy coding! 🚀\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    rl.close();
  }
}

setup();
