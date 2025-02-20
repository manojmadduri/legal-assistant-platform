require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'legal_assistant',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('ADMIN', 'LAWYER', 'CLIENT'),
    defaultValue: 'CLIENT',
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
    defaultValue: 'ACTIVE',
    allowNull: false
  }
}, {
  tableName: 'Users'
});

async function checkUsers() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'status', 'createdAt'],
      raw: true
    });

    console.log('\nUsers in database:');
    console.log('==================');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach(user => {
        console.log(`\nUser ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Status: ${user.status}`);
        console.log(`Created: ${user.createdAt}`);
        console.log('------------------');
      });
      console.log(`\nTotal users: ${users.length}`);
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

checkUsers();
