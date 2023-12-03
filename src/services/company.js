const { v4: uuidv4 } = require('uuid');
const { Company, CompanyUser } = require('../models');

async function getCompany({ companyId }) {
  const company = await Company.findOne({
    where: { companyId },
    raw: true,
  });

  if (company) {
    delete company.id;

    if (company.companyLogo) {
      company.companyLogo = JSON.parse(company.companyLogo.toString());
    }
  }

  return company;
}

async function createCompany(user, payload) {
  const newCompany = {
    companyId: payload.companyId || uuidv4(),
    companyName: payload.companyName,
  };

  if (payload.companyLogo) {
    newCompany.companyLogo = JSON.stringify(payload.companyLogo);
  }

  const newCompanyUser = {
    companyId: newCompany.companyId,
    userId: user.id,
    isAdmin: true,
    status: 'APPROVED',
  };

  await Company.upsert(newCompany, {
    conflictFields: ['companyId'],
  });

  await CompanyUser.upsert(newCompanyUser, {
    conflictFields: ['companyId', 'userId'],
  });

  if (newCompany.companyLogo)
    newCompany.companyLogo = JSON.parse(newCompany.companyLogo);

  return newCompany;
}

// async function updateCompany(payload) {
//   const updatedCompany = {};

//   if (payload.companyName) {
//     updatedCompany.companyName = payload.companyName;
//   }

//   if (payload.companyLogo) {
//     updatedCompany.companyLogo = JSON.stringify(payload.companyLogo);
//   }

//   if (Object.keys(updatedCompany).length > 0) {
//     await Company.update(updatedCompany, {
//       where: { companyId: payload.companyId },
//     });
//   }
// }

module.exports = {
  getCompany,
  createCompany,
  // updateCompany,
};
