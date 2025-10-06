import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Courses API - Basic Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // Criar usuário de teste via API (usando o banco real temporariamente)
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Test User',
        email: 'test-courses@example.com',
        senha: 'password123',
        role: 'ADMIN'
      });

    console.log('Register response:', registerResponse.status, registerResponse.body);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test-courses@example.com',
        senha: 'password123'
      });

    console.log('Login response:', loginResponse.status, loginResponse.body);
    authToken = loginResponse.body.token;
    console.log('Auth token:', authToken);
  });

  describe('Autenticação', () => {
    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .get('/api/courses');

      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', 'Bearer token-invalido');

      expect(response.status).toBe(401);
    });
  });

  describe('CRUD Básico', () => {
    it('deve listar cursos (pode ser vazio)', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve criar um curso com dados válidos', async () => {
      const courseData = {
        nome: `Test Course ${Date.now()}`, // Nome único
        carga_horaria: 40,
        descricao: 'Curso de teste'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(courseData.nome);
      expect(response.body.data.carga_horaria).toBe(courseData.carga_horaria);
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: '', // Nome vazio
          carga_horaria: -1 // Carga horária inválida
        });

      expect(response.status).toBe(400);
    });

    it('deve retornar estatísticas', async () => {
      const response = await request(app)
        .get('/api/courses/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('carga_horaria');
    });
  });

  describe('Validações', () => {
    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/api/courses/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    it('deve retornar erro 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/api/courses/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});