const { Lead } = require('../models');

async function getLead({ mobileNumber }) {
  const lead = await Lead.findOne({
    where: { mobileNumber },
  });
  return lead;
}

async function createLead(payload) {
  const newLead = {
    mobileNumber: payload.mobileNumber,
  };
  await Lead.create(newLead);
  return newLead;
}

/* eslint-disable no-param-reassign */
async function updateLead(lead, payload) {
  if (payload.userName) {
    lead.userName = payload.userName;
  }
  if (payload.emailId) {
    lead.emailId = payload.emailId;
  }
  if (payload.businessName) {
    lead.businessName = payload.businessName;
  }
  if (payload.businessPlaceId) {
    lead.businessPlaceId = payload.businessPlaceId;
  }
  if (payload.businessAddress) {
    lead.businessAddress = payload.businessAddress;
  }
  await lead.save();
}

module.exports = {
  createLead,
  updateLead,
  getLead,
};
