const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Filing extends Model {
    static associate(models) {
      Filing.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
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
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Documents',
        key: 'id'
      }
    },
    filingType: {
      type: DataTypes.ENUM('TRADEMARK', 'PATENT', 'COPYRIGHT', 'BUSINESS_REGISTRATION', 'OTHER'),
      allowNull: false
    },
    jurisdiction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'),
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
    filingNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Filing',
    tableName: 'Filings',
    timestamps: true,
    paranoid: true
  });

  return Filing;
};