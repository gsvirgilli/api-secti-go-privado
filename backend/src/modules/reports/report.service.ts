import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import Course from '../courses/course.model.js';
import Instructor from '../instructors/instructor.model.js';
import Attendance from '../attendance/attendance.model.js';
import Enrollment from '../enrollments/enrollment.model.js';
import Candidate from '../Candidates/candidate.model.js';
import { Op } from 'sequelize';
import { AppError } from '../../utils/AppError.js';

interface ReportFilters {
  data_inicio?: string;
  data_fim?: string;
  id_curso?: number;
  id_turma?: number;
  status?: string;
  id_instrutor?: number;
}

// Tipos auxiliares para incluir associações
type StudentWithRelations = Student & {
  matriculas?: Array<any>;
  data_nascimento?: string;
};

type ClassWithRelations = Class & {
  curso?: any;
  instrutor?: any;
  matriculas?: Array<any>;
  vagas_totais?: number;
  vagas_disponiveis?: number;
};

type CourseWithRelations = Course & {
  turmas?: Array<any>;
};

type AttendanceWithRelations = Attendance & {
  aluno?: any;
};

interface DashboardStats {
  total_alunos: number;
  alunos_ativos: number;
  taxa_atividade: number;
  cursos_ativos: number;
  total_turmas: number;
  turmas_ativas: number;
  total_matriculas: number;
  taxa_aprovacao_candidatos: number;
  alunos_por_curso: Array<{
    curso: string;
    total: number;
  }>;
  matriculas_mensais: Array<{
    mes: string;
    total: number;
  }>;
}

class ReportService {
  /**
   * Gera relatório de alunos em PDF
   */
  async generateStudentsPDF(filters: ReportFilters): Promise<Buffer> {
    const where: any = {};

    // Aplicar filtros
    if (filters.id_turma) {
      // Buscar alunos matriculados na turma específica
      const enrollments: any[] = await Enrollment.findAll({
        where: { id_turma: filters.id_turma },
        attributes: ['id_aluno'],
      });
      const studentIds = enrollments.map((e:any) => e.id_aluno);
      if (studentIds.length > 0) {
        where.id = { [Op.in]: studentIds };
      } else {
        // Se não houver alunos, retornar array vazio
        where.id = { [Op.in]: [-1] }; // ID impossível para retornar vazio
      }
    }

    const students: any[] = await Student.findAll({
      where,
      order: [['nome', 'ASC']],
    });

    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc
          .fontSize(20)
          .fillColor('#667eea')
          .text('Relatório de Alunos', { align: 'center' });

        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .fillColor('#666')
          .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, {
            align: 'center',
          });

        doc.moveDown(2);

        // Filtros aplicados
        if (filters.id_turma) {
          doc
            .fontSize(12)
            .fillColor('#333')
            .text(`Filtro: Turma ID ${filters.id_turma}`);
          doc.moveDown(1);
        }

        // Tabela de alunos
        doc.fontSize(14).fillColor('#333').text('Lista de Alunos', {
          underline: true,
        });
        doc.moveDown(1);

        let pageCount = 1;
        students.forEach((student: any, index: number) => {
          // Quebra de página se necessário
          if (doc.y > 700) {
            doc.addPage();
            pageCount++;
          }

          doc
            .fontSize(12)
            .fillColor('#667eea')
            .text(`${index + 1}. ${student.nome}`, { continued: false });

          doc
            .fontSize(10)
            .fillColor('#666')
            .text(`   CPF: ${student.cpf}`, { continued: true })
            .text(`   |   Email: ${student.email}`);

          doc.text(`   Matrícula: ${student.matricula}`);
          doc.text(`   Status: ${student.status || 'N/A'}`);

          doc.moveDown(0.5);
        });

