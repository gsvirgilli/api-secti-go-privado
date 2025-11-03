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

// Mock do InstructorService
vi.mock('../src/modules/instructors/instructor.service.js', () => ({
  default: {
    list: vi.fn(),
    findById: vi.fn(),
    findByCPF: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getClasses: vi.fn(),
    assignToClass: vi.fn(),
    unassignFromClass: vi.fn(),
    getStatistics: vi.fn()
  }
}));

/**
 * Testes do Módulo de Instrutores
 */
describe('Instructors API - Testes Completos', () => {
  const authToken = 'mock-jwt-token-123';
  
  // Mock de dados de instrutor
  const mockInstructor = {
    id: 1,
    cpf: '12345678901',
    nome: 'Prof. João Silva',
    email: 'joao.silva@example.com',
    especialidade: 'Desenvolvimento Web',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockInstructorClass = {
    id_instrutor: 1,
    id_turma: 5,
    turma: {
      id: 5,
      nome: 'Turma A',
      turno: 'MATUTINO',
      id_curso: 1
    }
  };

  let InstructorService: any;

  beforeEach(async () => {
    const module = await import('../src/modules/instructors/instructor.service.js');
    InstructorService = module.default;
    vi.clearAllMocks();
  });

  describe('🔐 Autenticação', () => {
    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app).get('/api/instructors');
      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/instructors')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    it('deve aceitar requisição com token válido', async () => {
      InstructorService.list.mockResolvedValue([mockInstructor]);
      
      const response = await request(app)
        .get('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).not.toBe(401);
    });
  });

  describe('📋 GET /api/instructors - Listar Instrutores', () => {
    it('deve listar todos os instrutores', async () => {
      InstructorService.list.mockResolvedValue([mockInstructor]);
      
      const response = await request(app)
        .get('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: mockInstructor.id,
        nome: mockInstructor.nome,
        email: mockInstructor.email
      });
    });

    it('deve filtrar instrutores por nome', async () => {
      InstructorService.list.mockResolvedValue([mockInstructor]);
      
      const response = await request(app)
        .get('/api/instructors')
        .query({ nome: 'João' })
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(InstructorService.list).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'João' })
      );
    });

    it('deve filtrar instrutores por especialidade', async () => {
      InstructorService.list.mockResolvedValue([mockInstructor]);
      
      const response = await request(app)
        .get('/api/instructors')
        .query({ especialidade: 'Web' })
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(InstructorService.list).toHaveBeenCalledWith(
        expect.objectContaining({ especialidade: 'Web' })
      );
    });
  });

  describe('🔍 GET /api/instructors/:id - Buscar por ID', () => {
    it('deve buscar instrutor por ID', async () => {
      InstructorService.findById.mockResolvedValue(mockInstructor);
      
      const response = await request(app)
        .get('/api/instructors/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: mockInstructor.id,
        nome: mockInstructor.nome,
        email: mockInstructor.email
      });
    });

    it('deve retornar 404 se instrutor não encontrado', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.findById.mockRejectedValue(
        new AppError('Instrutor não encontrado', 404)
      );
      
      const response = await request(app)
        .get('/api/instructors/999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('🔍 GET /api/instructors/cpf/:cpf - Buscar por CPF', () => {
    it('deve buscar instrutor por CPF', async () => {
      InstructorService.findByCPF.mockResolvedValue(mockInstructor);
      
      const response = await request(app)
        .get('/api/instructors/cpf/12345678901')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.cpf).toBe(mockInstructor.cpf);
    });

    it('deve retornar 404 se CPF não encontrado', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.findByCPF.mockRejectedValue(
        new AppError('Instrutor não encontrado', 404)
      );
      
      const response = await request(app)
        .get('/api/instructors/cpf/99999999999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('🔍 GET /api/instructors/email/:email - Buscar por Email', () => {
    it('deve buscar instrutor por email', async () => {
      InstructorService.findByEmail.mockResolvedValue(mockInstructor);
      
      const response = await request(app)
        .get('/api/instructors/email/joao.silva@example.com')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(mockInstructor.email);
    });
  });

  describe('➕ POST /api/instructors - Criar Instrutor', () => {
    it('deve criar novo instrutor com dados válidos', async () => {
      const newInstructor = {
        cpf: '98765432100',
        nome: 'Maria Santos',
        email: 'maria.santos@example.com',
        especialidade: 'Banco de Dados'
      };

      InstructorService.create.mockResolvedValue({
        id: 2,
        ...newInstructor,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const response = await request(app)
        .post('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newInstructor);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        nome: newInstructor.nome,
        email: newInstructor.email,
        cpf: newInstructor.cpf
      });
    });

    it('deve rejeitar criação sem CPF', async () => {
      const invalidInstructor = {
        nome: 'Maria Santos',
        email: 'maria@example.com'
      };
      
      const response = await request(app)
        .post('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidInstructor);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Erro de validação');
    });

    it('deve rejeitar criação com CPF inválido', async () => {
      const invalidInstructor = {
        cpf: '123',
        nome: 'Maria Santos',
        email: 'maria@example.com'
      };
      
      const response = await request(app)
        .post('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidInstructor);
      
      expect(response.status).toBe(400);
    });

    it('deve rejeitar criação com email inválido', async () => {
      const invalidInstructor = {
        cpf: '98765432100',
        nome: 'Maria Santos',
        email: 'email-invalido'
      };
      
      const response = await request(app)
        .post('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidInstructor);
      
      expect(response.status).toBe(400);
    });

    it('deve rejeitar criação com CPF duplicado', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.create.mockRejectedValue(
        new AppError('Já existe um instrutor cadastrado com este CPF', 400)
      );
      
      const response = await request(app)
        .post('/api/instructors')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf: '12345678901',
          nome: 'Outro Instrutor',
          email: 'outro@example.com'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('CPF');
    });
  });

  describe('✏️ PUT /api/instructors/:id - Atualizar Instrutor', () => {
    it('deve atualizar instrutor com dados válidos', async () => {
      const updatedData = {
        nome: 'Prof. João Silva Santos',
        especialidade: 'Full Stack Development'
      };

      InstructorService.update.mockResolvedValue({
        ...mockInstructor,
        ...updatedData
      });
      
      const response = await request(app)
        .put('/api/instructors/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.nome).toBe(updatedData.nome);
      expect(response.body.especialidade).toBe(updatedData.especialidade);
    });

    it('deve retornar 404 ao atualizar instrutor inexistente', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.update.mockRejectedValue(
        new AppError('Instrutor não encontrado', 404)
      );
      
      const response = await request(app)
        .put('/api/instructors/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: 'Novo Nome' });
      
      expect(response.status).toBe(404);
    });
  });

  describe('🗑️ DELETE /api/instructors/:id - Deletar Instrutor', () => {
    it('deve deletar instrutor sem turmas', async () => {
      InstructorService.delete.mockResolvedValue(undefined);
      
      const response = await request(app)
        .delete('/api/instructors/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(204);
    });

    it('deve rejeitar deleção de instrutor com turmas', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.delete.mockRejectedValue(
        new AppError('Não é possível deletar o instrutor. Existem 3 turma(s) associada(s)', 400)
      );
      
      const response = await request(app)
        .delete('/api/instructors/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('turma');
    });
  });

  describe('🏫 GET /api/instructors/:id/classes - Listar Turmas do Instrutor', () => {
    it('deve listar turmas de um instrutor', async () => {
      InstructorService.getClasses.mockResolvedValue([mockInstructorClass]);
      
      const response = await request(app)
        .get('/api/instructors/1/classes')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id_turma');
      expect(response.body[0]).toHaveProperty('turma');
    });
  });

  describe('➕ POST /api/instructors/:id/classes - Atribuir a Turma', () => {
    it('deve atribuir instrutor a uma turma', async () => {
      InstructorService.assignToClass.mockResolvedValue(mockInstructorClass);
      
      const response = await request(app)
        .post('/api/instructors/1/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ id_turma: 5 });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id_instrutor');
      expect(response.body).toHaveProperty('id_turma');
    });

    it('deve rejeitar atribuição sem id_turma', async () => {
      const response = await request(app)
        .post('/api/instructors/1/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
    });

    it('deve rejeitar atribuição duplicada', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.assignToClass.mockRejectedValue(
        new AppError('Instrutor já está atribuído a esta turma', 400)
      );
      
      const response = await request(app)
        .post('/api/instructors/1/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ id_turma: 5 });
      
      expect(response.status).toBe(400);
    });
  });

  describe('🗑️ DELETE /api/instructors/:id/classes/:classId - Desatribuir de Turma', () => {
    it('deve desatribuir instrutor de uma turma', async () => {
      InstructorService.unassignFromClass.mockResolvedValue(undefined);
      
      const response = await request(app)
        .delete('/api/instructors/1/classes/5')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(204);
    });

    it('deve retornar 404 se atribuição não existe', async () => {
      const AppError = (await import('../src/utils/AppError.js')).AppError;
      InstructorService.unassignFromClass.mockRejectedValue(
        new AppError('Instrutor não está atribuído a esta turma', 404)
      );
      
      const response = await request(app)
        .delete('/api/instructors/1/classes/999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('📊 GET /api/instructors/statistics - Estatísticas', () => {
    it('deve retornar estatísticas dos instrutores', async () => {
      const mockStats = {
        totalInstructors: 15,
        totalWithClasses: 12,
        totalWithoutClasses: 3,
        mostActiveInstructor: {
          id: 1,
          nome: 'Prof. João Silva',
          totalTurmas: 5
        }
      };

      InstructorService.getStatistics.mockResolvedValue(mockStats);
      
      const response = await request(app)
        .get('/api/instructors/statistics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockStats);
      expect(response.body.totalInstructors).toBe(15);
      expect(response.body.totalWithClasses).toBe(12);
    });
  });
});
