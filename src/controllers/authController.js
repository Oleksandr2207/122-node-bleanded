import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { createCookies, createSession } from '../services/auth.js';
import { Session } from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashedPassword });

  const session = await createSession(newUser._id);
  createCookies(res, session);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401);
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  createCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  console.log('test', session);

  if (!session) {
    throw createHttpError(401, 'no session');
  }

  const isExpiredRefreshToken =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isExpiredRefreshToken) {
    throw createHttpError(401, 'no token');
  }

  await Session.deleteOne({ sessionId });

  const newSession = await createSession(session.userId);
  createCookies(res, newSession);

  res.status(200).json({ message: 'Successfully refreshed a session!' });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '20m' },
  );
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Failed to send the email');
  }
  res.status(200).json({ message: 'Password reset email sent successfully' });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    throw createHttpError(401, 'Invalid or expired token');
  }

  const { sub, email } = payload;

  const user = await User.findOne({ _id: sub, email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { _id: sub, email },
    { password: hashedPassword },
  );

  res.status(200).json({ message: 'Password reset successfully' });
};
