import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

export default async function getGoogleCredentials() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_BASE64 is not set');
  }

  const credentialsBuffer = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64');
  const credentialsJson = credentialsBuffer.toString('utf-8');
  
  const tempFilePath = join(os.tmpdir(), 'google-credentials.json');
  await writeFile(tempFilePath, credentialsJson);
  
  return tempFilePath;
}