const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Initialize Sequelize
const sequelize = new Sequelize(config);

// Import model definitions
const User = require('./user')(sequelize);
const Document = require('./document')(sequelize);
const ComplianceCheck = require('./compliance')(sequelize);
const Filing = require('./filing')(sequelize);
const Contract = require('./contract')(sequelize);

// Set up associations
const models = {
  User,
  Document,
  ComplianceCheck,
  Filing,
  Contract,
  sequelize
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
