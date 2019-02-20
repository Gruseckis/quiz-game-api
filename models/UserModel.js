import mongoose from 'mongoose';
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true, required: true },
    email: { type: String, trim: true, required: true },
    hashedPassword: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    surname: { type: String, trim: true, required: true },
    dateOfBirth: { type: Date, trim: true, required: true },
    level: {
      type: String,
      trim: true,
      required: true,
      enum: ['user', 'quizer', 'moderator', 'admin'],
      default: 'user'
    }
  },
  {
    timestamp: true
  }
);

userSchema.pre('save', async function callback(next) {
  const resultArray = await UserModel.find();
  if (resultArray.length === 0) {
    this.level = 'admin';
  }

  if (this.hashedPassword) {
    this.hashedPassword = await bcrypt.hash(
      this.hashedPassword,
      parseInt(process.env.PASSWORD_HASHING_ROUNDS, 10)
    );
  }
  next();
});

const UserModel = mongoose.model('User', userSchema);

const save = async model => new UserModel(model).save();
const getUserByUsername = async username => UserModel.findOne({ username });
const getUsers = async () => UserModel.find();
const updateUser = async (id, model) =>
  UserModel.findByIdAndUpdate(id, model, { new: true });
const deleteUser = async id => UserModel.findByIdAndRemove(id);
const comparePassword = async ({ userPassword, hashedPassword }) =>
  bcrypt.compare(userPassword, hashedPassword);

UserModel.schema
  .path('username')
  .validate(
    async username => !(await getUserByUsername(username)),
    'User already exists!'
  );

export {
  save,
  getUserByUsername,
  comparePassword,
  userSchema,
  getUsers,
  UserModel,
  updateUser,
  deleteUser
};
