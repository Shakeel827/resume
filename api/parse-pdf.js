import { IncomingForm } from 'formidable';
import pdfParse from 'pdf-parse';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();
  
  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    if (!files || !files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file[0];
    const fileBuffer = await fs.readFile(file.filepath);
    const data = await pdfParse(fileBuffer);
    
    return res.status(200).json({ text: data.text });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return res.status(500).json({ error: 'Failed to parse PDF' });
  }
}
