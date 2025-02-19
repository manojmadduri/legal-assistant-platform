const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LegalAlert extends Model {
    static associate(models) {
      LegalAlert.belongsTo(models.User, { foreignKey: 'userId' });
      LegalAlert.belongsTo(models.Document, { foreignKey: 'documentId', as: 'relatedDocument' });
      LegalAlert.belongsTo(models.ComplianceCheck, { foreignKey: 'complianceCheckId', as: 'relatedCompliance' });
    }
  }

  LegalAlert.init({
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['DOCUMENT_EXPIRY', 'COMPLIANCE_DUE', 'FILING_DEADLINE', 'GENERAL'],
      defaultValue: 'GENERAL'
    },
    priority: {
      type: DataTypes.ENUM,
      values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      defaultValue: 'MEDIUM'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['PENDING', 'READ', 'ARCHIVED'],
      defaultValue: 'PENDING'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'documents',
        key: 'id'
      }
    },
    complianceCheckId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'compliance_checks',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'LegalAlert',
    tableName: 'legal_alerts'
  });

  return LegalAlert;
};
