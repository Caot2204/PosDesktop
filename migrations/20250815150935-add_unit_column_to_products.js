'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      console.log("si pasa migration add column units a products");
      return queryInterface.addColumn(
        'products',
        'units',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        {
          transaction: t
        }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn(
        'products',
        'units',
        {
          transaction: t
        }
      )
    });
  }
};
