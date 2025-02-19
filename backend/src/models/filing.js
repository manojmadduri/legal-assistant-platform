const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Filing extends Model {
    static associate(models) {
      Filing.belongsTo(models.User, { foreignKey: 'userId' });
      Filing.belongsTo(models.Document, { foreignKey: 'documentId' });
    }
  }
  
  Filing.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    filingType: {
      type: DataTypes.ENUM,
      values: ['TRADEMARK', 'PATENT', 'COPYRIGHT', 'BUSINESS_REGISTRATION', 'OTHER'],
      allowNull: false
    },
    jurisdiction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      defaultValue: 'DRAFT'
    },
    filingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Filing',
    tableName: 'filings'
  });

  return Filing;
};