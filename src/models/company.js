const { DataTypes } = require('sequelize');
const db = require('../../lib/db');

const Company = db.define(
  'Company',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.STRING(64),
      field: 'company_id',
      unique: true,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING(256),
      field: 'company_name',
      allowNull: false,
    },
    companyLogo: {
      type: DataTypes.BLOB,
      field: 'company_logo',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'companies',
    timestamps: true,
    underscored: true,
    version: true,
    // indexes: [],
  }
);

module.exports = Company;
