const sequelize = require('../src/config/database');
const { User, Document, ComplianceCheck, Filing, Contract } = require('../src/models');

async function resetAndSyncDatabase() {
  try {
    console.log('Starting database reset and sync...');

    // Force sync (this will drop all tables and recreate them)
    await sequelize.sync({ force: true });

    console.log('Database schema recreated successfully');

    // Create test user if needed
    const testUser = await User.findOne({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      await User.create({
        id: '4yH3q8RJxxNcPKQu39EsKWY0OfQ2', // Firebase UID format
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN'
      });
      console.log('Test user created');
    }

    console.log('Database reset and sync completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database reset and sync:', error);
    process.exit(1);
  }
}

// Run the sync
resetAndSyncDatabase();
