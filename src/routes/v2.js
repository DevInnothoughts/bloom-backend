const express = require('express');
const {
  userController,
  formController,
  leadController,
  companyController,
  formResponseController,
} = require('../controllers');
const {
  verifyUserToken,
  verifyWebServerToken,
} = require('../controllers/middlewares');
const { expressRoute } = require('../../lib/utils');

const userRouter = express.Router();
userRouter.get(
  '/v1/get',
  expressRoute(verifyWebServerToken),
  expressRoute(userController.getUser)
);
userRouter.post(
  '/v1/create',
  expressRoute(verifyWebServerToken),
  expressRoute(userController.createOrUpdateUser)
);
const r = express.Router();
r.use('/api/user', userRouter);

const formRouter = express.Router();
formRouter.post(
  '/v1/init',
  expressRoute(verifyUserToken),
  expressRoute(formController.initForm)
);
formRouter.post(
  '/v1/update',
  expressRoute(verifyUserToken),
  expressRoute(formController.updateForm)
);
formRouter.get('/v1/get', expressRoute(formController.getForm));
formRouter.get(
  '/v1/getAll',
  expressRoute(verifyUserToken),
  expressRoute(formController.getForms)
);
r.use('/api/form', formRouter);

const leadRouter = express.Router();
leadRouter.post('/v1/create', expressRoute(leadController.createLead));
leadRouter.post('/v1/update', expressRoute(leadController.updateLead));
r.use('/api/lead', leadRouter);

const companyRouter = express.Router();
companyRouter.get(
  '/v1/get',
  expressRoute(verifyUserToken),
  expressRoute(companyController.getCompany)
);
companyRouter.get(
  '/v1/getByUserId',
  expressRoute(verifyUserToken),
  expressRoute(companyController.getCompanyByUserId)
);
companyRouter.post(
  '/v1/create',
  expressRoute(verifyUserToken),
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
formResponseRouter.get(
  '/v1/getAll',
  expressRoute(verifyUserToken),
  expressRoute(formResponseController.getAllFormResponses)
);
r.use('/api/formResponse', formResponseRouter);

module.exports = r;
