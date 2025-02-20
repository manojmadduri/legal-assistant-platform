'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop tables in reverse order of dependencies
    await queryInterface.dropTable('Filings', { cascade: true });
    await queryInterface.dropTable('ComplianceChecks', { cascade: true });
    await queryInterface.dropTable('Contracts', { cascade: true });
    await queryInterface.dropTable('Documents', { cascade: true });
    await queryInterface.dropTable('Users', { cascade: true });

    // Recreate Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'LAWYER', 'CLIENT'),
        defaultValue: 'CLIENT'
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Recreate Documents table
    await queryInterface.createTable('Documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ENUM('CONTRACT', 'FILING', 'LEGAL_MEMO', 'CORRESPONDENCE', 'OTHER'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'REVIEW', 'FINAL', 'ARCHIVED'),
        defaultValue: 'DRAFT'
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Recreate Filings table
    await queryInterface.createTable('Filings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      documentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      filingType: {
        type: Sequelize.ENUM('TRADEMARK', 'PATENT', 'COPYRIGHT', 'BUSINESS_REGISTRATION', 'OTHER'),
        allowNull: false
      },
      jurisdiction: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'),
        defaultValue: 'DRAFT'
      },
      filingDate: {
        type: Sequelize.DATE
      },
      dueDate: {
        type: Sequelize.DATE
      },
      filingNumber: {
        type: Sequelize.STRING,
        unique: true
      },
      fees: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      notes: {
        type: Sequelize.TEXT
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Recreate ComplianceChecks table
    await queryInterface.createTable('ComplianceChecks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ENUM('REGULATORY', 'LEGAL', 'CONTRACTUAL', 'INTERNAL', 'OTHER'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'IN_PROGRESS', 'COMPLIANT', 'NON_COMPLIANT', 'REQUIRES_ACTION'),
        defaultValue: 'PENDING'
      },
      dueDate: {
        type: Sequelize.DATE
      },
      completedAt: {
        type: Sequelize.DATE
      },
      completedBy: {
        type: Sequelize.STRING
      },
      findings: {
        type: Sequelize.TEXT
      },
      recommendations: {
        type: Sequelize.TEXT
      },
      priority: {
        type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
        defaultValue: 'MEDIUM'
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Recreate Contracts table
    await queryInterface.createTable('Contracts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      documentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('EMPLOYMENT', 'SERVICE', 'NDA', 'LEASE', 'VENDOR', 'OTHER'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'REVIEW', 'NEGOTIATION', 'SIGNED', 'EXPIRED', 'TERMINATED'),
        defaultValue: 'DRAFT'
      },
      parties: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      effectiveDate: {
        type: Sequelize.DATE
      },
      expirationDate: {
        type: Sequelize.DATE
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      terms: {
        type: Sequelize.TEXT
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Create junction table for ComplianceChecks and Documents
    await queryInterface.createTable('DocumentCompliance', {
      documentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Documents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      complianceCheckId: {
        type: Sequelize.UUID,
        references: {
          model: 'ComplianceChecks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DocumentCompliance', { cascade: true });
    await queryInterface.dropTable('Contracts', { cascade: true });
    await queryInterface.dropTable('ComplianceChecks', { cascade: true });
    await queryInterface.dropTable('Filings', { cascade: true });
    await queryInterface.dropTable('Documents', { cascade: true });
    await queryInterface.dropTable('Users', { cascade: true });
  }
};
