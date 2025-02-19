# Legal Assistant Platform

A comprehensive AI-powered legal management system for small businesses, automating contract drafting, legal compliance checks, and intellectual property management.

## Features

- 🤖 AI-Powered Contract Generation
- 📋 Automated Compliance Checks
- 📅 Legal Deadline Management
- 📄 Document Management System
- 🔔 Smart Notifications
- 📊 Business Dashboard
- 🔒 Secure Authentication

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Firebase Authentication
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express.js
- PostgreSQL with Sequelize ORM
- Redis with BullMQ for task scheduling
- OpenAI GPT-4 Integration
- Firebase Admin SDK
- JWT Authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- Git

## Environment Setup

### 1. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Create a Web App and get the configuration
4. Generate a service account key for backend integration

### 2. OpenAI Setup
1. Create an account at [OpenAI](https://platform.openai.com)
2. Generate an API key
3. Enable GPT-4 access for your account

### 3. Frontend Environment Variables
Create `.env` in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Backend Environment Variables
Create `.env` in the backend directory:
```env
PORT=3001
NODE_ENV=development

# Database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=legal_assistant_db
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/legal-assistant-platform.git
cd legal-assistant-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up the database:
```bash
cd ../backend
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development Guidelines

### Code Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── workers/
│   │   └── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── App.tsx
    └── package.json
```

### Security Best Practices

1. Always use environment variables for sensitive data
2. Implement rate limiting for API endpoints
3. Use Firebase Authentication for user management
4. Validate all user inputs
5. Implement proper error handling
6. Use HTTPS in production
7. Regular security audits

## Testing

1. Run backend tests:
```bash
cd backend
npm test
```

2. Run frontend tests:
```bash
cd frontend
npm test
```

## Deployment

### Railway Deployment

1. Create a Railway account
2. Connect your GitHub repository
3. Set up the environment variables
4. Deploy both frontend and backend services

### Production Considerations

1. Set up proper monitoring
2. Configure error tracking (e.g., Sentry)
3. Set up automated backups
4. Configure proper logging
5. Set up CI/CD pipelines

## Maintenance

Regular maintenance tasks:
1. Update dependencies regularly
2. Monitor API usage and costs
3. Database backups
4. Log rotation
5. Security updates

## Support

For support, please email support@yourdomain.com or create an issue in the GitHub repository.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
