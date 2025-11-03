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

// Mock do ClassService (definido antes de ser usado)
vi.mock('../src/modules/classes/class.service.js', () => ({
  default: {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getStatistics: vi.fn(),
    checkConflict: vi.fn()
  }
}));

/**
 * Testes do Módulo de Turmas (Classes)
 * Seguindo o mesmo padrão dos testes de Cursos
 */
describe('Classes API - Testes Completos', () => {
  const authToken = 'mock-jwt-token-123';
  
  // Mock de dados de turma
  const mockClass = {
    id: 1,
    nome: 'Turma Python 2024-1',
    turno: 'MANHA',
    data_inicio: new Date('2024-01-15'),
    data_fim: new Date('2024-06-30'),
    id_curso: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    curso: {
      id: 1,
      nome: 'Python Fundamentals',
      carga_horaria: 40
    }
  };

  // Importar o mock do service
  let ClassService: any;

  beforeEach(async () => {
    // Importar dinamicamente após os mocks
    const module = await import('../src/modules/classes/class.service.js');
    ClassService = module.default;
    
    // Reset mocks antes de cada teste
    vi.clearAllMocks();
  });

  describe('🔐 Autenticação', () => {
    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app).get('/api/classes');
      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/classes')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });
  });

  describe('📋 GET /api/classes - Listar Turmas', () => {
    it('deve listar turmas com sucesso', async () => {
      ClassService.list.mockResolvedValue([mockClass]);

      const response = await request(app)
        .get('/api/classes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        nome: 'Turma Python 2024-1',
        turno: 'MANHA'
      });
    });

    it('deve listar turmas com filtro por nome', async () => {
      ClassService.list.mockResolvedValue([mockClass]);

      const response = await request(app)
        .get('/api/classes?nome=Python')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(ClassService.list).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Python' })
      );
    });

    it('deve listar turmas com filtro por turno', async () => {
      ClassService.list.mockResolvedValue([mockClass]);

      const response = await request(app)
        .get('/api/classes?turno=MANHA')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(ClassService.list).toHaveBeenCalledWith(
        expect.objectContaining({ turno: 'MANHA' })
      );
    });

    it('deve listar turmas com filtro por curso', async () => {
      ClassService.list.mockResolvedValue([mockClass]);

      const response = await request(app)
        .get('/api/classes?id_curso=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(ClassService.list).toHaveBeenCalledWith(
        expect.objectContaining({ id_curso: 1 })
      );
    });

    it('deve retornar lista vazia quando não há turmas', async () => {
      ClassService.list.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/classes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('🔍 GET /api/classes/:id - Buscar Turma', () => {
    it('deve buscar turma por ID com sucesso', async () => {
      ClassService.findById.mockResolvedValue(mockClass);

      const response = await request(app)
        .get('/api/classes/1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        nome: 'Turma Python 2024-1'
      });
      expect(response.body.curso).toBeDefined();
    });

    it('deve retornar 404 quando turma não existe', async () => {
      ClassService.findById.mockRejectedValue(
        new Error('Turma não encontrada')
      );

      const response = await request(app)
        .get('/api/classes/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('➕ POST /api/classes - Criar Turma', () => {
    const validClassData = {
      nome: 'Turma React 2024-2',
      turno: 'TARDE',
      data_inicio: '2024-07-01T00:00:00Z',
      data_fim: '2024-12-20T00:00:00Z',
      id_curso: 2,
      vagas: 30
    };

    it('deve criar turma com dados válidos', async () => {
      const createdClass = {
        id: 2,
        ...validClassData,
        data_inicio: new Date(validClassData.data_inicio),
        data_fim: new Date(validClassData.data_fim),
        createdAt: new Date(),
        updatedAt: new Date(),
        curso: {
          id: 2,
          nome: 'React Fundamentals',
          carga_horaria: 45
        }
      };

      ClassService.create.mockResolvedValue(createdClass);

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validClassData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: 2,
        nome: 'Turma React 2024-2',
        turno: 'TARDE'
      });
    });

    it('deve retornar 400 sem nome', async () => {
      const invalidData: any = { ...validClassData };
      delete invalidData.nome;

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 400 com nome muito curto', async () => {
      const invalidData = { ...validClassData, nome: 'AB' };

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 sem turno', async () => {
      const invalidData: any = { ...validClassData };
      delete invalidData.turno;

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 com turno inválido', async () => {
      const invalidData = { ...validClassData, turno: 'INVALIDO' };

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 sem id_curso', async () => {
      const invalidData: any = { ...validClassData };
      delete invalidData.id_curso;

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('deve retornar 404 quando curso não existe', async () => {
      ClassService.create.mockRejectedValue(
        new Error('Curso não encontrado')
      );

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validClassData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Curso não encontrado');
    });

    it('deve retornar 400 quando data_fim é anterior a data_inicio', async () => {
      const invalidData = {
        ...validClassData,
        data_inicio: '2024-12-01T00:00:00Z',
        data_fim: '2024-06-01T00:00:00Z'
      };

      const response = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('✏️ PUT /api/classes/:id - Atualizar Turma', () => {
    const updateData = {
      nome: 'Turma Python 2024-1 - Avançado',
      turno: 'NOITE'
    };

    it('deve atualizar turma com sucesso', async () => {
      const updatedClass = {
        ...mockClass,
        ...updateData,
        updatedAt: new Date()
      };

      ClassService.update.mockResolvedValue(updatedClass);

      const response = await request(app)
        .put('/api/classes/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        nome: 'Turma Python 2024-1 - Avançado',
        turno: 'NOITE'
      });
    });

    it('deve retornar 404 quando turma não existe', async () => {
      ClassService.update.mockRejectedValue(
        new Error('Turma não encontrada')
      );

      const response = await request(app)
        .put('/api/classes/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it('deve atualizar apenas nome', async () => {
      const partialUpdate = { nome: 'Novo Nome' };
      const updatedClass = { ...mockClass, ...partialUpdate };

      ClassService.update.mockResolvedValue(updatedClass);

      const response = await request(app)
        .put('/api/classes/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(partialUpdate);

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Novo Nome');
    });

    it('deve retornar 400 com turno inválido', async () => {
      const invalidData = { turno: 'INVALIDO' };

      const response = await request(app)
        .put('/api/classes/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('🗑️ DELETE /api/classes/:id - Deletar Turma', () => {
    it('deve deletar turma com sucesso', async () => {
      ClassService.delete.mockResolvedValue({
        message: 'Turma deletada com sucesso'
      });

      const response = await request(app)
        .delete('/api/classes/1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar 404 quando turma não existe', async () => {
      ClassService.delete.mockRejectedValue(
        new Error('Turma não encontrada')
      );

      const response = await request(app)
        .delete('/api/classes/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('📊 GET /api/classes/statistics - Estatísticas', () => {
    it('deve retornar estatísticas com sucesso', async () => {
      const mockStats = {
        total: 15,
        ativas: 8,
        encerradas: 7,
        porTurno: [
          { turno: 'MANHA', quantidade: 5 },
          { turno: 'TARDE', quantidade: 6 },
          { turno: 'NOITE', quantidade: 4 }
        ],
        porCurso: [
          {
            id_curso: 1,
            quantidade: 3,
            curso: { nome: 'Python Fundamentals' }
          }
        ]
      };

      ClassService.getStatistics.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/api/classes/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        total: 15,
        ativas: 8,
        encerradas: 7
      });
      expect(response.body.porTurno).toHaveLength(3);
      expect(response.body.porCurso).toHaveLength(1);
    });
  });

  describe('⚠️ POST /api/classes/check-conflict - Verificar Conflito', () => {
    const conflictData = {
      turno: 'MANHA',
      data_inicio: '2024-07-01T00:00:00Z',
      data_fim: '2024-12-20T00:00:00Z',
      nome: 'Teste',
      id_curso: 1,
      vagas: 25
    };

    it('deve verificar conflito sem encontrar', async () => {
      ClassService.checkConflict.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/classes/check-conflict')
        .set('Authorization', `Bearer ${authToken}`)
        .send(conflictData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ hasConflict: false });
    });

    it('deve verificar conflito e encontrar', async () => {
      ClassService.checkConflict.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/classes/check-conflict')
        .set('Authorization', `Bearer ${authToken}`)
        .send(conflictData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ hasConflict: true });
    });

    it('deve verificar conflito excluindo turma específica', async () => {
      ClassService.checkConflict.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/classes/check-conflict?excludeId=2')
        .set('Authorization', `Bearer ${authToken}`)
        .send(conflictData);

      expect(response.status).toBe(200);
      expect(ClassService.checkConflict).toHaveBeenCalledWith(
        expect.any(Object),
        2
      );
    });
  });

  describe('🎯 Testes de Integração', () => {
    it('deve listar, criar e buscar turma criada', async () => {
      // 1. Listar turmas inicial
      ClassService.list.mockResolvedValue([]);
      const listResponse1 = await request(app)
        .get('/api/classes')
        .set('Authorization', `Bearer ${authToken}`);
      expect(listResponse1.body).toHaveLength(0);

      // 2. Criar nova turma
      const newClass = {
        nome: 'Nova Turma',
        turno: 'TARDE',
        data_inicio: '2024-08-01T00:00:00Z',
        data_fim: '2024-12-15T00:00:00Z',
        id_curso: 1,
        vagas: 30
      };

      const createdClass = {
        id: 3,
        ...newClass,
        data_inicio: new Date(newClass.data_inicio),
        data_fim: new Date(newClass.data_fim),
        createdAt: new Date(),
        updatedAt: new Date(),
        curso: { id: 1, nome: 'Python', carga_horaria: 40 }
      };

      ClassService.create.mockResolvedValue(createdClass);
      const createResponse = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newClass);
      expect(createResponse.status).toBe(201);

      // 3. Buscar turma criada
      ClassService.findById.mockResolvedValue(createdClass);
      const findResponse = await request(app)
        .get('/api/classes/3')
        .set('Authorization', `Bearer ${authToken}`);
      expect(findResponse.status).toBe(200);
      expect(findResponse.body.nome).toBe('Nova Turma');
    });
  });
});
