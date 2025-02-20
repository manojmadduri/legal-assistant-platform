const sequelize = require('../src/config/database');

async function resetDatabase() {
  try {
    // Drop all tables
    await sequelize.query('DROP TABLE IF EXISTS "DocumentCompliance" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Contracts" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "ComplianceChecks" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Filings" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Documents" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta" CASCADE');

    // Run migrations
    const { exec } = require('child_process');
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error('Error running migrations:', error);
        return;
      }
      console.log('Migration output:', stdout);
      if (stderr) console.error('Migration stderr:', stderr);
      
      console.log('Database reset and migrations completed successfully');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
