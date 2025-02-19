const db = require('../models');

const syncDatabase = async () => {
  try {
    // Test the connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await db.sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();
