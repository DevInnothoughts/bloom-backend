const { DataTypes } = require('sequelize');
const db = require('../../lib/db');

const GeneratedReview = db.define(
  'GeneratedReview',
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
    status: {
      type: DataTypes.STRING(64), // PROCESSING -> SUCCESS/ERROR
    },
    inputModel: {
      field: 'input_model',
      type: DataTypes.STRING(64),
    },
    // input [{role, content}]
    inputMessages: {
      field: 'input_messages',
      type: DataTypes.BLOB,
    },
    vendorName: {
      field: 'vendor_name',
      type: DataTypes.STRING(128),
      defaultValue: 'openai',
    },
    vendorId: {
      field: 'vendor_id',
      type: DataTypes.STRING(128),
    },
    vendorCreatedAt: {
      field: 'vendor_created_at',
      type: DataTypes.INTEGER,
    },
    vendorModel: {
      field: 'vendor_model',
      type: DataTypes.STRING(64),
    },
    // [
    //     {
    //         "index": 0,
    //         "message": {
    //             "role": "assistant",
    //             "content": "2 + 2 equals 4."
    //         },
    //         "finish_reason": "stop"
    //     }
    // ]
    vendorResponse: {
      field: 'vendor_response',
      type: DataTypes.BLOB,
    },
    // {
    //     "prompt_tokens": 14,
    //     "completion_tokens": 8,
    //     "total_tokens": 22
    // }
    vendorUsage: {
      field: 'vendor_usage',
      type: DataTypes.BLOB,
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
    tableName: 'generated_review',
    underscored: true,
    timestamps: true,
    version: true,
    indexes: [],
  }
);

module.exports = GeneratedReview;
