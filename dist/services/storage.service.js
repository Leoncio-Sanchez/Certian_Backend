"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client_1 = require("../utils/s3Client");
const env_1 = require("../config/env");
const path_1 = __importDefault(require("path"));
class StorageService {
    async uploadFile(file, folder = 'general') {
        const fileExtension = path_1.default.extname(file.originalname);
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: env_1.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        try {
            await s3Client_1.s3Client.send(command);
            // Return the public URL
            return `${env_1.env.R2_PUBLIC_URL}/${fileName}`;
        }
        catch (error) {
            console.error('Error uploading to R2:', error);
            throw new Error('Failed to upload file to storage');
        }
    }
    async deleteFile(fileUrl) {
        // Logic to delete from R2 if needed
        // Extract key from URL
    }
}
exports.StorageService = StorageService;
