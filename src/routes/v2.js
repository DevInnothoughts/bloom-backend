const express = require('express');
const {
  userController,
  formController,
  leadController,
  companyController,
  formResponseController,
} = require('../controllers');
const { expressRoute } = require('../../lib/utils');

const userRouter = express.Router();
userRouter.get('/v1/get', expressRoute(userController.getUser));
userRouter.post('/v1/create', expressRoute(userController.createOrUpdateUser));
const r = express.Router();
r.use('/api/user', userRouter);

const formRouter = express.Router();
formRouter.post('/v1/init', expressRoute(formController.initForm));
formRouter.post('/v1/update', expressRoute(formController.updateForm));
formRouter.get('/v1/get', expressRoute(formController.getForm));
formRouter.get('/v1/migrate', expressRoute(formController.migrateResponse));
r.use('/api/form', formRouter);

const leadRouter = express.Router();
leadRouter.post('/v1/create', expressRoute(leadController.createLead));
leadRouter.post('/v1/update', expressRoute(leadController.updateLead));
r.use('/api/lead', leadRouter);

const companyRouter = express.Router();
companyRouter.get('/v1/get', expressRoute(companyController.getCompany));
companyRouter.get(
  '/v1/getByUserId',
  expressRoute(companyController.getCompanyByUserId)
);
companyRouter.post(
  '/v1/create',
  expressRoute(companyController.createOrUpdateCompany)
);
r.use('/api/company', companyRouter);

const formResponseRouter = express.Router();
formResponseRouter.post(
  '/v1/create',
  expressRoute(formResponseController.saveResponse)
);
formResponseRouter.get(
  '/v1/review',
  expressRoute(formResponseController.getGeneratedReview)
);
r.use('/api/formResponse', formResponseRouter);

module.exports = r;
