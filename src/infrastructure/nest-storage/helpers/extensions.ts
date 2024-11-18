import { MimeTypes } from '../data/mime-db';

export const getMimeFromExtension = (fileName: string): string => {
  const fileSplit = fileName.split('.');
  const fileExtension = fileSplit[fileSplit.length - 1];

  for (const mimeType in MimeTypes) {
    const meta = MimeTypes[mimeType];
    if (meta.extensions && meta.extensions.includes(fileExtension)) {
      return meta.extensions[0];
    }
  }

  return '';
};

export function getPathStorage(): string {
  if (process.env.DEFAULT_STORAGE === 'local') {
    return 'upload-files/';
  }
  return process.env.S3_STORAGE_BASE_PATH + '/';
}
