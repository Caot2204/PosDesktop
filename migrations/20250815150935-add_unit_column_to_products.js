'use strict';
import { Sequelize } from "sequelize";

/*console.log("---> se abre el archivo de migracion");

/** @type {import('sequelize-cli').Migration}
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("si pasa migration add column units a products");
    return queryInterface.sequelize.transaction(t => {
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
};*/

async function up(queryInterface) {
  console.log("Si pasa up");
  await queryInterface.addColumn(
    'products',
    'units',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  );
}

async function down(queryInterface) {
  await queryInterface.removeColumn(
    'products',
    'units',
  );
}

module.exports = {up, down};