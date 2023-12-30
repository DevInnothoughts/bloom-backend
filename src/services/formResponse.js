const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { FormResponse, Form, GeneratedReview } = require('../models');
const { applicationLogger: log } = require('../../lib/logger');
const companyService = require('./company');
const openaiClient = require('../../integrations/openai');
const config = require('../../lib/config');

function camelCaseToWords(s) {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

async function getForm({ formId }) {
  const form = await Form.findOne({
    where: { formId },
    raw: true,
  });
  if (!form) {
    return form;
  }

  delete form.id;

  if (form.formContent) {
    form.formContent = JSON.parse(form.formContent.toString());
  }
  if (form.formTheme) {
    form.formTheme = JSON.parse(form.formTheme.toString());
  }
  return form;
}

async function saveFormResponse(payload = {}) {
  const newForm = {
    responseId: uuidv4(),
    formId: payload.formId,
    companyId: payload.companyId,
    review: JSON.stringify(payload.responses),
    queryParams: payload.queryParams ? JSON.stringify(payload.queryParams) : {},
    generateReview: payload.generateReview,
  };
  await FormResponse.create(newForm);
  return newForm.responseId; // TODO: Can return newForm to save 1 find query
}

// function getFormResponse({ responseId }) {
//   return FormResponse.findOne({
//     where: { responseId },
//     raw: true,
//   });
// }

// latest = sort by created at, sort order DESC
// filters generated_review = true, response_id <> latest saved response_id
async function getPastGeneratedReviews({ limit, responseIdNe, formId }) {
  const formResponses = await FormResponse.findAll({
    raw: true,
    where: {
      responseId: { [Op.ne]: responseIdNe },
      generateReview: true,
      formId,
    },
    order: [['created_at', 'DESC']],
    limit,
  });
  const latestGeneratedReviews = [];
  for (const resp of formResponses) {
    // eslint-disable-next-line no-await-in-loop
    const generatedReview = await GeneratedReview.findOne({
      raw: true,
      where: {
        responseId: resp.responseId,
      },
    });
    if (generatedReview && generatedReview.vendorResponse) {
      const vendorResp = JSON.parse(generatedReview.vendorResponse.toString());
      if (vendorResp.length > 0) {
        latestGeneratedReviews.push(vendorResp[0].message.content);
      }
    }
  }
  return latestGeneratedReviews;
}

function getFormResponseCount({ formId }) {
  return FormResponse.count({
    where: { formId },
  });
}

async function getAllFormResponses({ formId, pageSize, pageNo }) {
  const { count, rows } = await FormResponse.findAndCountAll({
    where: { formId },
    offset: pageSize * pageNo,
    limit: pageSize,
    order: [['id', 'DESC']],
    raw: true,
  });

  const responses = [];
  const mapping = new Map();

  for (const row of rows) {
    const response = {};
    let questionMap = {};

    delete row.id;
    row.review = JSON.parse(row.review.toString());

    response.responseId = row.responseId;
    response.createdAt = row.createdAt;
    response.generateReview = row.generateReview;

    const questions = Object.keys(row.review);

    for (const questionId of questions) {
      const question = row.review[questionId];

      // eslint-disable-next-line no-continue
      if (!question) continue;

      questionMap = {
        title: question.questionTitle,
        type: question.questionType,
      };

      if (question.responses) {
        question.responses = question.responses.join(', ');
      }

      const answer =
        question.questionType === 'rating'
          ? question.rating
          : question.responses;

      response[questionId] = answer;

      mapping.set(questionId, questionMap);
    }

    if (row.queryParams) {
      row.queryParams = JSON.parse(row.queryParams.toString());

      for (const param of Object.keys(row.queryParams)) {
        response[param] = row.queryParams[param];

        mapping.set(param, {
          title: camelCaseToWords(param),
          type: 'queryParam',
        });
      }
    }

    responses.push(response);
  }
  mapping.set('createdAt', {
    title: 'Created At',
    type: 'metaData',
  });
  mapping.set('generatedReview', {
    title: 'Generated Review',
    type: 'metaData',
  });
  const formResponses = {
    responses,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
    mapping: Object.fromEntries(mapping),
  };

  return formResponses;
}

function convertUserReviewToPrompt(review, pastReviews = []) {
  // if (!reviewBuffer) {
  //   throw new Error('User review not present');
  // }
  // const review = JSON.parse(reviewBuffer.toString());
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
    if (!r) {
      /* eslint-disable no-continue */
      continue;
    }
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
  const promptPrefix = config.openai.userPromptPrefix;
  let prompt = promptPrefix;
  prompt += `\n- Keep the tone of the review to be ${
    config.openai.availableTones[
      Math.floor(Math.random() * config.openai.availableTones.length)
    ]
  }`;
  if (pastReviews.length > 0) {
    prompt += `\n- Do NOT use the same adjectives & ensure the final review sounds different from the following ${pastReviews.length} user reviews delimited in <Review> tag:`;
    prompt += '\n<Review>';
    prompt += pastReviews.join('</Review>\n\n<Review>');
    prompt += '\n</Review>';
  }
  prompt += `\n- Find the user response delimited in the <Response> tag below\n<Response>\n${userResponse}</Response>`;
  return prompt;
}

function getSystemPrompt(company = {}, form = {}) {
  let prompt = `You are an Indian Local Guide on Google who writes trustworthy & detailed reviews for local businesses. You're writing a review on behalf of a customer based on their responses to a survey conducted by the business called ${company.companyName}. Be as clear, concise and articulate as possible while using only simple English language to keep the review easy to read.\n`;
  prompt += `About the company: "${form.aboutForm}\n"`;
  return prompt;
}

async function saveGeneratedReview({ responseId, formId, review }) {
  try {
    // const formResponse = await getFormResponse({ responseId });
    // if (!formResponse) {
    //   throw new Error(`Invalid responseId: ${responseId}`);
    // }
    // const { formId } = formResponse;
    const form = await getForm({ formId });
    if (!form) {
      throw new Error(`Invalid formId: ${formId}`);
    }
    const { companyId } = form;
    const company = await companyService.getCompany({ companyId });
    if (!company) {
      throw new Error(`Invalid company: ${companyId}`);
    }
    const pastGeneratedReviews = await getPastGeneratedReviews({
      limit: 3,
      responseIdNe: responseId,
      formId,
    });
    log.info(pastGeneratedReviews);
    const userPrompt = convertUserReviewToPrompt(review, pastGeneratedReviews);
    const systemPrompt = getSystemPrompt(company, form);
    const prompts = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
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
  getAllFormResponses,
  getFormResponseCount,
};
