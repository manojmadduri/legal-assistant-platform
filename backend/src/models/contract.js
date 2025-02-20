const { Model, DataTypes, Factory } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }

  Contract.init({
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
    type: {
      type: DataTypes.ENUM('SERVICE', 'EMPLOYMENT', 'NDA', 'LICENSE', 'OTHER'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'EXECUTED'),
      defaultValue: 'DRAFT',
      allowNull: false
    },
    parties: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    terms: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Contract',
    tableName: 'Contracts',
    timestamps: true,
    paranoid: true
  });

  Contract.addHook('beforeCreate', (contract) => {
    // Add any necessary logic before creating a contract
  });

  Contract.addHook('afterCreate', (contract) => {
    // Add any necessary logic after creating a contract
  });

  return Contract;
};