import { CookieOptions } from 'express';

export const maxAgeRefreshSec = 2592000;
export const maxAgeAccessSec = 1800;

export const REQ_RES_COOKIE = {
  REFRESH: 'refresh-token',
  ACCESS: 'access-token',
};

export const REFRESH_TOKEN_OPTIONS: CookieOptions = {
  path: '/api/auth',
  httpOnly: true,
};

export const ACCESS_TOKEN_OPTIONS: CookieOptions = {
  path: '/',
  httpOnly: true,
};
