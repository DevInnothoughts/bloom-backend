const express = require('express');
const {
  userController,
  formController,
  leadController,
} = require('../controllers');
const { expressRoute } = require('../../lib/utils');

const userRouter = express.Router();
userRouter.get('/v1/onboarding', expressRoute(userController.getUser));
userRouter.post(
  '/v1/onboarding',
  expressRoute(userController.createOrUpdateUser)
);
const r = express.Router();
r.use('/api/company', userRouter);

const formRouter = express.Router();
formRouter.post('/v1/init', expressRoute(formController.initForm));
formRouter.post('/v1/update', expressRoute(formController.updateForm));
formRouter.get('/v1/getForm', expressRoute(formController.getForm));
r.use('/api/form', formRouter);

const leadRouter = express.Router();
leadRouter.post('/v1/createLead', expressRoute(leadController.createLead));
leadRouter.post('/v1/updateLead', expressRoute(leadController.updateLead));
r.use('/api/lead', leadRouter);

module.exports = r;
