const express = require('express');
const { userController, formController } = require('../controllers');
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
formRouter.get('/v1/migrate', expressRoute(formController.migrateResponse));
r.use('/api/form', formRouter);

module.exports = r;
