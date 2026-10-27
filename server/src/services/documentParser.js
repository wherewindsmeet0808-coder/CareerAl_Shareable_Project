import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

/**
 * Extracts readable plain text safely from an in-memory file buffer (PDF or DOCX).
 * Does not execute code or write untrusted scripts to disk.
 */
export async function extractTextFromDocument(fileBuffer, mimetype, originalname) {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error('Uploaded document is empty');
  }

  const ext = (originalname.split('.').pop() || '').toLowerCase();

  // 1. PDF Parsing
  if (mimetype === 'application/pdf' || ext === 'pdf') {
    try {
      const data = await pdf(fileBuffer);
      const text = (data.text || '').trim();
      if (!text || text.length < 20) {
        throw new Error('PDF appears to be scanned or contains non-extractable text. Please ensure the PDF has selectable text.');
      }
      return text;
    } catch (err) {
      throw new Error(`Failed to extract text from PDF: ${err.message}`);
    }
  }

  // 2. DOCX Parsing
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = (result.value || '').trim();
      if (!text || text.length < 20) {
        throw new Error('DOCX document appears to be empty or contains no readable text.');
      }
      return text;
    } catch (err) {
      throw new Error(`Failed to extract text from DOCX: ${err.message}`);
    }
  }

  throw new Error(`Unsupported document format (.${ext}). Only PDF and DOCX documents are supported.`);
}
