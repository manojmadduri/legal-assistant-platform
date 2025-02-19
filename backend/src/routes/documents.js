const express = require('express');
const router = express.Router();
const { Document } = require('../models');
const { auth } = require('../middleware/auth');
const { OpenAI } = require('openai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
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
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

const openai = new OpenAI(process.env.OPENAI_API_KEY);

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

// Upload a document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const document = await Document.create({
      userId: req.user.id,
      title,
      type,
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      status: 'PENDING_REVIEW'
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    
    // Clean up uploaded file if document creation fails
    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to upload document. Please try again.' });
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
