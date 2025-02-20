const sequelize = require('../src/config/database');

async function dropConstraints() {
  try {
    await sequelize.query('ALTER TABLE "Filings" DROP CONSTRAINT IF EXISTS "Filings_documentId_fkey"');
    await sequelize.query('ALTER TABLE "Filings" DROP CONSTRAINT IF EXISTS "Filings_userId_fkey"');
    await sequelize.query('ALTER TABLE "ComplianceChecks" DROP CONSTRAINT IF EXISTS "ComplianceChecks_userId_fkey"');
    await sequelize.query('ALTER TABLE "Contracts" DROP CONSTRAINT IF EXISTS "Contracts_userId_fkey"');
    await sequelize.query('ALTER TABLE "Contracts" DROP CONSTRAINT IF EXISTS "Contracts_documentId_fkey"');
    console.log('Successfully dropped constraints');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping constraints:', error);
    process.exit(1);
  }
}

dropConstraints();
