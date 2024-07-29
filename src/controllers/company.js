/* eslint-disable prettier/prettier */
const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { companyService, companyUserService } = require('../services');

const getCompanySchema = joi.object({
  companyId: joi.string().trim().required(),
});

const createOrUpdateCompanySchema = joi.object({
  companyId: joi.string().trim().allow(null, '').optional(),
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
  const company = await companyUserService.getCompany({
    userId: req.user.id,
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
  const company = await companyUserService.getCompanyFromUserID({
    userId: req.user.id,
  });
  return company || {};
}

async function getAllCompaniesFromUserID(req) {
  const company = await companyUserService.getAllCompaniesFromUserID({
    userId: req.user.id,
  });
  return company || [];
}

function createOrUpdateCompany(req) {
  const { value: validRequestData, error: invalidRequest } =
    createOrUpdateCompanySchema.validate({
      companyId: req.body.companyId,
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0002',
      invalidRequest.message
    );
  }
  return companyService.createCompany(req.user, validRequestData);
}

module.exports = {
  getCompany,
  createOrUpdateCompany,
  getCompanyByUserId,
  getAllCompaniesFromUserID,
};
