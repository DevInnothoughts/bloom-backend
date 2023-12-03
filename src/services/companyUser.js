const { Company, CompanyUser } = require('../models');

async function getCompanyFromUserID({ userId }) {
  const companyUser = await CompanyUser.findOne({
    where: { userId },
    raw: true,
  });

  if (companyUser) {
    const company = await Company.findOne({
      where: { companyId: companyUser.companyId },
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
}

async function getCompany({ userId, companyId }) {
  const companyUser = await CompanyUser.findOne({
    where: { userId, companyId },
    raw: true,
  });

  if (companyUser) {
    const company = await Company.findOne({
      where: { companyId: companyUser.companyId },
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
}

module.exports = {
  getCompanyFromUserID,
  getCompany,
};
