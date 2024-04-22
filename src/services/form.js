const { customAlphabet } = require('nanoid');

const { Form } = require('../models');
const formResponseService = require('./formResponse');

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
  if (typeof payload.active === 'boolean') {
    updates.active = payload.active;
  }
  if (Object.keys(updates).length > 0) {
    await Form.update(updates, {
      where: { formId: payload.formId, userId: user.id },
    });
  }
}

async function getForm({ formId }) {
  const form = await Form.findOne({
    where: { formId, active: true },
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
    where: { userId: user.id, companyId, active: true },
    raw: true,
  });
  for (const form of forms) {
    if (form.formContent) {
      form.formContent = JSON.parse(form.formContent.toString());
      // eslint-disable-next-line no-await-in-loop
      form.responseCount = await formResponseService.getFormResponseCount({
        formId: form.formId,
      });
    }
    if (form.formTheme) {
      form.formTheme = JSON.parse(form.formTheme.toString());
    }
  }
  return forms;
}

async function duplicateForm({ formId }) {
  const sourceForm = await getForm({ formId });
  if (!sourceForm) {
    throw new Error(`form not found for duplication: ${formId}`);
  }
  const newFormId = nanoid(8);
  const newForm = {
    ...sourceForm,
    formName: `Copy of ${sourceForm.formName}`,
    formId: newFormId,
    formContent: sourceForm.formContent
      ? JSON.stringify(sourceForm.formContent)
      : null,
    formTheme: sourceForm.formTheme
      ? JSON.stringify(sourceForm.formTheme)
      : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await Form.create(newForm);
  return newForm;
}

module.exports = {
  initForm,
  updateForm,
  getForm,
  getForms,
  duplicateForm,
};
