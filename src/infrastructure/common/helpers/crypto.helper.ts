import * as CryptoJS from 'crypto-js';

export function encode(dataEncod: string) {
  return CryptoJS.AES.encrypt(dataEncod, process.env.KEY_CRYPTO_STMP_PASS || 'default_key').toString();
}

export function decode(encryptedValue: string): string {
  if (!encryptedValue) return '';
  return CryptoJS.AES.decrypt(encryptedValue, process.env.KEY_CRYPTO_STMP_PASS || 'default_key').toString(
    CryptoJS.enc.Utf8,
  );
}
