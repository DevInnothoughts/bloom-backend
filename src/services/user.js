const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const companyUserService = require('./companyUser');

async function getUser({ emailId }) {
  let user = await User.findOne({
    where: { emailId },
    raw: true,
  });

  let company = {};

  if (user) {
    company = await companyUserService.getCompanyFromUserID({
      userId: user.userId,
    });

    if (company) {
      user = { ...user, company };
    }
  }

  return user;
}

// async function createUser(payload = { companyLogo: {} }) {
async function createUser(payload) {
  const newUser = {
    userId: uuidv4(),
    emailId: payload.emailId,
    name: payload.name,
    avatarUrl: payload.avatarUrl,
  };
  await User.create(newUser);
  return newUser;
}

// /* eslint-disable no-param-reassign */
// async function updateUser(user, payload = { companyLogo: {} }) {
//   if (payload.companyName) {
//     user.companyName = payload.companyName;
//   }
//   if (payload.companyLogo) {
//     user.companyLogo = JSON.stringify(payload.companyLogo);
//   }
//   await user.save();
//   user.companyLogo = JSON.parse(user.companyLogo); // Needed to be done for sending API response
// }

module.exports = {
  getUser,
  createUser,
};
