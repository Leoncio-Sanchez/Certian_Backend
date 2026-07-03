"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEvidence = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Memory storage — files go to Cloudflare R2 via StorageService
const storage = multer_1.default.memoryStorage();
// Images/PDFs only, 10MB — used for challenge images and documents
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Only images and PDFs are allowed!'), false);
    }
};
// Any file type — used for student evidence submissions
const evidenceFilter = (req, file, cb) => {
    // Accept all file types: images, videos, PDFs, docs, spreadsheets, archives, etc.
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter,
});
exports.uploadEvidence = (0, multer_1.default)({
    storage,
    limits: { fileSize: 400 * 1024 * 1024 }, // 400MB
    fileFilter: evidenceFilter,
});
