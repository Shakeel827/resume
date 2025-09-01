import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import pdf from 'pdf-parse';

// Extract text safely from PDF buffer
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data?.text?.trim() || '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder
const uploadDir = path.join(__dirname, 'uploads');
await fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PDF parsing endpoint
app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
  let filePath = '';
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    filePath = req.file.path;
    console.log('Processing file:', filePath);

    const fileBuffer = await fs.readFile(filePath);
    const text = await extractTextFromPDF(fileBuffer);

    if (!text) throw new Error('No text could be extracted from the PDF');

    res.json({
      success: true,
      text,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

  } catch (error) {
    console.error('Error in /api/parse-pdf:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    // Cleanup uploaded file
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log('Cleaned up file:', filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`PDF parser backend running at http://localhost:${port}`);
});
