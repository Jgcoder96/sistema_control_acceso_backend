import { envs } from '../../../config/envs.config.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import type { RequestFile } from '../../shared/types/RequestFile.type.js';

const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

if (envs.AWS_ACCESS_KEY_ID && envs.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: envs.AWS_ACCESS_KEY_ID,
    secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
  };
}

const s3Client = new S3Client(s3Config);
const BUCKET_NAME = envs.S3_BUCKET_NAME;

export const uploadFile = async (file: RequestFile): Promise<string> => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `fotos/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);

  await s3Client.send(command);

  return uploadParams.Key;
};

export const getFileUrl = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return url;
};
