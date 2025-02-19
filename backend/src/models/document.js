const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.User, { foreignKey: 'userId' });
      Document.belongsToMany(models.ComplianceCheck, {
        through: 'DocumentCompliance',
        as: 'complianceChecks'
      });
    }
  }
  
  Document.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM,
      values: ['CONTRACT', 'COMPLIANCE', 'IP_FILING', 'LEGAL_MEMO', 'COURT_FILING', 'OTHER'],
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'],
      defaultValue: 'DRAFT'
    },
    category: {
      type: DataTypes.STRING
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    version: {
      type: DataTypes.STRING,
      defaultValue: '1.0'
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.DATE
    },
    reviewDate: {
      type: DataTypes.DATE
    },
    reviewedBy: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reviewNotes: {
      type: DataTypes.TEXT
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    visibility: {
      type: DataTypes.ENUM,
      values: ['PUBLIC', 'PRIVATE', 'TEAM'],
      defaultValue: 'PRIVATE'
    },
    lastAccessed: {
      type: DataTypes.DATE
    },
    accessCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Document',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['category']
      }
    ]
  });
  
  return Document;
};