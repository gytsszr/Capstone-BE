'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('batchs', [{
      userId	: '2',
      campaignName: 'Cloud Computing Campaign',
      campaignDesc: 'Cloud Computing Campaigns are strategic initiatives aimed at promoting the adoption and use of cloud computing technology. These campaigns can take various forms, but they generally include the following elements: 1. Education and Awareness: The campaign seeks to educate potential users about the benefits of cloud computing. This includes explaining what cloud computing is, how it works, and how it can benefit businesses and individuals. This is often done through webinars, workshops, and informational content',
      campaignPeriod: new Date(),
      campaignKeyword: '#Campagin#ClooudComputing#Tech',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};