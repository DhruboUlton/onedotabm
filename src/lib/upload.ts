import { getUploadSignatureAction } from '@/lib/actions/uploadActions';

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  mime_type: string;
}

/**
 * Uploads a file straight from the browser to Cloudinary. Throws with a
 * message fit for alert() when uploads are not configured or fail.
 */
export async function uploadFile(file: File, folder: string): Promise<UploadedFile> {
  const res = await getUploadSignatureAction(folder);
  if (!res.success || !res.data) throw new Error(res.error || 'Upload failed.');
  const token = res.data;
  if (!token.configured) throw new Error('File uploads are not configured. Paste a URL instead.');

  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', token.apiKey);
  fd.append('timestamp', String(token.timestamp));
  fd.append('signature', token.signature);
  fd.append('folder', token.folder);

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${token.cloudName}/auto/upload`, {
    method: 'POST',
    body: fd,
  });
  const result = await upload.json().catch(() => null);
  if (!result?.secure_url) throw new Error('Upload failed. Try pasting a URL instead.');
  return { name: file.name, url: result.secure_url, size: file.size, mime_type: file.type };
}
