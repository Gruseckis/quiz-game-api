import {
  userSchema,
  UserModel,
  save,
  getUserByUsername,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  comparePassword,
} from '../../models/UserModel';

describe('UserModel', async () => {
  it('userSchema correct', async () => {
    expect(userSchema.options.timestamps).to.be.equal(true);
    expect(userSchema.obj).to.have.keys({
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
        default: 'user',
      },
    });
  });
  it('save works', async () => {
    const saveModel = sinon.stub().resolves();
    UserModel.prototype.save = saveModel;
    const user = {
      username: 'username',
      email: 'email',
      hashedPassword: 'password',
      name: 'name',
      surname: 'surname',
      dateOfBirth: 'DOB',
    };
    await save(user);
    expect(saveModel).to.be.calledOnce;
  });
  it('getUserByUsername works', async () => {
    const username = 'username';
    const findModel = sinon.stub().resolves();
    UserModel.findOne = findModel;
    await getUserByUsername(username);
    expect(findModel).to.be.calledOnce;
    expect(findModel).to.be.calledWith({ username });
  });
  it('getUserById works', async () => {
    const id = 'id';
    const findById = sinon.stub().resolves();
    UserModel.findById = findById;
    await getUserById(id);
    expect(findById).to.be.calledOnce;
    expect(findById).to.be.calledWith(id);
  });
  it('getUsers works', async () => {
    const findUsers = sinon.stub().resolves();
    UserModel.find = findUsers;
    await getUsers();
    expect(findUsers).to.be.calledOnce;
  });
  it('updateUser works', async () => {
    const id = 'id';
    const model = {};
    const update = sinon.stub().resolves();
    UserModel.findByIdAndUpdate = update;
    await updateUser(id, model);
    expect(update).to.be.calledOnce;
    expect(update).to.be.calledWith(id, model, { new: true });
  });
  it('deleteUser works', async () => {
    const id = 'id';
    const deleteUserById = sinon.stub().resolves();
    UserModel.findByIdAndRemove = deleteUserById;
    await deleteUser(id);
    expect(deleteUserById).to.be.calledOnce;
    expect(deleteUserById).to.be.calledWith(id);
  });
  it('comparePassword works', async () => {
    const equalPassword = {
      userPassword: '12345',
      hashedPassword: '$2b$10$AtsMBBzXcWcyI6NzLW3Eb.FTwu0xNbwVskgTBucKvudtvpB1FHasq',
    };
    const notEqualPassword = {
      userPassword: '12345',
      hashedPassword: '123456',
    };
    const confirmResult = await comparePassword(equalPassword);
    const notConfirmedResult = await comparePassword(notEqualPassword);
    expect(confirmResult).to.be.equal(true);
    expect(notConfirmedResult).to.be.equal(false);
  });
});
