const { DataTypes } = require('sequelize');
const db = require('../../lib/db'); // replace with your sequelize instance

const Form = db.define(
  'StoredFormSummary',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(64),
      field: 'user_id',
      allowNull: false,
    },
    formId: {
      type: DataTypes.STRING(64),
      field: 'form_id',
      unique: true,
    },
    userId: {
      type: DataTypes.STRING(64),
      field: 'user_id',
    },
    companyId: {
      type: DataTypes.STRING(64),
      field: 'company_id',
      allowNull: false,
    },
    googlePlaceId: {
      type: DataTypes.STRING(128),
      field: 'google_place_id',
    },
    googleBusinessName: {
      type: DataTypes.STRING(256),
      field: 'google_business_name',
    },
    formName: {
      type: DataTypes.STRING(64),
      field: 'form_name',
    },
    aboutForm: {
      type: DataTypes.STRING(512),
      field: 'about_form',
    },
    formContent: {
      type: DataTypes.BLOB,
      field: 'form_content',
    },
    formTheme: {
      type: DataTypes.BLOB,
      field: 'form_theme',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'form_draft',
    underscored: true,
    timestamps: true,
    version: true,
    indexes: [{ name: 'form_id_idx', fields: ['form_id'], unique: true }],
  }
);

module.exports = Form;
