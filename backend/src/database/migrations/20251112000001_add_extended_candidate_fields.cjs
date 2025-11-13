/**
 * Migration: Adicionar campos estendidos de candidatos
 * Data: 2025-11-12
 * Descrição: Adiciona campos do questionário social, responsável legal, e dados adicionais
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;

    // Verificar se as colunas já existem antes de adicionar
    const tableInfo = await queryInterface.describeTable('candidatos');

    const columnsToAdd = [];

    // Dados pessoais adicionais
    if (!tableInfo.rg) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'rg', {
          type: DataTypes.STRING(20),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.sexo) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'sexo', {
          type: DataTypes.ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.deficiencia) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'deficiencia', {
          type: DataTypes.ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.telefone2) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'telefone2', {
          type: DataTypes.STRING(20),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.idade) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'idade', {
          type: DataTypes.INTEGER,
          allowNull: true,
        })
      );
    }

    if (!tableInfo.nome_mae) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'nome_mae', {
          type: DataTypes.STRING(100),
          allowNull: true,
        })
      );
    }

    // Curso - segunda opção
    if (!tableInfo.curso_id2) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'curso_id2', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'cursos',
            key: 'id',
          }
        })
      );
    }

    if (!tableInfo.turno2) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'turno2', {
          type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO'),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.local_curso) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'local_curso', {
          type: DataTypes.STRING(100),
          allowNull: true,
        })
      );
    }

    // Questionário Social
    if (!tableInfo.raca_cor) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'raca_cor', {
          type: DataTypes.ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.renda_mensal) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'renda_mensal', {
          type: DataTypes.ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM'),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.pessoas_renda) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'pessoas_renda', {
          type: DataTypes.STRING(20),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.tipo_residencia) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'tipo_residencia', {
          type: DataTypes.ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.itens_casa) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'itens_casa', {
          type: DataTypes.STRING(200),
          allowNull: true,
          comment: 'Itens separados por vírgula: TV,CELULAR,COMPUTADOR,INTERNET'
        })
      );
    }

    // Programa Goianas
    if (!tableInfo.goianas_ciencia) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'goianas_ciencia', {
          type: DataTypes.ENUM('SIM', 'NAO'),
          allowNull: true,
        })
      );
    }

    // Responsável Legal
    if (!tableInfo.menor_idade) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'menor_idade', {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        })
      );
    }

    if (!tableInfo.nome_responsavel) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'nome_responsavel', {
          type: DataTypes.STRING(100),
          allowNull: true,
        })
      );
    }

    if (!tableInfo.cpf_responsavel) {
      columnsToAdd.push(
        queryInterface.addColumn('candidatos', 'cpf_responsavel', {
          type: DataTypes.STRING(11),
          allowNull: true,
        })
      );
    }

    // Executar todas as adições de colunas
    await Promise.all(columnsToAdd);

    console.log('✅ Campos estendidos de candidatos adicionados com sucesso!');
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter migration removendo os campos adicionados
    const columnsToRemove = [
      'rg', 'sexo', 'deficiencia', 'telefone2', 'idade', 'nome_mae',
      'curso_id2', 'turno2', 'local_curso',
      'raca_cor', 'renda_mensal', 'pessoas_renda', 'tipo_residencia', 'itens_casa',
      'goianas_ciencia',
      'menor_idade', 'nome_responsavel', 'cpf_responsavel'
    ];

    const tableInfo = await queryInterface.describeTable('candidatos');

    for (const column of columnsToRemove) {
      if (tableInfo[column]) {
        await queryInterface.removeColumn('candidatos', column);
      }
    }

    console.log('✅ Campos estendidos de candidatos removidos!');
  }
};

