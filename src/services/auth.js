import { Session } from '../db/models/Session.js';
import crypto from 'crypto';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date() + 60 * 1000,
    refreshTokenValidUntil: new Date() + 24 * 60 * 60 * 1000,
  });
};

export const createCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken);
  res.cookie('refreshToken', session.refreshToken);
  res.cookie('sessionId', session._id);
};
