const express = require('express');
const router = express.Router();
const { User, Document, ComplianceCheck, LegalAlert } = require('../models');
const auth = require('../middleware/auth');
const { admin } = require('../config/firebase-admin');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {
      id,
      email,
      companyName,
      businessType,
      industry,
      phone,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      id,
      email,
      companyName,
      businessType,
      industry,
      phone,
      address,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update user profile
router.post('/profile', auth, async (req, res) => {
  try {
    const {
      companyName,
      businessType,
      industry,
      phone,
      address,
    } = req.body;

    const [user, created] = await User.upsert({
      id: req.user.id,
      email: req.user.email,
      companyName,
      businessType,
      industry,
      phone,
      address,
    });

    res.status(created ? 201 : 200).json(user);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile by id
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      companyName,
      businessType,
      industry,
      phone,
      address,
      notificationsEnabled,
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    Object.assign(user, {
      companyName,
      businessType,
      industry,
      phone,
      address,
      notificationsEnabled,
    });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile by id
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      companyName,
      businessType,
      industry,
      phone,
      address,
    } = req.body;

    await user.update({
      companyName,
      businessType,
      industry,
      phone,
      address,
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const [documents, complianceChecks, alerts] = await Promise.all([
      Document.count({ where: { userId: req.user.id } }),
      ComplianceCheck.count({ where: { userId: req.user.id } }),
      LegalAlert.count({ where: { userId: req.user.id } })
    ]);

    res.json({
      documents,
      complianceChecks,
      alerts
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user dashboard stats
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    // Initialize empty stats object with default values
    const stats = {
      documents: {
        total: 0,
        byType: {},
        byStatus: {},
      },
      compliance: {
        total: 0,
        compliant: 0,
        nonCompliant: 0,
        byType: {},
      },
      alerts: {
        total: 0,
        pending: 0,
        acknowledged: 0,
        byPriority: {},
      },
    };

    // Get documents stats
    const documents = await Document.findAll({ where: { userId: req.user.id } });
    stats.documents.total = documents.length;
    documents.forEach(doc => {
      stats.documents.byType[doc.type] = (stats.documents.byType[doc.type] || 0) + 1;
      stats.documents.byStatus[doc.status] = (stats.documents.byStatus[doc.status] || 0) + 1;
    });

    // Get compliance stats
    const complianceChecks = await ComplianceCheck.findAll({ where: { userId: req.user.id } });
    stats.compliance.total = complianceChecks.length;
    stats.compliance.compliant = complianceChecks.filter(check => check.status === 'COMPLIANT').length;
    stats.compliance.nonCompliant = complianceChecks.filter(check => check.status === 'NON_COMPLIANT').length;
    complianceChecks.forEach(check => {
      stats.compliance.byType[check.type] = (stats.compliance.byType[check.type] || 0) + 1;
    });

    // Get alerts stats
    const alerts = await LegalAlert.findAll({ where: { userId: req.user.id } });
    stats.alerts.total = alerts.length;
    stats.alerts.pending = alerts.filter(alert => alert.status === 'PENDING').length;
    stats.alerts.acknowledged = alerts.filter(alert => alert.status === 'ACKNOWLEDGED').length;
    alerts.forEach(alert => {
      stats.alerts.byPriority[alert.priority] = (stats.alerts.byPriority[alert.priority] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get user activity log
router.get('/activity', auth, async (req, res) => {
  try {
    const [documents, complianceChecks, alerts] = await Promise.all([
      Document.findAll({
        where: { userId: req.user.id },
        order: [['updatedAt', 'DESC']],
        limit: 10,
      }),
      ComplianceCheck.findAll({
        where: { userId: req.user.id },
        order: [['updatedAt', 'DESC']],
        limit: 10,
      }),
      LegalAlert.findAll({
        where: { userId: req.user.id },
        order: [['updatedAt', 'DESC']],
        limit: 10,
      }),
    ]);

    // Combine and sort activities
    const activities = [
      ...documents.map(doc => ({
        type: 'DOCUMENT',
        action: doc.status === 'DRAFT' ? 'created' : 'updated',
        title: doc.title,
        timestamp: doc.updatedAt,
        status: doc.status,
      })),
      ...complianceChecks.map(check => ({
        type: 'COMPLIANCE',
        action: 'performed',
        title: `${check.type} compliance check`,
        timestamp: check.updatedAt,
        status: check.status,
      })),
      ...alerts.map(alert => ({
        type: 'ALERT',
        action: alert.status === 'PENDING' ? 'created' : 'updated',
        title: alert.title,
        timestamp: alert.updatedAt,
        status: alert.status,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user account
router.delete('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's Firebase account
    await admin.auth().deleteUser(req.user.id);

    // Delete user's data
    await Promise.all([
      Document.destroy({ where: { userId: req.user.id } }),
      ComplianceCheck.destroy({ where: { userId: req.user.id } }),
      LegalAlert.destroy({ where: { userId: req.user.id } }),
      user.destroy(),
    ]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
