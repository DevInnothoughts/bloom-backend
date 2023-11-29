const { Company } = require('../models');

async function getCompany({ companyId }) {
  const company = await Company.findOne({
    where: { companyId },
    raw: true,
  });
  if (company && company.companyLogo) {
    company.companyLogo = Buffer.from(company.companyLogo).toJSON();
  }
  return company;
}

module.exports = {
  getCompany,
};
