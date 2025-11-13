'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar coluna horarios (JSON)
    await queryInterface.addColumn('cursos', 'horarios', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    });

    // Adicionar coluna locais (JSON)
    await queryInterface.addColumn('cursos', 'locais', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover coluna horarios
    await queryInterface.removeColumn('cursos', 'horarios');
    
    // Remover coluna locais
    await queryInterface.removeColumn('cursos', 'locais');
  }
};

