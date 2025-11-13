/**
 * Migration para adicionar campos de documentos dos candidatos
 * Data: 2024-11-12
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('candidatos', 'rg_frente', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo RG frente'
    });

    await queryInterface.addColumn('candidatos', 'rg_verso', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo RG verso'
    });

    await queryInterface.addColumn('candidatos', 'cpf_aluno', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo CPF do aluno'
    });

    await queryInterface.addColumn('candidatos', 'comprovante_endereco', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo comprovante de endereço'
    });

    await queryInterface.addColumn('candidatos', 'identidade_responsavel_frente', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo identidade do responsável frente'
    });

    await queryInterface.addColumn('candidatos', 'identidade_responsavel_verso', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo identidade do responsável verso'
    });

    await queryInterface.addColumn('candidatos', 'cpf_responsavel_file', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo CPF do responsável'
    });

    await queryInterface.addColumn('candidatos', 'comprovante_escolaridade', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo comprovante de escolaridade'
    });

    await queryInterface.addColumn('candidatos', 'foto_3x4', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Caminho do arquivo foto 3x4'
    });

    console.log('✅ Campos de documentos adicionados à tabela candidatos');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('candidatos', 'foto_3x4');
    await queryInterface.removeColumn('candidatos', 'comprovante_escolaridade');
    await queryInterface.removeColumn('candidatos', 'cpf_responsavel_file');
    await queryInterface.removeColumn('candidatos', 'identidade_responsavel_verso');
    await queryInterface.removeColumn('candidatos', 'identidade_responsavel_frente');
    await queryInterface.removeColumn('candidatos', 'comprovante_endereco');
    await queryInterface.removeColumn('candidatos', 'cpf_aluno');
    await queryInterface.removeColumn('candidatos', 'rg_verso');
    await queryInterface.removeColumn('candidatos', 'rg_frente');

    console.log('❌ Campos de documentos removidos da tabela candidatos');
  }
};

