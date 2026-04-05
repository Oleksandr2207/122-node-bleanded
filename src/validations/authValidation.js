import { Segments, Joi } from 'celebrate';

export const createUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};
