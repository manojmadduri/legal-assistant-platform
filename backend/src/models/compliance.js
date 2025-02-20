const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ComplianceCheck extends Model {
    static associate(models) {
      ComplianceCheck.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      ComplianceCheck.belongsToMany(models.Document, {
        through: 'DocumentCompliance',
        as: 'documents'
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
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PASSED', 'FAILED'),
      defaultValue: 'PENDING',
      allowNull: false
    },
    details: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ComplianceCheck',
    tableName: 'ComplianceChecks',
    timestamps: true,
    paranoid: true
  });

  return ComplianceCheck;
};
