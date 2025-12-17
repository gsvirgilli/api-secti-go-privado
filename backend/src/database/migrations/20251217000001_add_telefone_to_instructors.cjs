'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar coluna telefone à tabela instrutores
    await queryInterface.addColumn('instrutores', 'telefone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover coluna telefone
    await queryInterface.removeColumn('instrutores', 'telefone');
  }
};
