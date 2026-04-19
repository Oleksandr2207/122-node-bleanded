import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
    },

    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
