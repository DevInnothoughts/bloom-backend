const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { companyService } = require('../services');

const getUserSchema = joi.object({
  emailId: joi.string().trim().required(),
});

const createOrUpdateUserSchema = joi.object({
  emailId: joi.string().trim().required(),
  companyName: joi.string().trim().optional().allow('', null),
  companyLogo: joi
    .object({
      imageUrl: joi.string().trim(),
      imageHeight: joi.number(),
      imageWidth: joi.number(),
      logoScalingFactor: joi.number(),
    })
    .optional(),
});

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
  const user = await companyService.getUser({
    emailId: validRequestData.emailId,
  });
  return user || {};
}

async function createOrUpdateUser(req) {
  const { value: validRequestData, error: invalidRequest } =
    createOrUpdateUserSchema.validate({
      emailId: req.body.emailId,
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0002',
      invalidRequest.message
    );
  }
  const user = await companyService.getUser({
    emailId: validRequestData.emailId,
  });
  if (!user) {
    return companyService.createUser(validRequestData);
  }
  if (validRequestData.companyName !== '' || !validRequestData.companyLogo) {
    await companyService.updateUser(user, validRequestData);
  }
  return user;
}

module.exports = {
  getUser,
  createOrUpdateUser,
};
