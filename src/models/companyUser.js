const { DataTypes } = require('sequelize');
const db = require('../../lib/db');

const CompanyUser = db.define(
  'CompanyUser',
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
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(64),
      field: 'user_id',
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      field: 'is_admin',
    },
    status: {
      type: DataTypes.STRING(64),
      field: 'status',
      allowNull: false,
      defaultValue: 'NOT_APPROVED',
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
    tableName: 'company_user',
    timestamps: true,
    underscored: true,
    version: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'company_id'],
        name: 'user_company_idx',
      },
    ],
  }
);

module.exports = CompanyUser;
