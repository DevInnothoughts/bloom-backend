const joi = require('joi');
const generalExceptions = require('../../lib/generalExceptions');
const { formResponseService } = require('../services');

const saveResponseSchema = joi.object({
  responses: joi
    .object()
    .pattern(
      joi.string(),
      joi.object({
        questionId: joi.string().trim(),
        questionTitle: joi.string().trim(),
        questionSubtitle: joi.string().trim(),
        questionType: joi.string().trim(),
        responses: joi.array().items(joi.string()),
        rating: joi.string(),
        isUserText: joi.boolean().default(false),
      })
    )
    .required(),
  companyId: joi.string().trim().required(),
  formId: joi.string().trim().required(),
  queryParams: joi.object().optional().allow(null),
});

const getGeneratedReviewSchema = joi.object({
  responseId: joi.string().trim().required(),
});

async function saveResponse(req) {
  const { value: validRequestData, error: invalidRequest } =
    saveResponseSchema.validate({
      responses: req.body.responses,
      companyId: req.body.companyId,
      queryParams: req.body.queryParams,
      formId: req.body.formId,
    });
  if (invalidRequest) {
    throw new generalExceptions.ValidationError(
      'BLAPI_007',
      `Validation error: ${invalidRequest.message}`
    );
  }
  const responseId =
    await formResponseService.saveFormResponse(validRequestData);
  formResponseService.saveGeneratedReview(responseId);
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
  const generatedResponse =
    await formResponseService.getGeneratedReview(validRequestData);

  return generatedResponse || {};
}

module.exports = {
  getGeneratedReview,
  saveResponse,
};
