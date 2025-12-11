import { Router } from 'express';
import Student from '../modules/students/student.model.js';
import Class from '../modules/classes/class.model.js';
import Enrollment from '../modules/enrollments/enrollment.model.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

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
      attributes: ['id_aluno', 'id_turma', 'status'],
      order: [['id_aluno', 'ASC']],
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
 * Fix rápido: Sincronizar turma_id dos alunos com a tabela matriculas
 */
diagnosticRouter.post('/fix-turma-sync', async (req, res) => {
  try {
    console.log('🔧 Iniciando sincronização...');

    // 1. Para cada aluno, buscar sua turma_id da tabela matriculas
    const students = await Student.findAll({
      where: { turma_id: null },
      attributes: ['id']
    });

    console.log(`Found ${students.length} students with turma_id = NULL`);

    let updated = 0;
    for (const student of students) {
      const enrollment = await Enrollment.findOne({
        where: { id_aluno: student.id },
        attributes: ['id_turma'],
        order: [['createdAt', 'ASC']]
      });

      if (enrollment) {
        await student.update({ turma_id: enrollment.id_turma });
        updated++;
        console.log(`✓ Student ${student.id} updated with turma_id ${enrollment.id_turma}`);
      }
    }

    // 2. Recount
    const studentsWithTurmaId = await Student.count({
      where: { turma_id: { [Op.not]: null } }
    });

    return res.json({
      success: true,
      updated,
      totalWithTurmaId: studentsWithTurmaId,
      message: `${updated} alunos sincronizados com sucesso`
    });
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
    return res.status(500).json({ error: String(error) });
  }
});

export default diagnosticRouter;

