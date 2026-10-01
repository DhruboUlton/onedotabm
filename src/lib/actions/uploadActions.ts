'use server';

import crypto from 'crypto';
import { adminAction } from '@/lib/actions/guard';

/**
 * Signs a direct browser-to-Cloudinary upload, so the file never passes
 * through this server. Without the CLOUDINARY_* env vars upload forms fall
 * back to pasting a URL.
 */
export async function getUploadSignatureAction(folder: string) {
  return adminAction(async () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return { configured: false as const };

    const safeFolder = /^[a-z0-9/_-]+$/i.test(folder) ? folder : 'uploads';
    const timestamp = Math.round(Date.now() / 1000);
    const signature = crypto
      .createHash('sha1')
      .update(`folder=${safeFolder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    return { configured: true as const, cloudName, apiKey, signature, timestamp, folder: safeFolder };
  });
}
