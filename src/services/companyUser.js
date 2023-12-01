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

    if (company && company.companyLogo) {
      company.companyLogo = JSON.parse(company.companyLogo.toString());
    }

    return company;
  }
}

// async function getUserFromCompanyID({ companyId }) {
//   const companyUser = await CompanyUser.findOne({
//     where: { companyId },
//   });

//   return companyUser;
// }

module.exports = {
  getCompanyFromUserID,
};
