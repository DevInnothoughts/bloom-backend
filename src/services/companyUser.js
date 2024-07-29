/* eslint-disable arrow-body-style */
/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
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

async function getAllCompaniesFromUserID({ userId }) {
  const companyUsers = await CompanyUser.findAll({
    where: { userId },
    raw: true,
  });

  if (companyUsers.length > 0) {
    const companyIds = companyUsers.map((companyUser) => companyUser.companyId);
    // Use Promise.all to await all the company fetch promises
    const companies = await Promise.all(
      companyIds.map(async (companyId) => {
        return await Company.findOne({
          where: { companyId },
          raw: true,
        });
      })
    );

    // Process the company data
    const result = companies.map((company) => {
      if (company) {
        delete company.id;
        if (company.companyLogo) {
          company.companyLogo = JSON.parse(company.companyLogo.toString());
        }
        return company;
      }
    });

    return result.filter((company) => company !== undefined); // Filter out undefined results if any
  }

  return [];
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
  getAllCompaniesFromUserID,
  getCompany,
};
