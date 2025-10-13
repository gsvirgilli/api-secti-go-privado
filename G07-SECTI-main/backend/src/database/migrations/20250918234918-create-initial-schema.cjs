'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tabelas que não dependem de outras
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      senha_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(50), allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('cursos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      nome: { type: Sequelize.STRING(100), allowNull: false },
      carga_horaria: { type: Sequelize.INTEGER, allowNull: false },
      descricao: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('instrutores', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      cpf: { type: Sequelize.STRING(11), allowNull: false, unique: true },
      nome: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      especialidade: { type: Sequelize.STRING(100), allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('alunos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      matricula: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      cpf: { type: Sequelize.STRING(11), allowNull: false, unique: true },
      nome: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // 2. Tabelas que dependem das anteriores
    await queryInterface.createTable('turmas', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      nome: { type: Sequelize.STRING(100), allowNull: false },
      turno: { type: Sequelize.STRING(50), allowNull: false },
      id_curso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cursos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('candidatos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      nome: { type: Sequelize.STRING(100), allowNull: false },
      cpf: { type: Sequelize.STRING(11), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'PENDENTE' },
      id_turma_desejada: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: { model: 'turmas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // 3. Tabelas de Junção (Muitos-para-Muitos)
    await queryInterface.createTable('matriculas', {
      id_aluno: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'alunos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_turma: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'turmas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Cursando' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('instrutor_turma', {
      id_instrutor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'instrutores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_turma: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'turmas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('presenca', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      id_aluno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'alunos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_turma: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'turmas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data_chamada: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    // O 'down' serve para apagar tudo na ordem inversa, caso precise reverter
    await queryInterface.dropTable('presenca');
    await queryInterface.dropTable('instrutor_turma');
    await queryInterface.dropTable('matriculas');
    await queryInterface.dropTable('candidatos');
    await queryInterface.dropTable('turmas');
    await queryInterface.dropTable('alunos');
    await queryInterface.dropTable('instrutores');
    await queryInterface.dropTable('cursos');
    await queryInterface.dropTable('usuarios');
  }
};