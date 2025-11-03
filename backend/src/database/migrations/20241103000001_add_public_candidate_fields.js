/**
 * Migration para adicionar campos de candidatura pública
 * - Campos de endereço
 * - Curso e turno desejados
 */

export async function up(queryInterface, Sequelize) {
  // Adicionar campos de endereço
  await queryInterface.addColumn('candidatos', 'cep', {
    type: Sequelize.STRING(8),
    allowNull: true,
  });

  await queryInterface.addColumn('candidatos', 'rua', {
    type: Sequelize.STRING(200),
    allowNull: true,
  });

  await queryInterface.addColumn('candidatos', 'numero', {
    type: Sequelize.STRING(20),
    allowNull: true,
  });

  await queryInterface.addColumn('candidatos', 'complemento', {
    type: Sequelize.STRING(100),
    allowNull: true,
  });

  await queryInterface.addColumn('candidatos', 'bairro', {
    type: Sequelize.STRING(100),
    allowNull: true,
  });

  await queryInterface.addColumn('candidatos', 'cidade', {
    type: Sequelize.STRING(100),
    allowNull: true,
  });

  await queryInterface.addColumn('candidatos', 'estado', {
    type: Sequelize.STRING(2),
    allowNull: true,
  });

  // Adicionar campos de curso e turno desejados
  await queryInterface.addColumn('candidatos', 'curso_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'cursos',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });

  await queryInterface.addColumn('candidatos', 'turno', {
    type: Sequelize.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO'),
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  // Remover campos na ordem inversa
  await queryInterface.removeColumn('candidatos', 'turno');
  await queryInterface.removeColumn('candidatos', 'curso_id');
  await queryInterface.removeColumn('candidatos', 'estado');
  await queryInterface.removeColumn('candidatos', 'cidade');
  await queryInterface.removeColumn('candidatos', 'bairro');
  await queryInterface.removeColumn('candidatos', 'complemento');
  await queryInterface.removeColumn('candidatos', 'numero');
  await queryInterface.removeColumn('candidatos', 'rua');
  await queryInterface.removeColumn('candidatos', 'cep');

  // Remover ENUM do turno
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_candidatos_turno";');
}
