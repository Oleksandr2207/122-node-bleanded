import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { createCookies, createSession } from '../services/auth.js';
import { Session } from '../db/models/Session.js';

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
