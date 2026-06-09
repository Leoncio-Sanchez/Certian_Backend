import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../utils/s3Client';
import { env } from '../config/env';
import path from 'path';

export class StorageService {
  public async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = \\/\-\\\;

    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);
      // Return the public URL
      return \\/\\;
    } catch (error) {
      console.error('Error uploading to R2:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  public async deleteFile(fileUrl: string): Promise<void> {
    // Logic to delete from R2 if needed
    // Extract key from URL
  }
}
