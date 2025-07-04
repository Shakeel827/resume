// Express.js handler for /api/import-resume
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer();

router.post('/import-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Only PDF parsing for now
    const data = await pdfParse(req.file.buffer);
    // TODO: Advanced parsing to extract fields
    res.json({
      personalInfo: { name: '', email: '', phone: '', location: '', summary: data.text.slice(0, 200) },
      experience: [], education: [], skills: [], projects: []
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to parse resume' });
  }
});

module.exports = router;
