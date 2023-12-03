const { v4: uuidv4 } = require('uuid');
const { FormResponse, GeneratedReview } = require('../models');
const { applicationLogger: log } = require('../../lib/logger');
const formService = require('./form');
const companyService = require('./company');
const openaiClient = require('../../integrations/openai');
const config = require('../../lib/config');

async function saveFormResponse(payload = {}) {
  const newForm = {
    responseId: uuidv4(),
    formId: payload.formId,
    companyId: payload.companyId,
    review: JSON.stringify(payload.responses),
  };
  await FormResponse.create(newForm);
  return newForm.responseId;
}

function getFormResponse({ responseId }) {
  return FormResponse.findOne({
    where: { responseId },
    raw: true,
  });
}

function convertUserReviewToPrompt(reviewBuffer) {
  if (!reviewBuffer) {
    throw new Error('User review not present');
  }
  const review = JSON.parse(reviewBuffer.toString());
  // questionId: joi.string().trim(),
  // questionTitle: joi.string().trim(),
  // questionSubtitle: joi.string().trim(),
  // questionType: joi.string().trim(),
  // responses: joi.array().items(joi.string()),
  // rating: joi.string(),
  // isUserText: joi.boolean().default(false),
  const keys = Object.keys(review);
  let userResponse = '';
  for (const key of keys) {
    const r = review[key];
    if (key === 'queryParams') {
      /* eslint-disable no-continue */
      continue;
    }
    if ((!r.responses || r.responses.length === 0) && !r.rating) {
      /* eslint-disable no-continue */
      continue;
    }
    if (r.isUserText) {
      userResponse += 'Important Question: ';
    } else {
      userResponse += 'Question: ';
    }
    userResponse += r.questionTitle;
    userResponse += '\n';
    userResponse += 'Answer: ';
    if (r.rating) {
      userResponse += r.rating;
      userResponse += ' (1 being the lowest and 5 being the highest.) ';
    } else {
      const answers = r.responses.join(', ');
      userResponse += answers;
    }
    userResponse += '\n';
  }
  const promptPrefix = config.openai.userPromptPrefex;
  const prompt = `${promptPrefix}<Response>\n${userResponse}</Response>\n`;
  return prompt;
}

function getSystemPrompt(company = {}, form = {}) {
  let prompt = `You are a creative writer tasked with crafting unique and varied Google reviews for a business called ${company.companyName}. The company is running a survey.\n`;
  prompt += `About the survey: "${form.aboutForm}\n"`;
  return prompt;
}

async function saveGeneratedReview(responseId) {
  try {
    const formResponse = await getFormResponse({ responseId });
    if (!formResponse) {
      throw new Error(`Invalid responseId: ${responseId}`);
    }
    const { formId } = formResponse;
    const form = await formService.getForm({ formId });
    if (!form) {
      throw new Error(`Invalid formId: ${formId}`);
    }
    const { companyId } = form;
    const company = await companyService.getCompany({ companyId });
    if (!company) {
      throw new Error(`Invalid company: ${companyId}`);
    }
    const userPrompt = convertUserReviewToPrompt(formResponse.review);
    const systemPrompt = getSystemPrompt(company, form);
    const prompts = [
      { role: 'user', content: userPrompt },
      { role: 'system', content: systemPrompt },
    ];
    log.info(userPrompt);
    log.info(systemPrompt);
    const resp = await openaiClient.getChatCompletions(
      config.openai.defaultModel,
      prompts
    );
    log.info(resp);
    // {"id":"chatcmpl-8R2gwO6qBEhN7wAxsjMUtqmVPKqge","object":"chat.completion","created":1701455894,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"message":{"role":"assistant","content":"Important Question: How did you like the service?\nAnswer: The service was exceptional. The staff was attentive and friendly.\n\nQuestion: How much rating would you like to give?\nAnswer: I would give a rating of 4.5 out of 5. The experience was great overall, with just a few minor areas for improvement."},"finish_reason":"stop"}],"usage":{"prompt_tokens":75,"completion_tokens":67,"total_tokens":142},"system_fingerprint":null}
    const newGeneratedReview = {
      responseId,
      status: 'SUCCESS',
      inputModel: config.openai.defaultModel,
      inputMessages: JSON.stringify(prompts),
      vendorId: resp.id,
      vendorCreatedAt: resp.created,
      vendorModel: resp.model,
      vendorResponse: JSON.stringify(resp.choices),
      vendorUsage: JSON.stringify(resp.usage),
    };
    await GeneratedReview.create(newGeneratedReview);
    log.info(`Review generated: ${responseId}`);
  } catch (err) {
    log.error(err);
  }
}

async function getGeneratedReview({ responseId }) {
  const review = await GeneratedReview.findOne({
    where: { responseId },
    raw: true,
  });
  if (review) {
    if (review.inputMessages) {
      review.inputMessages = JSON.parse(review.inputMessages.toString());
    }
    if (review.vendorResponse) {
      review.vendorResponse = JSON.parse(review.vendorResponse.toString());
    }
    if (review.vendorUsage) {
      review.vendorUsage = JSON.parse(review.vendorUsage.toString());
    }
    delete review.id;
  }
  return review;
}

module.exports = {
  saveFormResponse,
  saveGeneratedReview,
  getGeneratedReview,
};
