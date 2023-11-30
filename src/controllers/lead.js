const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { leadService } = require('../services');

const createLeadSchema = joi.object({
  mobileNumber: joi.number().required(),
});

const updateLeadSchema = joi.object({
  mobileNumber: joi.number().required(),
  businessName: joi.string().trim().required(),
  businessPlaceId: joi.string().trim().required(),
  businessAddress: joi.string().trim().required(),
  userName: joi.string().trim().required(),
  emailId: joi.string().trim().required(),
});

async function createLead(req) {
  const { value: validRequestData, error: invalidRequest } =
    createLeadSchema.validate({
      mobileNumber: req.body.mobileNumber,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_007',
      `Validation error: ${invalidRequest.message}`
    );
  }
  const lead = await leadService.getLead({
    mobileNumber: validRequestData.mobileNumber,
  });
  
  if (lead) {
    throw new generalExceptions.ValidationError(
      'BLAPI_008',
      `Lead already exists: ${invalidRequest.message}`
    );
  }
  const newLead = await leadService.createLead(validRequestData);
  return newLead.id;
}

async function updateLead(req) {
  const { value: validRequestData, error: invalidRequest } =
    updateLeadSchema.validate({
      mobileNumber: req.body.mobileNumber,
      businessName: req.body.businessName,
      businessPlaceId: req.body.businessPlaceId,
      businessAddress: req.body.businessAddress,
      userName: req.body.userName,
      emailId: req.body.emailId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_008',
      `Validation error: ${invalidRequest.message}`
    );
  }
  const lead = await leadService.getLead({
    mobileNumber: validRequestData.mobileNumber,
  });

  if (!lead) {
    throw new generalExceptions.ResourceNotFound(
      'BLAPI_009',
      'No lead found for given mobile number'
    );
  }

  const updatedLead = await leadService.updateLead(lead, validRequestData);

  return updatedLead;
}

module.exports = {
  createLead,
  updateLead,
};
