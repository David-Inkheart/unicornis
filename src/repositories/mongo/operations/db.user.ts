import mongoose from 'mongoose';
import { User } from '../../../models/User';
import { UserId } from '../../../types/custom';

export const findUser = (data: mongoose.FilterQuery<any>) => {
  return User.findOne(data);
};

export const findUserbyId = (id: UserId) => {
  return User.findById(id);
};

// create user with an account
export const createUser = (data: mongoose.FilterQuery<any>) => {
  const user = new User(data);
  return user.save();
  // the above code is the same as the one below
  // return User.create(data);
};

export const updateUser = (id: UserId, data: mongoose.UpdateQuery<any>) => {
  return User.findByIdAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    },
  );
};

export const deleteUserById = (id: UserId) => {
  return User.findByIdAndDelete(id);
};
