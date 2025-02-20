'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing foreign key constraints
    await queryInterface.removeConstraint('Filings', 'Filings_userId_fkey');
    await queryInterface.removeConstraint('ComplianceChecks', 'ComplianceChecks_userId_fkey');
    await queryInterface.removeConstraint('Contracts', 'Contracts_userId_fkey');

    // Update userId columns to STRING type
    await queryInterface.changeColumn('Filings', 'userId', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('ComplianceChecks', 'userId', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('Contracts', 'userId', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Add back foreign key constraints with correct type
    await queryInterface.addConstraint('Filings', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Filings_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('ComplianceChecks', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'ComplianceChecks_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Contracts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Contracts_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the new foreign key constraints
    await queryInterface.removeConstraint('Filings', 'Filings_userId_fkey');
    await queryInterface.removeConstraint('ComplianceChecks', 'ComplianceChecks_userId_fkey');
    await queryInterface.removeConstraint('Contracts', 'Contracts_userId_fkey');

    // Revert userId columns back to UUID type
    await queryInterface.changeColumn('Filings', 'userId', {
      type: Sequelize.UUID,
      allowNull: false
    });
    await queryInterface.changeColumn('ComplianceChecks', 'userId', {
      type: Sequelize.UUID,
      allowNull: false
    });
    await queryInterface.changeColumn('Contracts', 'userId', {
      type: Sequelize.UUID,
      allowNull: false
    });

    // Add back original foreign key constraints
    await queryInterface.addConstraint('Filings', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Filings_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('ComplianceChecks', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'ComplianceChecks_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Contracts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Contracts_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};
