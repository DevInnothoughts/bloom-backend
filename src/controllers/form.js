const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { formService, companyService } = require('../services');

const initFormSchema = joi.object({
  companyId: joi.string().trim().required(),
});

const updateFormSchema = joi.object({
  formId: joi.string().trim().required(),
  companyId: joi.string().trim().required(),
  formName: joi.string().trim().optional().allow('', null),
  googlePlaceId: joi.string().trim().optional().allow('', null),
  googleBusinessName: joi.string().trim().optional().allow('', null),
  aboutForm: joi.string().optional().allow('', null),
  formContent: joi.object().optional().allow(null),
  formTheme: joi.object().optional().allow(null),
});

const getFormSchema = joi.object({
  formId: joi.string().trim().required(),
});

const duplicateFormSchema = joi.object({
  formId: joi.string().trim().required(),
});

const deleteFormSchema = joi.object({
  formId: joi.string().trim().required(),
});

const getFormsSchema = joi.object({
  companyId: joi.string().trim().required(),
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
  const newForm = await formService.initForm(req.user, validRequestData);
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
  await formService.updateForm(req.user, validRequestData);
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
    ...form,
    companyDetails: {
      companyName: company.companyName,
      logoScalingFactor: company.companyLogo.logoScalingFactor,
      imageUrl: company.companyLogo.imageUrl,
      imageHeight: company.companyLogo.imageHeight,
      imageWidth: company.companyLogo.imageWidth,
    },
  };
}

async function getForms(req) {
  const { value: validRequestData, error: invalidRequest } =
    getFormsSchema.validate({
      companyId: req.query.companyId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0005',
      invalidRequest.message
    );
  }
  return formService.getForms(req.user, validRequestData);
}

async function duplicateForm(req) {
  const { value: validRequestData, error: invalidRequest } =
    duplicateFormSchema.validate(req.body, { stripUnknown: true });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0020',
      invalidRequest.message
    );
  }

  const newForm = await formService.duplicateForm({
    formId: validRequestData.formId,
  });
  return newForm.formId;
}

async function deleteForm(req) {
  const { value: validRequestData, error: invalidRequest } =
    deleteFormSchema.validate(req.body, { stripUnknown: true });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_0021',
      invalidRequest.message
    );
  }
  await formService.updateForm(req.user, {
    active: false,
    formId: validRequestData.formId,
  });
}

module.exports = {
  initForm,
  updateForm,
  getForm,
  getForms,
  duplicateForm,
  deleteForm,
};
