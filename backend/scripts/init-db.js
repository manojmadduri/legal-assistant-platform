const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration
const config = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'legal_assistant',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: console.log
};

// Initialize Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging
  }
);

async function initializeDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Drop all tables and types
    await sequelize.query('DROP TABLE IF EXISTS "Documents" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "ComplianceChecks" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Filings" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Contracts" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "DocumentCompliance" CASCADE');
    
    await sequelize.query('DROP TYPE IF EXISTS "enum_Documents_type" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_Documents_status" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_Users_role" CASCADE');
    await sequelize.query('DROP TYPE IF EXISTS "enum_Users_status" CASCADE');

    console.log('Existing tables and types dropped successfully.');

    // Create ENUM types
    await sequelize.query(`
      CREATE TYPE "enum_Documents_type" AS ENUM (
        'CONTRACT', 'COMPLIANCE', 'IP_FILING', 'LEGAL_MEMO', 'COURT_FILING', 'OTHER'
      )
    `);

    await sequelize.query(`
      CREATE TYPE "enum_Documents_status" AS ENUM (
        'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'
      )
    `);

    await sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM (
        'ADMIN', 'LAWYER', 'CLIENT'
      )
    `);

    await sequelize.query(`
      CREATE TYPE "enum_Users_status" AS ENUM (
        'ACTIVE', 'INACTIVE', 'SUSPENDED'
      )
    `);

    console.log('ENUM types created successfully.');

    // Create Users table
    await sequelize.query(`
      CREATE TABLE "Users" (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role "enum_Users_role" NOT NULL DEFAULT 'CLIENT',
        status "enum_Users_status" NOT NULL DEFAULT 'ACTIVE',
        settings JSONB DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deletedAt" TIMESTAMP WITH TIME ZONE
      )
    `);

    // Create Documents table with content default value
    await sequelize.query(`
      CREATE TABLE "Documents" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" VARCHAR(255) NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        type "enum_Documents_type" NOT NULL,
        status "enum_Documents_status" NOT NULL DEFAULT 'DRAFT',
        content TEXT DEFAULT '' NOT NULL CHECK (content IS NOT NULL),
        "fileUrl" VARCHAR(255),
        "fileName" VARCHAR(255),
        "fileType" VARCHAR(255),
        "fileSize" INTEGER,
        metadata JSONB DEFAULT '{}' NOT NULL,
        version INTEGER DEFAULT 1 NOT NULL,
        description TEXT,
        tags JSONB DEFAULT '[]' NOT NULL,
        "dueDate" TIMESTAMP WITH TIME ZONE,
        "lastReviewedAt" TIMESTAMP WITH TIME ZONE,
        "lastReviewedBy" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "content_not_null" CHECK (content IS NOT NULL)
      )
    `);

    console.log('Tables created successfully.');

    // Create indexes
    await sequelize.query(`
      CREATE INDEX "documents_userId_idx" ON "Documents"("userId");
      CREATE INDEX "documents_type_idx" ON "Documents"(type);
      CREATE INDEX "documents_status_idx" ON "Documents"(status);
      CREATE INDEX "users_role_idx" ON "Users"(role);
      CREATE INDEX "users_status_idx" ON "Users"(status);
    `);

    console.log('Indexes created successfully.');

    // Create test user
    await sequelize.query(`
      INSERT INTO "Users" (id, email, name, role, status, settings, "createdAt", "updatedAt")
      VALUES (
        '4yH3q8RJxxNcPKQu39EsKWY0OfQ2',
        'test@example.com',
        'Test User',
        'ADMIN',
        'ACTIVE',
        '{}',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('Test user created successfully.');
    console.log('Database initialization completed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
