import { Segments, Joi } from 'celebrate';

export const createUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().trim(),
    password: Joi.string().required(),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};
