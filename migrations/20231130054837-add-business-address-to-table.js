'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('business_details', 'business_address', {
      type: Sequelize.STRING, // Adjust the data type as needed
      allowNull: true, // Modify this based on your requirements
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('your_table_name', 'business_address');
  },
};
