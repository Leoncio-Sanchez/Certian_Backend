import multer from 'multer';

// Memory storage — files go to Cloudflare R2 via StorageService
const storage = multer.memoryStorage();

// Images/PDFs only, 10MB — used for challenge images and documents
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

// Any file type — used for student evidence submissions
const evidenceFilter = (req: any, file: any, cb: any) => {
  // Accept all file types: images, videos, PDFs, docs, spreadsheets, archives, etc.
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

export const uploadEvidence = multer({
  storage,
  limits: { fileSize: 400 * 1024 * 1024 }, // 400MB
  fileFilter: evidenceFilter,
});
