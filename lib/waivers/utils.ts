import crypto from 'crypto';

export function canonicalizeText(input: string): string {
  return input.replace(/\r\n/g, '\n').trim();
}

export function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}
