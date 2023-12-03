const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { companyService, companyUserService } = require('../services');

const getCompanySchema = joi.object({
  companyId: joi.string().trim().required(),
});

const getCompanyByUserIdSchema = joi.object({
  userId: joi.string().trim().required(),
});

const createOrUpdateCompanySchema = joi.object({
  userId: joi.string().trim().required(),
  companyName: joi.string().trim().required(),
  companyLogo: joi
    .object({
      imageUrl: joi.string().trim(),
      imageHeight: joi.number(),
      imageWidth: joi.number(),
      logoScalingFactor: joi.number(),
    })
    .optional()
    .allow(null),
});

async function getCompany(req) {
  const { value: validRequestData, error: invalidRequest } =
    getCompanySchema.validate({
      companyId: req.query.companyId,
    });

  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0010',
      invalidRequest.message
    );
  }
  const company = await companyService.getCompany({
    companyId: validRequestData.companyId,
  });

  if (!company) {
    throw new generalExceptions.ResourceNotFound(
      'BLAPI_0011',
      `No company found for company ID: ${req.query.companyId}`
    );
  }
  return company;
}

async function getCompanyByUserId(req) {
  const { value: validRequestData, error: invalidRequest } =
    getCompanyByUserIdSchema.validate({
      userId: req.query.userId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0012',
      invalidRequest.message
    );
  }
  const company = await companyUserService.getCompanyFromUserID({
    userId: validRequestData.userId,
  });
  return company || {};
}

async function createOrUpdateCompany(req) {
  const { value: validRequestData, error: invalidRequest } =
    createOrUpdateCompanySchema.validate({
      userId: req.body.userId,
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0002',
      invalidRequest.message
    );
  }

  const company = await companyService.createCompany(validRequestData);
  return company;
  // const company = await companyService.getCompany({
  //   companyId: validRequestData.companyId,
  // });

  // if (!company) {
  //   await companyService.createCompany(validRequestData);
  // }
  // if (validRequestData.companyName !== '' || !validRequestData.companyLogo) {
  //   await companyService.updateCompany(company, validRequestData);
  // }
}

module.exports = {
  getCompany,
  getCompanyByUserId,
  createOrUpdateCompany,
};
