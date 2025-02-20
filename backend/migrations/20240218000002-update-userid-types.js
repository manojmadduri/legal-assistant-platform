'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
  },

  async down(queryInterface, Sequelize) {
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
  }
};
