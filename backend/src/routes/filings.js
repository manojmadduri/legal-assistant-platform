const express = require('express');
const router = express.Router();
const { Filing, Document } = require('../models');
const auth = require('../middleware/auth');
const Joi = require('joi');

// Validation schema
const filingSchema = Joi.object({
  filingType: Joi.string().valid('TRADEMARK', 'PATENT', 'COPYRIGHT', 'BUSINESS_REGISTRATION', 'OTHER').required(),
  jurisdiction: Joi.string().required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().iso().optional(),
  documentId: Joi.string().uuid().optional()
});

// Validation middleware
const validateFiling = (req, res, next) => {
  const { error } = filingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Get all filings for a user
router.get('/', auth, async (req, res) => {
  try {
    const filings = await Filing.findAll({
      where: { userId: req.user.id },
      include: [{ model: Document }],
      order: [['createdAt', 'DESC']]
    });
    res.json(filings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filings' });
  }
});

// Get a specific filing
router.get('/:id', auth, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: Document }]
    });
    
    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }
    
    res.json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filing' });
  }
});

// Create a new filing
router.post('/', auth, validateFiling, async (req, res) => {
  try {
    const filing = await Filing.create({
      ...req.body,
      userId: req.user.id,
      status: 'DRAFT'
    });

    res.status(201).json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create filing' });
  }
});

// Update a filing
router.put('/:id', auth, validateFiling, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }

    await filing.update(req.body);
    res.json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update filing' });
  }
});

// Delete a filing
router.delete('/:id', auth, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }

    await filing.destroy();
    res.json({ message: 'Filing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete filing' });
  }
});

// Submit a filing
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }

    await filing.update({
      status: 'SUBMITTED',
      filingDate: new Date()
    });

    res.json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit filing' });
  }
});

module.exports = router;