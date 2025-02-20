const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class LegalAlert extends Model {
  static associate(models) {
    LegalAlert.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

LegalAlert.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('DEADLINE', 'COMPLIANCE', 'FILING', 'CONTRACT', 'LEGAL_UPDATE', 'OTHER'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    defaultValue: 'MEDIUM'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'),
    defaultValue: 'PENDING'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE
  },
  resolvedBy: {
    type: DataTypes.STRING
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'LegalAlert',
  timestamps: true,
  paranoid: true
});

module.exports = LegalAlert;
