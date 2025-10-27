import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

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
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (token === 'invalid-token') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN'
    };
    next();
  })
}));

// Mock do StudentService
vi.mock('../src/modules/students/student.service.js', () => ({
  default: {
    list: vi.fn(),
    findById: vi.fn(),
    findByCPF: vi.fn(),
    findByMatricula: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getStatistics: vi.fn()
  }
}));

/**
 * Testes do Módulo de Alunos
 */
describe('Students API - Testes Completos', () => {
  const authToken = 'mock-jwt-token-123';
  
  // Mock de dados de aluno
  const mockStudent = {
    id: 1,
    matricula: '2024001',
    nome: 'João Silva',
    cpf: '12345678901',
    email: 'joao@example.com',
    telefone: '11999999999',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  let StudentService: any;

  beforeEach(async () => {
    const module = await import('../src/modules/students/student.service.js');
    StudentService = module.default;
    vi.clearAllMocks();
  });

  describe('🔐 Autenticação', () => {
    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app).get('/api/students');
      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    it('deve aceitar requisição com token válido', async () => {
      StudentService.list.mockResolvedValue([mockStudent]);
      
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).not.toBe(401);
    });
  });

  describe('📋 GET /api/students - Listar Alunos', () => {
    it('deve listar todos os alunos', async () => {
      StudentService.list.mockResolvedValue([mockStudent]);
      
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(StudentService.list).toHaveBeenCalledWith({});
    });

    it('deve listar alunos com filtros', async () => {
      StudentService.list.mockResolvedValue([mockStudent]);
      
      const response = await request(app)
        .get('/api/students?nome=João')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(StudentService.list).toHaveBeenCalledWith({
        nome: 'João'
      });
    });

    it('deve retornar lista vazia quando não há alunos', async () => {
      StudentService.list.mockResolvedValue([]);
      
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('🔍 GET /api/students/:id - Buscar Aluno por ID', () => {
    it('deve buscar aluno por ID', async () => {
      StudentService.findById.mockResolvedValue(mockStudent);
      
      const response = await request(app)
        .get('/api/students/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        matricula: '2024001',
        nome: 'João Silva',
        cpf: '12345678901'
      });
      expect(StudentService.findById).toHaveBeenCalledWith(1);
    });

    it('deve retornar 404 se aluno não existir', async () => {
      StudentService.findById.mockRejectedValue(
        new Error('Aluno não encontrado')
      );
      
      const response = await request(app)
        .get('/api/students/999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Aluno não encontrado');
    });
  });

  describe('🔍 GET /api/students/cpf/:cpf - Buscar Aluno por CPF', () => {
    it('deve buscar aluno por CPF', async () => {
      StudentService.findByCPF.mockResolvedValue(mockStudent);
      
      const response = await request(app)
        .get('/api/students/cpf/12345678901')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        matricula: '2024001',
        cpf: '12345678901'
      });
      expect(StudentService.findByCPF).toHaveBeenCalledWith('12345678901');
    });

    it('deve retornar 404 se aluno não existir', async () => {
      StudentService.findByCPF.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/api/students/cpf/99999999999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Aluno não encontrado');
    });
  });

  describe('🔍 GET /api/students/matricula/:matricula - Buscar Aluno por Matrícula', () => {
    it('deve buscar aluno por matrícula', async () => {
      StudentService.findByMatricula.mockResolvedValue(mockStudent);
      
      const response = await request(app)
        .get('/api/students/matricula/2024001')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        matricula: '2024001',
        nome: 'João Silva'
      });
      expect(StudentService.findByMatricula).toHaveBeenCalledWith('2024001');
    });

    it('deve retornar 404 se aluno não existir', async () => {
      StudentService.findByMatricula.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/api/students/matricula/9999999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Aluno não encontrado');
    });
  });

  describe('✏️ PUT /api/students/:id - Atualizar Aluno', () => {
    const updateData = {
      nome: 'João Silva Atualizado',
      telefone: '11977777777'
    };

    it('deve atualizar aluno existente', async () => {
      StudentService.update.mockResolvedValue({
        ...mockStudent,
        ...updateData
      });
      
      const response = await request(app)
        .put('/api/students/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.nome).toBe(updateData.nome);
      expect(StudentService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('deve retornar 404 se aluno não existir', async () => {
      StudentService.update.mockRejectedValue(
        new Error('Aluno não encontrado')
      );
      
      const response = await request(app)
        .put('/api/students/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(404);
    });

    it('deve validar dados de atualização', async () => {
      const invalidData = {
        email: 'email-invalido'
      };
      
      const response = await request(app)
        .put('/api/students/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('🗑️ DELETE /api/students/:id - Deletar Aluno', () => {
    it('deve deletar aluno existente', async () => {
      StudentService.delete.mockResolvedValue({
        message: 'Aluno deletado com sucesso'
      });
      
      const response = await request(app)
        .delete('/api/students/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(StudentService.delete).toHaveBeenCalledWith(1);
    });

    it('deve retornar 404 se aluno não existir', async () => {
      StudentService.delete.mockRejectedValue(
        new Error('Aluno não encontrado')
      );
      
      const response = await request(app)
        .delete('/api/students/999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('📊 GET /api/students/statistics - Estatísticas', () => {
    const mockStatistics = {
      total: 150,
      porAno: {
        '2024': 100,
        '2023': 50
      },
      recentes: 15
    };

    it('deve retornar estatísticas de alunos', async () => {
      StudentService.getStatistics.mockResolvedValue(mockStatistics);
      
      const response = await request(app)
        .get('/api/students/statistics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('porAno');
      expect(response.body).toHaveProperty('recentes');
      expect(StudentService.getStatistics).toHaveBeenCalled();
    });

    it('deve retornar estatísticas vazias quando não há alunos', async () => {
      StudentService.getStatistics.mockResolvedValue({
        total: 0,
        porAno: {},
        recentes: 0
      });
      
      const response = await request(app)
        .get('/api/students/statistics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(0);
    });
  });
});
