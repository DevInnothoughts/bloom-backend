const { DataTypes } = require('sequelize');
const db = require('../../lib/db');

const Lead = db.define(
  'Lead',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(64),
      field: 'mobile_number',
      unique: true,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING(256),
      field: 'business_name',
    },
    businessPlaceId: {
      type: DataTypes.STRING(128),
      field: 'business_website_link',
    },
    businessAddress: {
      type: DataTypes.STRING(512),
      field: 'business_address',
    },
    userName: {
      type: DataTypes.STRING(128),
      filed: 'user_name',
    },
    emailId: {
      type: DataTypes.STRING(128),
      field: 'email_id',
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
    tableName: 'business_details',
    timestamps: true,
    underscored: true,
    version: true,
    indexes: [
      { name: 'business_mobile_idx', fields: ['mobile_number'], unique: true },
    ],
  }
);

module.exports = Lead;
