const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

async function getUser({ emailId }) {
  const user = await User.findOne({
    where: { emailId },
  });
  if (user && user.companyLogo) {
    user.companyLogo = Buffer.from(user.companyLogo).toJSON();
  }
  return user;
}

async function createUser(payload = { companyLogo: {} }) {
  const newUser = {
    userId: uuidv4(),
    companyId: uuidv4(),
    emailId: payload.emailId,
    companyName: payload.companyName,
    companyLogo: JSON.stringify(payload.companyLogo),
  };
  await User.create(newUser);
  return newUser;
}

/* eslint-disable no-param-reassign */
async function updateUser(user, payload = { companyLogo: {} }) {
  if (payload.companyName) {
    user.companyName = payload.companyName;
  }
  if (payload.companyLogo) {
    user.companyLogo = JSON.stringify(payload.companyLogo);
  }
  await user.save();
  user.companyLogo = JSON.parse(user.companyLogo); // Needed to be done for sending API response
}

module.exports = {
  getUser,
  createUser,
  updateUser,
};
