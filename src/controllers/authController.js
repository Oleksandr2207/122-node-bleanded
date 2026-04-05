import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { createCookies, createSession } from '../services/auth.js';

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
