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
    return queryInterface.bulkInsert('users', [
      {
      firstName: 'Samuel',
      lastName: 'Zakaria',
      email: 'samuelzakaria3103@outlook.com',
      password: 'Jobsterific',
      job : 'Profesional Cloud Computing',
      sex: 'MALE',
      address: 'Jln Linggarjati no 5A',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: "Samsung",
      lastName: "Company",
      email: "samsung@samsung.co.id",
      password: "budi",
      isCostumer: "1",
      sex: "MALE",
      address: "Jln Linggarjati no 5A",
      website: "www.samsung.com",
      phone: "+061782828",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('users', null, {});
  }
};
