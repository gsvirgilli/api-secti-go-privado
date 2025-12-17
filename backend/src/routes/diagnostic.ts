import { Router } from 'express';
import Student from '../modules/students/student.model.js';
import Class from '../modules/classes/class.model.js';
import Enrollment from '../modules/enrollments/enrollment.model.js';
import { sequelize } from '../config/database.js';
import { Op, QueryTypes } from 'sequelize';

const diagnosticRouter = Router();

/**
 * Diagnóstico de dados - Verificar sincronização entre alunos e turmas
 */
diagnosticRouter.get('/data-sync', async (req, res) => {
  try {
    // Contar dados
    const totalStudents = await Student.count();
    const studentsWithTurmaId = await Student.count({
      where: {
        turma_id: {
          [Op.not]: null
        }
      }
    });
    const totalEnrollments = await Enrollment.count();
    const totalClasses = await Class.count();

    // Listar alunos
    const students = await Student.findAll({
      attributes: ['id', 'nome', 'turma_id'],
      order: [['id', 'ASC']],
      raw: true
    });

    // Listar turmas
    const classes = await Class.findAll({
      attributes: ['id', 'nome'],
      order: [['id', 'ASC']],
      raw: true
    });

    // Listar matrículas
    const enrollments = await Enrollment.findAll({
      attributes: ['idAluno', 'idTurma', 'status'],
      order: [['idAluno', 'ASC']],
      raw: true
    });

    // Turmas com alunos (usando turma_id)
    const classesWithStudents = await Class.findAll({
      include: [
        {
          model: Student,
          as: 'alunos',
          attributes: ['id', 'nome'],
          required: false
        }
      ],
      order: [['id', 'ASC']]
    });

    return res.json({
      summary: {
        totalStudents,
        studentsWithTurmaId,
        totalEnrollments,
        totalClasses
      },
      students,
      classes,
      enrollments,
      classesWithStudents: classesWithStudents.map(c => {
        const data = c.toJSON() as any;
        return {
          id: data.id,
          nome: data.nome,
          alunosCount: data.alunos?.length || 0,
          alunos: data.alunos || []
        };
      })
    });
  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    return res.status(500).json({ error: String(error) });
  }
});

/**
 * Fix rápido: Sincronizar turma_id dos alunos com a tabela matriculas E candidatos
 */
diagnosticRouter.post('/fix-turma-sync', async (req, res) => {
  try {
    console.log('🔧 Iniciando sincronização de alunos com turmas...');

    // 1. Alunos sem turma_id mas com matriculas
    const result1 = await sequelize.query(`
      UPDATE alunos a
      SET turma_id = (
        SELECT id_turma 
        FROM matriculas m 
        WHERE m.id_aluno = a.id 
        LIMIT 1
      )
      WHERE turma_id IS NULL 
        AND EXISTS (
          SELECT 1 FROM matriculas m WHERE m.id_aluno = a.id
        )
    `);

    console.log('✓ Sincronização via matriculas completa');

    // 2. Alunos sem turma_id mas com candidato que tem turma_id
    const result2 = await sequelize.query(`
      UPDATE alunos a
      SET turma_id = (
        SELECT turma_id 
        FROM candidatos c 
        WHERE c.id = a.candidato_id
        LIMIT 1
      )
      WHERE turma_id IS NULL 
        AND candidato_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM candidatos c 
          WHERE c.id = a.candidato_id AND c.turma_id IS NOT NULL
        )
    `);

    console.log('✓ Sincronização via candidatos completa');

    // 3. Recount
    const studentsWithTurmaId = await Student.count({
      where: { turma_id: { [Op.not]: null } }
    });

    const studentsWithoutTurmaId = await Student.count({
      where: { turma_id: null }
    });

    // 4. Detalhar por turma
    const studentsByClass = await sequelize.query(`
      SELECT t.id, t.nome, COUNT(a.id) as total_alunos
      FROM turmas t
      LEFT JOIN alunos a ON a.turma_id = t.id
      GROUP BY t.id, t.nome
      ORDER BY t.id
    `, { type: QueryTypes.SELECT });

    return res.json({
      success: true,
      summary: {
        totalWithTurmaId: studentsWithTurmaId,
        totalWithoutTurmaId: studentsWithoutTurmaId
      },
      studentsByClass,
      message: 'Sincronização completada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
    return res.status(500).json({ error: String(error) });
  }
});

export default diagnosticRouter;

