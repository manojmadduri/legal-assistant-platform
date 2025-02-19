const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ComplianceCheck extends Model {
    static associate(models) {
      ComplianceCheck.belongsTo(models.User, { foreignKey: 'userId' });
      ComplianceCheck.belongsToMany(models.Document, {
        through: 'DocumentCompliance',
        foreignKey: 'complianceCheckId',
        otherKey: 'documentId'
      });
    }
  }
  
  ComplianceCheck.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['PENDING', 'PASSED', 'FAILED'],
      defaultValue: 'PENDING'
    },
    priority: {
      type: DataTypes.ENUM,
      values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      defaultValue: 'MEDIUM'
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'GENERAL'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'ComplianceCheck',
    tableName: 'compliance_checks'
  });
  
  return ComplianceCheck;
};