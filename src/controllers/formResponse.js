const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { formResponseService, formService } = require('../services');

const saveResponseSchema = joi.object({
  responses: joi
    .object()
    .pattern(
      joi.string(),
      joi
        .object({
          questionId: joi.number(),
          questionTitle: joi.string().trim(),
          questionSubtitle: joi.string().trim(),
          questionType: joi.string().trim(),
          responses: joi
            .array()
            .items(joi.string().allow(null, ''))
            .allow(null),
          rating: joi.number(),
          isUserText: joi.boolean().default(false),
          excludeFromPrompt: joi.boolean().allow(null),
          inputType: joi.string().trim().allow('', null),
        })
        .optional()
        .allow(null)
    )
    .required(),
  companyId: joi.string().trim().required(),
  formId: joi.string().trim().required(),
  queryParams: joi.object().optional().allow(null),
  generateReview: joi.boolean().default(false),
});

const getGeneratedReviewSchema = joi.object({
  responseId: joi.string().trim().required(),
});

const getAllFormResponsesSchema = joi.object({
  formId: joi.string().trim().required(),
  pageNo: joi.number(),
  pageSize: joi.number(),
});

async function saveResponse(req) {
  const { value: validRequestData, error: invalidRequest } =
    saveResponseSchema.validate({
      responses: req.body.responses,
      companyId: req.body.companyId,
      queryParams: req.body.queryParams,
      formId: req.body.formId,
      generateReview: req.body.generateReview,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_007',
      `Validation error: ${invalidRequest.message}`
    );
  }
  const responseId =
    await formResponseService.saveFormResponse(validRequestData);

  if (validRequestData.generateReview)
    formResponseService.saveGeneratedReview({
      responseId,
      formId: validRequestData.formId,
      review: validRequestData.responses,
    });
  return responseId;
}

async function getGeneratedReview(req) {
  const { value: validRequestData, error: invalidRequest } =
    getGeneratedReviewSchema.validate({
      responseId: req.query.responseId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_007',
      `Validation error: ${invalidRequest.message}`
    );
  }
  const genResp =
    await formResponseService.getGeneratedReview(validRequestData);

  if (genResp && genResp.vendorResponse && genResp.vendorResponse.length > 0) {
    return {
      review: genResp.vendorResponse[0].message.content,
    };
  }
  return {};
}

async function getAllFormResponses(req) {
  const { value: validRequestData, error: invalidRequest } =
    getAllFormResponsesSchema.validate({
      formId: req.query.formId,
      pageNo: req.query.pageNo,
      pageSize: req.query.pageSize,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_007',
      `Validation error: ${invalidRequest.message}`
    );
  }
  const form = await formService.getForm({ formId: validRequestData.formId });
  if (!form) {
    return {
      responses: [],
      totalCount: 0,
      totalPages: 0,
      mapping: {},
    };
  }
  if (form.userId !== req.user.id) {
    throw new generalExceptions.PermissionDenied(
      'Form not avaiable for logged in user'
    );
  }
  const responses =
    await formResponseService.getAllFormResponses(validRequestData);

  return responses;
}

module.exports = {
  getGeneratedReview,
  saveResponse,
  getAllFormResponses,
};
