const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Contract.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending_review', 'active', 'expired', 'terminated'),
      defaultValue: 'draft',
    },
    parties: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    effectiveDate: {
      type: DataTypes.DATE,
    },
    expirationDate: {
      type: DataTypes.DATE,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    aiGeneratedSummary: {
      type: DataTypes.TEXT,
    },
    lastReviewedAt: {
      type: DataTypes.DATE,
    },
    reviewedBy: {
      type: DataTypes.UUID,
    }
  }, {
    sequelize,
    modelName: 'Contract',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['type']
      }
    ]
  });

  return Contract;
};