        // Footer - adicionar em todas as páginas criadas
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor('#999')
            .text(
              `Página ${i + 1} de ${totalPages} | SECTI - Sistema de Gestão`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gera relatório de turmas em PDF
   */
  async generateClassesPDF(filters: ReportFilters): Promise<Buffer> {
    const where: any = {};

    if (filters.id_curso) {
      where.id_curso = filters.id_curso;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const classes: any[] = await Class.findAll({
      where,
      include: [
        {
          model: Course,
          as: 'curso',
        },
        {
          model: Instructor,
          as: 'instrutores',
        },
        {
          model: Enrollment,
          as: 'matriculas',
        },
      ],
      order: [['nome', 'ASC']],
    });

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc
          .fontSize(20)
          .fillColor('#667eea')
          .text('Relatório de Turmas', { align: 'center' });

        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .fillColor('#666')
          .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, {
            align: 'center',
          });

        doc.moveDown(2);

        // Estatísticas gerais
        doc
          .fontSize(14)
          .fillColor('#333')
          .text('Estatísticas Gerais', { underline: true });
        doc.moveDown(0.5);

        const totalTurmas = classes.length;
        const turmasAtivas = classes.filter((c) => c.status === 'ATIVA').length;
        const totalAlunos = classes.reduce(
          (sum, c) => sum + (c.matriculas?.length || 0),
          0
        );

        doc.fontSize(11).fillColor('#666');
        doc.text(`Total de Turmas: ${totalTurmas}`, { continued: true });
        doc.text(`   |   Turmas Ativas: ${turmasAtivas}`);
        doc.text(`Total de Alunos Matriculados: ${totalAlunos}`);
        doc.moveDown(2);

        // Tabela de turmas
        doc.fontSize(14).fillColor('#333').text('Detalhes das Turmas', {
          underline: true,
        });
        doc.moveDown(1);

        let pageCount = 1;
        classes.forEach((turma, index) => {
          // Quebra de página se necessário
          if (doc.y > 650) {
            doc.addPage();
            pageCount++;
          }

          doc
            .fontSize(12)
            .fillColor('#667eea')
            .text(`${index + 1}. ${turma.nome}`, { continued: false });

          doc.fontSize(10).fillColor('#666');
          doc.text(`   Curso: ${turma.curso?.nome || 'N/A'}`, {
            continued: true,
          });
          doc.text(`   |   Turno: ${turma.turno}`);

          doc.text(`   Status: ${turma.status}`, { continued: true });
          doc.text(
            `   |   Vagas: ${turma.vagas_disponiveis} de ${turma.vagas_totais}`
          );

          doc.text(
            `   Período: ${turma.data_inicio || 'N/A'} até ${
              turma.data_fim || 'N/A'
            }`
          );

          if (turma.instrutores && turma.instrutores.length > 0) {
            const instrutoresNomes = turma.instrutores.map((i: any) => i.nome).join(', ');
            doc.text(`   Instrutores: ${instrutoresNomes}`);
          }

          doc.text(`   Alunos Matriculados: ${turma.matriculas?.length || 0}`);

          doc.moveDown(1);
        });

        // Footer - adicionar em todas as páginas criadas
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor('#999')
            .text(
              `Página ${i + 1} de ${totalPages} | SECTI - Sistema de Gestão`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gera relatório de frequência em PDF
   */
  async generateAttendancePDF(filters: ReportFilters): Promise<Buffer> {
    if (!filters.id_turma) {
      throw new AppError('ID da turma é obrigatório para relatório de frequência', 400);
    }

    const turma: any = await Class.findByPk(filters.id_turma, {
      include: [
        {
          model: Course,
          as: 'curso',
        },
      ],
    });

    if (!turma) {
      throw new AppError('Turma não encontrada', 404);
    }

    const whereAttendance: any = { id_turma: filters.id_turma };

    if (filters.data_inicio && filters.data_fim) {
      whereAttendance.data = {
        [Op.between]: [filters.data_inicio, filters.data_fim],
      };
    }

    const attendances: any[] = await Attendance.findAll({
      where: whereAttendance,
      include: [
        {
          model: Student,
          as: 'aluno',
        },
      ],
      order: [['data', 'DESC']],
    });

    // Calcular estatísticas
    const studentStats = new Map<
      number,
      {
        nome: string;
        total: number;
        presente: number;
        ausente: number;
        justificado: number;
      }
    >();

    attendances.forEach((att) => {
      if (!studentStats.has(att.id_aluno)) {
        studentStats.set(att.id_aluno, {
          nome: att.aluno?.nome || 'N/A',
          total: 0,
          presente: 0,
          ausente: 0,
          justificado: 0,
        });
      }
      const stats = studentStats.get(att.id_aluno)!;
      stats.total++;
      if (att.status === 'PRESENTE') stats.presente++;
      if (att.status === 'AUSENTE') stats.ausente++;
      if (att.status === 'JUSTIFICADO') stats.justificado++;
    });

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc
          .fontSize(20)
          .fillColor('#667eea')
          .text('Relatório de Frequência', { align: 'center' });

        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .fillColor('#666')
          .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, {
            align: 'center',
          });

        doc.moveDown(2);

        // Informações da turma
        doc.fontSize(12).fillColor('#333');
        doc.text(`Turma: ${turma.nome}`, { continued: true });
        doc.text(`   |   Curso: ${turma.curso?.nome || 'N/A'}`);

        if (filters.data_inicio && filters.data_fim) {
          doc.text(
            `Período: ${filters.data_inicio} até ${filters.data_fim}`
          );
        }

        doc.moveDown(2);

        // Estatísticas por aluno
        doc.fontSize(14).fillColor('#333').text('Frequência por Aluno', {
          underline: true,
        });
        doc.moveDown(1);

        let pageCount = 1;
        Array.from(studentStats.entries()).forEach(([id, stats], index) => {
          if (doc.y > 700) {
            doc.addPage();
            pageCount++;
          }

          const percentual = ((stats.presente / stats.total) * 100).toFixed(1);

          doc.fontSize(11).fillColor('#667eea').text(`${index + 1}. ${stats.nome}`);

          doc.fontSize(10).fillColor('#666');
          doc.text(
            `   Total de Aulas: ${stats.total}   |   Presença: ${percentual}%`
          );
          doc.text(
            `   Presente: ${stats.presente}   Ausente: ${stats.ausente}   Justificado: ${stats.justificado}`
          );

          doc.moveDown(0.5);
        });

        // Footer - adicionar em todas as páginas criadas
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor('#999')
            .text(
              `Página ${i + 1} de ${totalPages} | SECTI - Sistema de Gestão`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gera relatório de cursos em PDF
   */
  async generateCoursesPDF(filters: ReportFilters): Promise<Buffer> {
    const courses: any[] = await Course.findAll({
      include: [
        {
          model: Class,
          as: 'turmas',
          include: [
            {
              model: Enrollment,
              as: 'matriculas',
            },
          ],
        },
      ],
      order: [['nome', 'ASC']],
    });

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc
          .fontSize(20)
          .fillColor('#667eea')
          .text('Relatório de Cursos', { align: 'center' });

        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .fillColor('#666')
          .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, {
            align: 'center',
          });

        doc.moveDown(2);

        // Estatísticas
        const totalCursos = courses.length;
        const totalTurmas = courses.reduce(
          (sum, c) => sum + (c.turmas?.length || 0),
          0
        );

        doc.fontSize(12).fillColor('#666');
        doc.text(`Total de Cursos: ${totalCursos}`, { continued: true });
        doc.text(`   |   Total de Turmas: ${totalTurmas}`);
        doc.moveDown(2);

        // Detalhes dos cursos
        doc.fontSize(14).fillColor('#333').text('Detalhes dos Cursos', {
          underline: true,
        });
        doc.moveDown(1);

        courses.forEach((course, index) => {
          if (doc.y > 650) {
            doc.addPage();
          }

          const totalAlunos = course.turmas?.reduce(
            (sum, t) => sum + (t.matriculas?.length || 0),
            0
          );

          doc
            .fontSize(12)
            .fillColor('#667eea')
            .text(`${index + 1}. ${course.nome}`);

          doc.fontSize(10).fillColor('#666');
          doc.text(`   Carga Horária: ${course.carga_horaria}h`, {
            continued: true,
          });
          doc.text(`   |   Turmas: ${course.turmas?.length || 0}`);

          if (course.descricao) {
            doc.text(`   Descrição: ${course.descricao}`);
          }

          doc.text(`   Total de Alunos: ${totalAlunos || 0}`);

          doc.moveDown(1);
        });

        // Footer - adicionar após todo o conteúdo ser renderizado
        const pages = doc.bufferedPageRange().count;
        for (let i = 0; i < pages; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor('#999')
            .text(
              `Página ${i + 1} de ${pages} | SECTI - Sistema de Gestão`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gera relatório de alunos em Excel
   */
  async generateStudentsExcel(filters: ReportFilters): Promise<Buffer> {
    const where: any = {};

    if (filters.id_turma) {
      const enrollments: any[] = await Enrollment.findAll({
        where: { id_turma: filters.id_turma },
        attributes: ['id_aluno'],
      });
      const studentIds = enrollments.map((e: any) => e.id_aluno);
      if (studentIds.length > 0) {
        where.id = { [Op.in]: studentIds };
      } else {
        where.id = { [Op.in]: [-1] };
      }
    }

    const students = await Student.findAll({
      where,
      order: [['nome', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Alunos');

    // Estilizar o header
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'CPF', key: 'cpf', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Matrícula', key: 'matricula', width: 15 },
      { header: 'Data Nascimento', key: 'data_nascimento', width: 18 },
      { header: 'Turmas', key: 'turmas', width: 40 },
    ];

    // Estilizar header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Adicionar dados
    students.forEach((student: any) => {
      worksheet.addRow({
        id: student.id,
        nome: student.nome,
        cpf: student.cpf,
        email: student.email,
        matricula: student.matricula,
        data_nascimento: 'N/A',
        turmas: 'N/A',
      });
    });

    // Adicionar bordas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }

  /**
   * Gera relatório de turmas em Excel
   */
  async generateClassesExcel(filters: ReportFilters): Promise<Buffer> {
    const where: any = {};

    if (filters.id_curso) {
      where.id_curso = filters.id_curso;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const classes = await Class.findAll({
      where,
      include: [
        { model: Course, as: 'curso' },
        { model: Instructor, as: 'instrutores' },
        { model: Enrollment, as: 'matriculas' },
      ],
      order: [['nome', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Turmas');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nome', key: 'nome', width: 25 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Turno', key: 'turno', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Data Início', key: 'data_inicio', width: 15 },
      { header: 'Data Fim', key: 'data_fim', width: 15 },
      { header: 'Instrutor', key: 'instrutor', width: 25 },
      { header: 'Vagas Totais', key: 'vagas_totais', width: 15 },
      { header: 'Vagas Disponíveis', key: 'vagas_disponiveis', width: 18 },
      { header: 'Alunos Matriculados', key: 'alunos', width: 20 },
    ];

    // Estilizar header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Adicionar dados
    classes.forEach((turma: any) => {
      const instrutoresNomes = turma.instrutores && turma.instrutores.length > 0
        ? turma.instrutores.map((i: any) => i.nome).join(', ')
        : 'Não atribuído';
      
      worksheet.addRow({
        id: turma.id,
        nome: turma.nome,
        curso: turma.curso?.nome || 'N/A',
        turno: turma.turno,
        status: turma.status,
        data_inicio: turma.data_inicio || 'N/A',
        data_fim: turma.data_fim || 'N/A',
        instrutor: instrutoresNomes,
        vagas_totais: turma.vagas_totais,
        vagas_disponiveis: turma.vagas_disponiveis,
        alunos: turma.matriculas?.length || 0,
      });
    });

    // Adicionar bordas
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }

  /**
   * Gera relatório de frequência em Excel
   */
  async generateAttendanceExcel(filters: ReportFilters): Promise<Buffer> {
    if (!filters.id_turma) {
      throw new AppError('ID da turma é obrigatório', 400);
    }

    const whereAttendance: any = { id_turma: filters.id_turma };

    if (filters.data_inicio && filters.data_fim) {
      whereAttendance.data = {
        [Op.between]: [filters.data_inicio, filters.data_fim],
      };
    }

    const attendances = await Attendance.findAll({
      where: whereAttendance,
      include: [{ model: Student, as: 'aluno' }],
      order: [['data', 'DESC'], ['id_aluno', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Frequência');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Data', key: 'data', width: 15 },
      { header: 'Aluno', key: 'aluno', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Observações', key: 'observacoes', width: 40 },
    ];

    // Estilizar header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Adicionar dados
    attendances.forEach((att: any) => {
      const row = worksheet.addRow({
        id: att.id,
        data: att.data,
        aluno: att.aluno?.nome || 'N/A',
        status: att.status,
        observacoes: att.observacoes || '-',
      });

      // Colorir status
      const statusCell = row.getCell('status');
      if (att.status === 'PRESENTE') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF90EE90' },
        };
      } else if (att.status === 'AUSENTE') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCCCB' },
        };
      } else if (att.status === 'JUSTIFICADO') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFE0' },
        };
      }
    });

    // Adicionar bordas
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }

  /**
   * Busca estatísticas do dashboard
   */
  async getDashboardStats(filters: ReportFilters): Promise<DashboardStats> {
    // Total de alunos
    const total_alunos = await Student.count();

    // Alunos ativos (considerando todos com status 'ativo')
    const alunos_ativos = await Student.count({
      where: { status: 'ativo' }
    });

    // Taxa de atividade
    const taxa_atividade = total_alunos > 0
      ? Math.round((alunos_ativos / total_alunos) * 100)
      : 0;

    // Cursos ativos
    const cursos_ativos = await Course.count();

    // Total de turmas
    const total_turmas = await Class.count();

    // Turmas ativas
    const turmas_ativas = await Class.count({ where: { status: 'ATIVA' } });

    // Total de matrículas
    const total_matriculas = await Enrollment.count();

    // Taxa de aprovação de candidatos
    const totalCandidatos = await Candidate.count();
    const candidatosAprovados = await Candidate.count({
      where: { status: 'aprovado' },
    });
    const taxa_aprovacao_candidatos = totalCandidatos > 0
      ? Math.round((candidatosAprovados / totalCandidatos) * 100)
      : 0;

    // Alunos por curso (simplificado - contando turmas por curso)
    const courses: any[] = await Course.findAll({
      attributes: ['id', 'nome']
    });

    const alunos_por_curso = await Promise.all(courses.map(async (course: any) => {
      // Conta alunos através das turmas do curso
      const turmas: any[] = await Class.findAll({
        where: { id_curso: course.id },
        attributes: ['id']
      });
      
      const turmaIds = turmas.map(t => t.id);
      const totalAlunos = turmaIds.length > 0 ? await Enrollment.count({
        where: { id_turma: { [Op.in]: turmaIds } }
      }) : 0;

      return {
        curso: course.nome,
        total: totalAlunos
      };
    }));

    // Matrículas mensais (últimos 12 meses)
    const matriculas_mensais: Array<{ mes: string; total: number }> = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      
      const count = await Enrollment.count({
        where: {
          createdAt: {
            [Op.gte]: date,
            [Op.lt]: nextDate,
          },
        },
      });

      matriculas_mensais.push({
        mes: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        total: count,
      });
    }

    return {
      total_alunos,
      alunos_ativos,
      taxa_atividade,
      cursos_ativos,
  /**
   * Gera relatório de instrutores em PDF
   */
  async generateInstructorsPDF(filters: ReportFilters): Promise<Buffer> {
    const instructors: any[] = await Instructor.findAll({
      include: [
        {
          model: Class,
          as: 'turmas',
          through: { attributes: [] },
        },
      ],
      order: [['nome', 'ASC']],
    });

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc
          .fontSize(20)
          .fillColor('#667eea')
          .text('Relatório de Instrutores', { align: 'center' });

        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .fillColor('#666')
          .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, {
            align: 'center',
          });

        doc.moveDown(2);

        // Estatísticas
        const totalInstrutores = instructors.length;
        const instrutoresAtivos = instructors.filter(i => i.status === 'ATIVO').length;
        const totalTurmas = instructors.reduce(
          (sum, i) => sum + (i.turmas?.length || 0),
          0
        );

        doc.fontSize(12).fillColor('#666');
        doc.text(`Total de Instrutores: ${totalInstrutores}`, { continued: true });
        doc.text(`   |   Instrutores Ativos: ${instrutoresAtivos}`);
        doc.text(`Total de Turmas Associadas: ${totalTurmas}`);
        doc.moveDown(2);

        // Detalhes dos instrutores
        doc.fontSize(14).fillColor('#333').text('Detalhes dos Instrutores', {
          underline: true,
        });
        doc.moveDown(1);

        instructors.forEach((instructor, index) => {
          if (doc.y > 650) {
            doc.addPage();
          }

          doc
            .fontSize(12)
            .fillColor('#667eea')
            .text(`${index + 1}. ${instructor.nome}`);

          doc.fontSize(10).fillColor('#666');
          doc.text(`   CPF: ${instructor.cpf}`, { continued: true });
          doc.text(`   |   Email: ${instructor.email}`);

          doc.text(`   Telefone: ${instructor.telefone || 'N/A'}`);
          doc.text(`   Especialidade: ${instructor.especialidade || 'N/A'}`);
          doc.text(`   Status: ${instructor.status}`);
          
          if (instructor.turmas && instructor.turmas.length > 0) {
            doc.text(`   Turmas: ${instructor.turmas.length}`);
          }

          doc.moveDown(1);
        });

        // Footer
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor('#999')
            .text(
              `Página ${i + 1} de ${totalPages} | SECTI - Sistema de Gestão`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gera relatório de instrutores em Excel
   */
  async generateInstructorsExcel(filters: ReportFilters): Promise<Buffer> {
    const instructors: any[] = await Instructor.findAll({
      include: [
        {
          model: Class,
          as: 'turmas',
          through: { attributes: [] },
        },
      ],
      order: [['nome', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Instrutores');

    // Header
    worksheet.columns = [
      { header: '#', key: 'id', width: 10 },
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'CPF', key: 'cpf', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Telefone', key: 'telefone', width: 15 },
      { header: 'Especialidade', key: 'especialidade', width: 25 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Turmas', key: 'turmas_count', width: 10 },
    ];

    // Style header
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667eea' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data
    instructors.forEach((instructor, index) => {
      worksheet.addRow({
        id: index + 1,
        nome: instructor.nome,
        cpf: instructor.cpf,
        email: instructor.email,
        telefone: instructor.telefone || '-',
        especialidade: instructor.especialidade || '-',
        status: instructor.status,
        turmas_count: instructor.turmas?.length || 0,
      });
    });

    // Add summary
    const lastRow = instructors.length + 3;
    worksheet.addRow({
      id: 'TOTAL',
      nome: `Total: ${instructors.length} instrutores`,
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }

      total_turmas,
      turmas_ativas,
      total_matriculas,
      taxa_aprovacao_candidatos,
      alunos_por_curso,
      matriculas_mensais,
    };
  }
}

export default new ReportService();
