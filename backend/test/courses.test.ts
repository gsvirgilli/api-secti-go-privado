import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import Course from '../src/modules/courses/course.model.js';

describe('Courses API', () => {
  let authToken: string;
  let testCourseId: number;

  beforeAll(async () => {
    // Sincronizar banco de dados de teste
    await sequelize.sync({ force: true });

    // Criar usuário de teste e obter token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'password123',
        tipo: 'ADMIN'
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        senha: 'password123'
      });

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpar tabela de cursos antes de cada teste
    await Course.destroy({ where: {} });
  });

  describe('POST /api/courses', () => {
    it('deve criar um novo curso com dados válidos', async () => {
      const courseData = {
        nome: 'JavaScript Avançado',
        carga_horaria: 40,
        descricao: 'Curso completo de JavaScript'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(courseData.nome);
      expect(response.body.data.carga_horaria).toBe(courseData.carga_horaria);
      expect(response.body.data.descricao).toBe(courseData.descricao);

      testCourseId = response.body.data.id;
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: '', // Nome vazio
          carga_horaria: 'invalid' // Tipo inválido
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro 409 para nome duplicado', async () => {
      const courseData = {
        nome: 'React Fundamentals',
        carga_horaria: 30
      };

      // Criar primeiro curso
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData);

      // Tentar criar curso com mesmo nome
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send({
          nome: 'Test Course',
          carga_horaria: 20
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/courses', () => {
    beforeEach(async () => {
      // Criar cursos de teste
      await Course.bulkCreate([
        { nome: 'Python Básico', carga_horaria: 20, descricao: 'Introdução ao Python' },
        { nome: 'Python Avançado', carga_horaria: 40, descricao: 'Python para experts' },
        { nome: 'Java Fundamentals', carga_horaria: 60, descricao: 'Curso de Java' }
      ]);
    });

    it('deve listar todos os cursos', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });

    it('deve filtrar cursos por nome', async () => {
      const response = await request(app)
        .get('/api/courses?nome=Python')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((course: any) => course.nome.includes('Python'))).toBe(true);
    });

    it('deve filtrar cursos por carga horária', async () => {
      const response = await request(app)
        .get('/api/courses?carga_horaria_min=40')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2); // Python Avançado e Java Fundamentals
    });
  });

  describe('GET /api/courses/:id', () => {
    beforeEach(async () => {
      const course = await Course.create({
        nome: 'Node.js Masterclass',
        carga_horaria: 50,
        descricao: 'Curso completo de Node.js'
      });
      testCourseId = course.id;
    });

    it('deve retornar curso específico por ID', async () => {
      const response = await request(app)
        .get(`/api/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testCourseId);
      expect(response.body.data.nome).toBe('Node.js Masterclass');
    });

    it('deve retornar erro 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/api/courses/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/api/courses/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/courses/:id', () => {
    beforeEach(async () => {
      const course = await Course.create({
        nome: 'Angular Basics',
        carga_horaria: 35,
        descricao: 'Introdução ao Angular'
      });
      testCourseId = course.id;
    });

    it('deve atualizar curso existente', async () => {
      const updateData = {
        nome: 'Angular Advanced',
        carga_horaria: 50,
        descricao: 'Angular para desenvolvedores experientes'
      };

      const response = await request(app)
        .put(`/api/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(updateData.nome);
      expect(response.body.data.carga_horaria).toBe(updateData.carga_horaria);
    });

    it('deve permitir atualização parcial', async () => {
      const response = await request(app)
        .put(`/api/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ carga_horaria: 45 });

      expect(response.status).toBe(200);
      expect(response.body.data.carga_horaria).toBe(45);
      expect(response.body.data.nome).toBe('Angular Basics'); // Não alterado
    });

    it('deve retornar erro 404 para ID inexistente', async () => {
      const response = await request(app)
        .put('/api/courses/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/courses/:id', () => {
    beforeEach(async () => {
      const course = await Course.create({
        nome: 'Vue.js Fundamentals',
        carga_horaria: 30
      });
      testCourseId = course.id;
    });

    it('deve deletar curso existente', async () => {
      const response = await request(app)
        .delete(`/api/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verificar se foi realmente deletado
      const deletedCourse = await Course.findByPk(testCourseId);
      expect(deletedCourse).toBeNull();
    });

    it('deve retornar erro 404 para ID inexistente', async () => {
      const response = await request(app)
        .delete('/api/courses/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/courses/statistics', () => {
    beforeEach(async () => {
      await Course.bulkCreate([
        { nome: 'Course A', carga_horaria: 20 },
        { nome: 'Course B', carga_horaria: 40 },
        { nome: 'Course C', carga_horaria: 60 }
      ]);
    });

    it('deve retornar estatísticas dos cursos', async () => {
      const response = await request(app)
        .get('/api/courses/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.carga_horaria.media).toBe(40);
      expect(response.body.data.carga_horaria.maxima).toBe(60);
      expect(response.body.data.carga_horaria.minima).toBe(20);
    });
  });
});