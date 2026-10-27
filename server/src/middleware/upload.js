import multer from 'multer';

// In-memory storage for safe inspection and text extraction
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    if (allowedMimeTypes.includes(file.mimetype) || ['pdf', 'docx'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF (.pdf) and Word (.docx) documents are permitted.'));
    }
  }
});
