import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

// Mock simples e funcional - versão final dos testes
describe('Courses API - Final Tests', () => {
  const authToken = 'mock-jwt-token-123';

  // Mock do JWT para autenticação
  vi.mock('../src/utils/jwt.js', () => ({
    verifyJwt: vi.fn().mockReturnValue({
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN'
    }),
    generateJwt: vi.fn().mockReturnValue('mock-jwt-token-123')
  }));

  // Mock do middleware de autenticação
  vi.mock('../src/middlewares/isAuthenticated.js', () => ({
    isAuthenticated: vi.fn().mockImplementation((req, res, next) => {
      const authHeader = req.headers.authorization;
      
      // Se não tem header de autorização, retorna 401
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const token = authHeader.replace('Bearer ', '').trim();
      
      // Se token é inválido, retorna 401
      if (token === 'invalid-token') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      // Se token é válido, simular usuário autenticado
      req.user = {
        id: 1,
        nome: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN'
      };
      next();
    })
  }));

  // Mock do CourseService para simular dados
  vi.mock('../src/modules/courses/course.service.js', () => ({
    default: {
      findAll: vi.fn().mockResolvedValue([
        {
          id: 1,
          nome: 'React Básico',
          carga_horaria: 40,
          descricao: 'Curso de React para iniciantes'
        }
      ]),
      create: vi.fn().mockImplementation((courseData) => Promise.resolve({
        id: 2,
        nome: courseData.nome,
        carga_horaria: courseData.carga_horaria,
        descricao: courseData.descricao
      })),
      getStatistics: vi.fn().mockResolvedValue({
        total: 3,
        totalCargaHoraria: 150,
        mediaCargaHoraria: 50
      })
    }
  }));

  describe('✅ Testes Funcionais', () => {
    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app).get('/api/courses');
      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    it('deve listar cursos com sucesso', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve criar curso com dados válidos', async () => {
      const courseData = {
        nome: 'Vue.js Básico',
        carga_horaria: 30,
        descricao: 'Curso introdutório de Vue.js'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(courseData.nome);
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ carga_horaria: 30 }); // nome é obrigatório

      expect(response.status).toBe(400);
    });

    it('deve retornar estatísticas', async () => {
      const response = await request(app)
        .get('/api/courses/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/api/courses/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });
});