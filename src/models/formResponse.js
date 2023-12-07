const { DataTypes } = require('sequelize');
const db = require('../../lib/db');

const FormResponse = db.define(
  'FormResponse',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    responseId: {
      type: DataTypes.STRING(64),
      field: 'response_id',
    },
    formId: {
      type: DataTypes.STRING(64),
      field: 'form_id',
    },
    companyId: {
      type: DataTypes.STRING(64),
      field: 'company_id',
    },
    review: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    queryParams: {
      type: DataTypes.BLOB,
      field: 'query_params',
    },
    generateReview: {
      type: DataTypes.BOOLEAN,
      field: 'generate_review',
      allowNull: false,
      defaultValue: false,
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
    tableName: 'business_response',
    underscored: true,
    timestamps: true,
    version: true,
    indexes: [
      { name: 'review_response_idx', fields: ['response_id'], unique: true },
    ],
  }
);

module.exports = FormResponse;
