const sequelize = require('../src/config/database');
const User = require('../src/models/user');
const Document = require('../src/models/document');
const Filing = require('../src/models/filing');
const ComplianceCheck = require('../src/models/compliance');
const Contract = require('../src/models/contract');

async function syncDatabase() {
  try {
    // Force sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();
