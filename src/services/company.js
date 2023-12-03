const { v4: uuidv4 } = require('uuid');
const { Company, CompanyUser } = require('../models');

async function getCompany({ companyId }) {
  const company = await Company.findOne({
    where: { companyId },
    raw: true,
  });

  if (company) {
    delete company.id;
  }

  return company;
}

async function createCompany(payload) {
  // eslint-disable-next-line no-console
  console.log(payload);

  const newCompany = {
    companyId: uuidv4(),
    companyName: payload.companyName,
  };

  if (payload.companyLogo) {
    newCompany.companyLogo = JSON.stringify(payload.companyLogo);
  }

  const newCompanyUser = {
    companyId: newCompany.companyId,
    userId: payload.userId, // Ideally this should come from JWT
    isAdmin: true,
    status: 'APPROVED',
  };

  await Company.create(newCompany);
  await CompanyUser.create(newCompanyUser);

  if (newCompany.companyLogo)
    newCompany.companyLogo = JSON.parse(newCompany.companyLogo);

  return newCompany;
}

async function updateCompany(payload) {
  const updatedCompany = {};

  if (payload.companyName) {
    updatedCompany.companyName = payload.companyName;
  }

  if (payload.companyLogo) {
    updatedCompany.companyLogo = JSON.stringify(payload.companyLogo);
  }

  if (Object.keys(updatedCompany).length > 0) {
    await Company.update(updatedCompany, {
      where: { companyId: payload.companyId },
    });
  }
}

module.exports = {
  getCompany,
  createCompany,
  updateCompany,
};
