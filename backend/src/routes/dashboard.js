const express = require('express');
const router = express.Router();
const { Document } = require('../models/Document');
const { ComplianceCheck } = require('../models/ComplianceCheck');
const { authenticateToken } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get document stats
    const totalDocuments = await Document.count();
    const pendingReviews = await Document.count({
      where: { status: 'PENDING_REVIEW' }
    });

    // Get compliance stats
    const complianceIssues = await ComplianceCheck.count({
      where: { status: 'FAILED' }
    });

    // Get upcoming deadlines (next 7 days)
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const upcomingDeadlines = await ComplianceCheck.count({
      where: {
        dueDate: {
          [Op.lt]: oneWeekFromNow,
          [Op.gt]: new Date()
        },
        status: {
          [Op.notIn]: ['COMPLETED', 'PASSED']
        }
      }
    });

    res.json({
      totalDocuments,
      pendingReviews,
      complianceIssues,
      upcomingDeadlines
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const recentDocuments = await Document.findAll({
      limit: 5,
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'title', 'status', 'updatedAt']
    });

    const recentCompliance = await ComplianceCheck.findAll({
      limit: 5,
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'title', 'status', 'updatedAt']
    });

    // Combine and format activities
    const activities = [
      ...recentDocuments.map(doc => ({
        id: `doc-${doc.id}`,
        type: 'DOCUMENT',
        title: doc.title,
        action: `Document ${doc.status.toLowerCase()}`,
        status: doc.status,
        timestamp: doc.updatedAt
      })),
      ...recentCompliance.map(check => ({
        id: `comp-${check.id}`,
        type: 'COMPLIANCE',
        title: check.title,
        action: `Compliance check ${check.status.toLowerCase()}`,
        status: check.status,
        timestamp: check.updatedAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

module.exports = router;
