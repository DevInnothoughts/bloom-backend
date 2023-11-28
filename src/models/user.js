const { DataTypes } = require('sequelize');
const db = require('../../lib/db');

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(64),
      field: 'user_id',
      unique: true,
      allowNull: false,
    },
    emailId: {
      type: DataTypes.STRING(64),
      field: 'email_id',
      unique: true,
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
    tableName: 'user',
    timestamps: true,
    underscored: true,
    version: true,
    indexes: [
      { name: 'user_idx', fields: ['user_id'], unique: true },
      { name: 'company_idx', fields: ['company_id'], unique: true },
      { name: 'email_idx', fields: ['email_id'], unique: true },
    ],
  }
);

module.exports = User;
