require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const usersRouter = require('./routes/users');
const documentsRouter = require('./routes/documents');
const complianceRouter = require('./routes/compliance');
const alertsRouter = require('./routes/alerts');
const contractsRouter = require('./routes/contracts');
const filingsRouter = require('./routes/filings');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDbConnection();

// Routes
app.use('/api/users', usersRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/filings', filingsRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Legal Assistant Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
