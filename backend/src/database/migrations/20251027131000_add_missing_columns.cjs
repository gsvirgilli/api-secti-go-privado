module.exports = {
  up: async (queryInterface, DataTypes) => {
    try {
      // Turmas: adicionar data_inicio, data_fim, turno, id_curso
      try {
        await queryInterface.addColumn('turmas', 'data_inicio', {
          type: DataTypes.DATE,
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      try {
        await queryInterface.addColumn('turmas', 'data_fim', {
          type: DataTypes.DATE,
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      try {
        await queryInterface.addColumn('turmas', 'turno', {
          type: DataTypes.STRING(20),
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      try {
        await queryInterface.addColumn('turmas', 'id_curso', {
          type: DataTypes.INTEGER,
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      // Alunos: adicionar candidato_id, usuario_id
      try {
        await queryInterface.addColumn('alunos', 'candidato_id', {
          type: DataTypes.INTEGER,
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      try {
        await queryInterface.addColumn('alunos', 'usuario_id', {
          type: DataTypes.INTEGER,
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      // Candidatos: adicionar telefone e data_nascimento
      try {
        await queryInterface.addColumn('candidatos', 'telefone', {
          type: DataTypes.STRING(20),
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }

      try {
        await queryInterface.addColumn('candidatos', 'data_nascimento', {
          type: DataTypes.DATEONLY,
          allowNull: true,
        });
      } catch (e) { /* Coluna já existe */ }
    } catch (error) {
      console.error('Erro na migration:', error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('turmas', 'data_inicio');
    await queryInterface.removeColumn('turmas', 'data_fim');
    await queryInterface.removeColumn('turmas', 'turno');
    await queryInterface.removeColumn('turmas', 'id_curso');
    await queryInterface.removeColumn('alunos', 'candidato_id');
    await queryInterface.removeColumn('alunos', 'usuario_id');
    await queryInterface.removeColumn('candidatos', 'telefone');
  }
};
