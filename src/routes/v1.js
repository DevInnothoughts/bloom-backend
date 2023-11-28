const express = require('express');
const { companyController } = require('../controllers');
const { expressRoute } = require('../../lib/utils');

const router = express.Router();

router.get('/v1/onboarding', expressRoute(companyController.getUser));
router.post(
  '/v1/onboarding',
  expressRoute(companyController.createOrUpdateUser)
);

const r = express.Router();
r.use('/api/company', router);

module.exports = r;
