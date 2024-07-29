/* eslint-disable prettier/prettier */
const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { userService } = require('../services');

const getUserSchema = joi.object({
  emailId: joi.string().trim().required(),
});

const getUserDataSchema = joi.object({
  emailId: joi.string().trim().required(),
});

const createOrUpdateUserSchema = joi.object({
  emailId: joi.string().trim().required(),
  name: joi.string().trim().required(),
  avatarUrl: joi.string().trim().optional().allow('', null),
});

// Google Login -> On FE Server -> Email, Name, DPURL
// Using Email, Try to get User from DB in FE Server || To Protect
// If User Not Found, Create User and Create Company Using API, Mark as Admin || To Protect
// If User & Company Found, Create a JWT Token using DB user details
// If User Found, But No Company Associated, Only Create Company

async function getUser(req) {
  const { value: validRequestData, error: invalidRequest } =
    getUserSchema.validate({
      emailId: req.query.emailId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0001',
      invalidRequest.message
    );
  }
  const user = await userService.getUser({
    emailId: validRequestData.emailId,
  });
  return user || {};
}

async function getUserData(req) {
  const { value: validRequestData, error: invalidRequest } =
    getUserDataSchema.validate({
      emailId: req.query.emailId,
    });
  if (invalidRequest) {
    console.log('INVALID REQ:', invalidRequest);
    throw new generalExceptions.ValidationError(
      'BLAPI_0001',
      invalidRequest.message
    );
  }
  const user = await userService.getUserData({
    emailId: validRequestData.emailId,
  });
  return user || {};
}

async function createOrUpdateUser(req) {
  const { value: validRequestData, error: invalidRequest } =
    createOrUpdateUserSchema.validate({
      emailId: req.body.emailId,
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0002',
      invalidRequest.message
    );
  }
  const user = await userService.getUser({
    emailId: validRequestData.emailId,
  });

  if (!user) {
    return userService.createUser(validRequestData);
  }

  return user;
}

module.exports = {
  getUser,
  getUserData,
  createOrUpdateUser,
};
