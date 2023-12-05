const { customAlphabet } = require('nanoid');

const { Form } = require('../models');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQQRSTUVWXYZ01234567889');

async function initForm(user, payload) {
  const formId = nanoid(8);
  const newForm = {
    formId,
    userId: user.id,
    companyId: payload.companyId,
  };
  await Form.create(newForm);
  return newForm;
}

async function updateForm(user = {}, payload = {}) {
  const updates = {};
  if (payload.formName) {
    updates.formName = payload.formName;
  }
  if (payload.googlePlaceId) {
    updates.googlePlaceId = payload.googlePlaceId;
  }
  if (payload.googleBusinessName) {
    updates.googleBusinessName = payload.googleBusinessName;
  }
  if (payload.aboutForm) {
    updates.aboutForm = payload.aboutForm;
  }
  if (payload.formContent) {
    updates.formContent = JSON.stringify(payload.formContent);
  }
  if (payload.formTheme) {
    updates.formTheme = JSON.stringify(payload.formTheme);
  }
  if (Object.keys(updates).length > 0) {
    await Form.update(updates, {
      where: { formId: payload.formId, userId: user.id },
    });
  }
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

async function getForms(user, { companyId }) {
  const forms = await Form.findAll({
    where: { userId: user.id, companyId },
    raw: true,
  });
  for (const form of forms) {
    if (form.formContent) {
      form.formContent = JSON.parse(form.formContent.toString());
    }
    if (form.formTheme) {
      form.formTheme = JSON.parse(form.formTheme.toString());
    }
  }
  return forms;
}

module.exports = {
  initForm,
  updateForm,
  getForm,
  getForms,
};
