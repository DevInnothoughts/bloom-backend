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
    name: {
      type: DataTypes.STRING(128),
      field: 'name',
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.STRING(256),
      field: 'avatar_url',
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
    isMultiCompanyAllowed: {
      type: DataTypes.BOOLEAN,
      field: 'is_multi_company_allowed',
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'user',
    timestamps: true,
    underscored: true,
    version: true,
    indexes: [
      { name: 'user_idx', fields: ['user_id'], unique: true },
      { name: 'email_idx', fields: ['email_id'], unique: true },
    ],
  }
);

module.exports = User;
