import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../db/models/User.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, '400 No file');
  }

  const avatar = await saveFileToCloudinary(req.file.buffer, req.user._id);

  console.log(avatar);

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: avatar.secure_url },
    { returnDocument: 'after' },
  );

  res.status(200).json({ url: updatedUser.avatar });
};
