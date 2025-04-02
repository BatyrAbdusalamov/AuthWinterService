import { Parameters } from 'nestjs-fingerprint';

export const FINGERPRINT_PARAMS: Parameters[] = [
  'headers',
  'userAgent',
  'ipAddress',
];
