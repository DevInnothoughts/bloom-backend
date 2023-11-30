const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const {
  formService,
  companyService,
  formResponseService,
} = require('../services');

const initFormSchema = joi.object({
  companyId: joi.string().trim().optional().allow('', null),
});

const updateFormSchema = joi.object({
  formId: joi.string().trim().required(),
  companyId: joi.string().trim().optional().allow('', null),
  businessMetaData: joi.object().optional().allow(null),
  formName: joi.string().trim().optional().allow('', null),
  googlePageId: joi.string().trim().optional().allow('', null),
  aboutForm: joi.object().optional().allow(null),
  formContent: joi.object().optional().allow(null),
  formTheme: joi.object().optional().allow(null),
});

const getFormSchema = joi.object({
  formId: joi.string().trim().required(),
});

const migrateSchema = joi.object({
  formId: joi.string().trim().required(),
  businessId: joi.string().trim().optional().allow('', null),
});

async function initForm(req) {
  const { value: validRequestData, error: invalidRequest } =
    initFormSchema.validate({
      companyId: req.body.companyId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0003',
      invalidRequest.message
    );
  }
  const newForm = await formService.initForm(validRequestData);
  return newForm.formId;
}

async function updateForm(req) {
  const { value: validRequestData, error: invalidRequest } =
    updateFormSchema.validate(req.body, { stripUnknown: true });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0004',
      invalidRequest.message
    );
  }
  await formService.updateForm(validRequestData);
}

async function getForm(req) {
  const { value: validRequestData, error: invalidRequest } =
    getFormSchema.validate({
      formId: req.query.formId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0005',
      invalidRequest.message
    );
  }
  const form = await formService.getForm(validRequestData);
  if (!form) {
    throw new generalExceptions.ResourceNotFound(
      'BLAPI_0006',
      'Form with given formId not found'
    );
  }
  const { companyId } = form;
  let company = await companyService.getCompany({ companyId });
  if (!company) {
    company = {};
  }
  if (!company.companyLogo) {
    company.companyLogo = {};
  }
  return {
    formId: form.Id,
    formName: form.formName,
    formSettings: form.aboutForm,
    formContent: form.formContent,
    formTheme: form.formTheme,
    companyDetails: {
      companyName: company.companyName,
      logoScalingFactor: company.companyLogo.logoScalingFactor,
      imageUrl: company.companyLogo.imageUrl,
      imageHeight: company.companyLogo.imageHeight,
      imageWidth: company.companyLogo.imageWidth,
    },
  };
}

async function migrateResponse(req) {
  const { value: validRequestData, error: invalidRequest } =
    migrateSchema.validate({
      formId: req.body.formId,
      businessId: req.body.businessId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0005',
      invalidRequest.message
    );
  }
  await formResponseService.migrate(validRequestData);
}

module.exports = {
  initForm,
  updateForm,
  getForm,
  migrateResponse,
};
