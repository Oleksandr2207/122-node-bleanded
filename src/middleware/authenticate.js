import createHttpError from 'http-errors';
import { Session } from '../db/models/Session.js';
import { User } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw createHttpError(401, 'no access token');
  }

  const session = await Session.findOne({ accessToken });

  if (!session) {
    throw createHttpError(401, 'no session');
  }

  const isExpiredAccessToken =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isExpiredAccessToken) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findOne({ _id: session.userId });

  if (!user) {
    throw createHttpError(401, 'no user');
  }

  req.user = user;
  next();
};
