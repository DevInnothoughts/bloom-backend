const { Lead } = require('../models');

// async function getLead({ mobileNumber }) {
//   const lead = await Lead.findOne({
//     where: { mobileNumber },
//   });
//   return lead;
// }

async function createOrUpdateLead(payload) {
  const newLead = {
    mobileNumber: payload.mobileNumber,
  };

  if (payload.userName) {
    newLead.userName = payload.userName;
  }
  if (payload.emailId) {
    newLead.emailId = payload.emailId;
  }
  if (payload.businessName) {
    newLead.businessName = payload.businessName;
  }
  if (payload.businessPlaceId) {
    newLead.businessPlaceId = payload.businessPlaceId;
  }
  if (payload.businessAddress) {
    newLead.businessAddress = payload.businessAddress;
  }

  await Lead.upsert(newLead, {
    conflictFields: ['mobileNumber'],
  });

  return newLead;
}

module.exports = {
  createOrUpdateLead,
};
