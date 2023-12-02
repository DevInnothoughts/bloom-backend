const { customAlphabet } = require('nanoid');

const { Form } = require('../models');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQQRSTUVWXYZ01234567889');

async function initForm(payload = {}) {
  const formId = nanoid(8);
  const newForm = {
    formId,
  };
  if (payload.companyId) {
    newForm.companyId = payload.companyId;
  }
  await Form.create(newForm);
  return newForm;
}

async function updateForm(payload = {}) {
  const updates = {};
  // if (payload.businessMetaData) {
  //   updates.businessMetaData = JSON.stringify(payload.businessMetaData);
  // }
  if (payload.formName) {
    updates.formName = payload.formName;
  }
  if (payload.googlePlaceId) {
    updates.googlePlaceId = payload.googlePlaceId;
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
  if (payload.companyId) {
    updates.companyId = payload.companyId;
  }
  if (Object.keys(updates).length > 0) {
    await Form.update(updates, {
      where: { formId: payload.formId },
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
  if (form.formContent) {
    form.formContent = JSON.parse(form.formContent.toString());
  }
  if (form.formTheme) {
    form.formTheme = JSON.parse(form.formTheme.toString());
  }
  return form;
}

module.exports = {
  initForm,
  updateForm,
  getForm,
};
