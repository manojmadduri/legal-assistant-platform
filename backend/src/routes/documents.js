const express = require('express');
const router = express.Router();
const { Document, ComplianceCheck, User } = require('../models');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fsSync.existsSync(uploadDir)) {
      fsSync.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all documents for a user
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate a contract using AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { type, parameters } = req.body;

    const prompt = `Generate a legal ${type} contract with the following parameters: ${JSON.stringify(parameters)}. 
                   The contract should be professional, comprehensive, and legally sound.`;

    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a legal expert specialized in contract drafting." },
        { role: "user", content: prompt }
      ]
    });

    const generatedContent = completion.choices[0].message.content;

    const document = await Document.create({
      userId: req.user.id,
      title: `${type} Contract`,
      type: 'CONTRACT',
      content: generatedContent,
      status: 'DRAFT'
    });

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function performComplianceChecks(document, userId) {
  // Create compliance checks based on document type
  const checks = [];
  
  switch(document.type) {
    case 'CONTRACT':
      checks.push(
        { type: 'LEGAL_TERMS', details: { description: 'Check legal terms and conditions' } },
        { type: 'PARTY_VERIFICATION', details: { description: 'Verify all parties involved' } },
        { type: 'JURISDICTION', details: { description: 'Verify jurisdiction and governing law' } }
      );
      break;
    case 'IP_FILING':
      checks.push(
        { type: 'PRIOR_ART', details: { description: 'Check for prior art conflicts' } },
        { type: 'FILING_REQUIREMENTS', details: { description: 'Verify filing requirements' } }
      );
      break;
    case 'COMPLIANCE':
      checks.push(
        { type: 'REGULATORY', details: { description: 'Check regulatory compliance' } },
        { type: 'INDUSTRY_STANDARDS', details: { description: 'Verify industry standards' } }
      );
      break;
    case 'LEGAL_MEMO':
      checks.push(
        { type: 'CITATION_CHECK', details: { description: 'Verify legal citations' } },
        { type: 'PRECEDENT_CHECK', details: { description: 'Check relevant precedents' } }
      );
      break;
  }

  // Create compliance check records
  for (const check of checks) {
    await ComplianceCheck.create({
      userId,
      type: check.type,
      status: 'PENDING',
      details: check.details,
      documentId: document.id
    });
  }
}

// Upload a document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  let uploadedFile = null;
  
  try {
    const { title, type } = req.body;
    const file = req.file;

    // Validate request
    if (!file) {
      throw new Error('No file uploaded');
    }

    if (!title || !type) {
      throw new Error('Title and type are required');
    }

    uploadedFile = file;

    // Create document with default empty content
    const document = await Document.create({
      userId: req.user.id,
      title: title.trim(),
      type,
      content: '',
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      status: 'PENDING_REVIEW'
    });

    // If it's a text file, update the content
    if (file.mimetype === 'text/plain') {
      try {
        const content = await fs.readFile(file.path, 'utf-8');
        await document.update({
          content: content || '' // Ensure content is never null
        });
      } catch (error) {
        console.error('Error reading file content:', error);
      }
    }

    // Perform compliance checks
    await performComplianceChecks(document, req.user.id);

    // Get user details
    const user = await User.findByPk(req.user.id);

    // Send notifications based on user role
    if (user.role === 'CLIENT') {
      // Notify assigned lawyer
      console.log('Notifying lawyer about new document upload');
    } else if (user.role === 'LAWYER') {
      // Notify client about document status
      console.log('Notifying client about document status');
    }

    // Refresh document from database
    const updatedDocument = await Document.findByPk(document.id, {
      include: [{
        model: ComplianceCheck,
        as: 'complianceChecks'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: updatedDocument
    });

  } catch (error) {
    // Clean up uploaded file if there was an error
    if (uploadedFile && uploadedFile.path) {
      try {
        await fs.unlink(uploadedFile.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    console.error('Error uploading document:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error uploading document',
      error: error.errors ? error.errors.map(e => e.message) : undefined
    });
  }
});

// Update document status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const document = await Document.findOne({
      where: { id, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.status = status;
    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
