import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SUKATECH API - Sistema de Gestão de Cursos',
      version: '1.0.0',
      description: `
        API REST completa para o sistema de gestão de cursos da **SUKATECH**.
        
        ## Recursos Principais
        
        - 🔐 **Autenticação JWT** - Sistema seguro de login e autorização
        - 📚 **Cursos** - CRUD completo + endpoints públicos
        - 🏫 **Turmas** - Gestão de turmas com controle de vagas
        - 📝 **Candidatura Pública** - Sistema de inscrição sem autenticação
        - 👨‍🎓 **Alunos** - Gestão completa de alunos
        - 📋 **Matrículas** - Sistema com controle automático de vagas
        - ✅ **Presença** - Registro de presença, estatísticas e relatórios
        
        ## Autenticação
        
        A maioria dos endpoints requer autenticação via JWT Token.
        
        1. Faça login em \`POST /api/auth/login\`
        2. Copie o token retornado
        3. Clique em "Authorize" 🔒 no topo da página
        4. Cole o token no formato: \`Bearer seu-token-aqui\`
        
        ## Contato
        
        - **Equipe**: G07-SECTI
        - **Residência em TIC** - Turma 1
      `,
      contact: {
        name: 'Equipe G07-SECTI',
        email: 'sukatech@exemplo.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.sukatech.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /api/auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            error: {
              type: 'string',
              description: 'Detalhes do erro'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome completo'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'INSTRUTOR', 'COORDENADOR'],
              description: 'Papel do usuário'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 100
            },
            descricao: {
              type: 'string',
              nullable: true
            },
            carga_horaria: {
              type: 'integer',
              minimum: 1,
              description: 'Carga horária em horas'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Class: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 100
            },
            turno: {
              type: 'string',
              enum: ['MATUTINO', 'VESPERTINO', 'NOTURNO']
            },
            data_inicio: {
              type: 'string',
              format: 'date',
              nullable: true
            },
            data_fim: {
              type: 'string',
              format: 'date',
              nullable: true
            },
            vagas: {
              type: 'integer',
              minimum: 0,
              description: 'Número de vagas disponíveis'
            },
            id_curso: {
              type: 'integer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            matricula: {
              type: 'string',
              description: 'Matrícula única do aluno'
            },
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 100
            },
            cpf: {
              type: 'string',
              pattern: '^\\d{11}$',
              description: 'CPF com 11 dígitos'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            telefone: {
              type: 'string',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            id_aluno: {
              type: 'integer'
            },
            id_turma: {
              type: 'integer'
            },
            data_matricula: {
              type: 'string',
              format: 'date-time'
            },
            status: {
              type: 'string',
              enum: ['ATIVO', 'CANCELADO', 'CONCLUIDO'],
              default: 'ATIVO'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            id_aluno: {
              type: 'integer'
            },
            id_turma: {
              type: 'integer'
            },
            data_chamada: {
              type: 'string',
              format: 'date',
              description: 'Data da chamada'
            },
            status: {
              type: 'string',
              enum: ['PRESENTE', 'AUSENTE', 'JUSTIFICADO']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Candidate: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 100
            },
            cpf: {
              type: 'string',
              pattern: '^\\d{11}$'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            telefone: {
              type: 'string',
              nullable: true
            },
            curso_id: {
              type: 'integer',
              description: 'ID do curso desejado'
            },
            turno: {
              type: 'string',
              enum: ['MATUTINO', 'VESPERTINO', 'NOTURNO']
            },
            status: {
              type: 'string',
              enum: ['PENDENTE', 'APROVADO', 'REPROVADO'],
              default: 'PENDENTE'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check do sistema'
      },
      {
        name: 'Auth',
        description: 'Autenticação e autorização'
      },
      {
        name: 'Courses',
        description: 'Gestão de cursos (CRUD completo + endpoints públicos)'
      },
      {
        name: 'Classes',
        description: 'Gestão de turmas com controle de vagas'
      },
      {
        name: 'Students',
        description: 'Gestão de alunos'
      },
      {
        name: 'Enrollments',
        description: 'Sistema de matrículas com controle automático de vagas'
      },
      {
        name: 'Attendance',
        description: 'Sistema de presença, estatísticas e relatórios'
      },
      {
        name: 'Candidates',
        description: 'Sistema de candidatura pública'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/modules/**/*.routes.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
