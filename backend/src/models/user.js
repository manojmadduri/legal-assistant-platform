const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Document, { foreignKey: 'userId' });
      User.hasMany(models.ComplianceCheck, { foreignKey: 'userId' });
      User.hasMany(models.Filing, { foreignKey: 'userId' });
      User.hasMany(models.LegalAlert, { foreignKey: 'userId' });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      values: ['ADMIN', 'LAWYER', 'PARALEGAL', 'CLIENT'],
      defaultValue: 'CLIENT'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      defaultValue: 'ACTIVE'
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};
