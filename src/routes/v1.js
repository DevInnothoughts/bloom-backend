const express = require('express');
const { userController } = require('../controllers');
const { expressRoute } = require('../../lib/utils');

const router = express.Router();

router.get('/v1/onboarding', expressRoute(userController.getUser));
router.post('/v1/onboarding', expressRoute(userController.createOrUpdateUser));

const r = express.Router();
r.use('/api/company', router);

module.exports = r;
