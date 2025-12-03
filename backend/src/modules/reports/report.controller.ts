import { Request, Response } from 'express';
import ReportService from './report.service.js';
import { AppError } from '../../utils/AppError.js';

class ReportController {
  /**
   * Gera relatório de alunos em PDF
   */
  async generateStudentsPDF(req: Request, res: Response) {
    const { id_turma, data_inicio, data_fim } = req.query;

    const buffer = await ReportService.generateStudentsPDF({
      id_turma: id_turma ? Number(id_turma) : undefined,
      data_inicio: data_inicio as string,
      data_fim: data_fim as string,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-alunos-${Date.now()}.pdf`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de turmas em PDF
   */
  async generateClassesPDF(req: Request, res: Response) {
    const { id_curso, status } = req.query;

    const buffer = await ReportService.generateClassesPDF({
      id_curso: id_curso ? Number(id_curso) : undefined,
      status: status as string,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-turmas-${Date.now()}.pdf`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de frequência em PDF
   */
  async generateAttendancePDF(req: Request, res: Response) {
    const { id_turma, data_inicio, data_fim } = req.query;

    if (!id_turma) {
      throw new AppError('ID da turma é obrigatório', 400);
    }

    const buffer = await ReportService.generateAttendancePDF({
      id_turma: Number(id_turma),
      data_inicio: data_inicio as string,
      data_fim: data_fim as string,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-frequencia-${Date.now()}.pdf`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de cursos em PDF
   */
  async generateCoursesPDF(req: Request, res: Response) {
    const buffer = await ReportService.generateCoursesPDF({});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-cursos-${Date.now()}.pdf`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de alunos em Excel
   */
  async generateStudentsExcel(req: Request, res: Response) {
    const { id_turma } = req.query;

    const buffer = await ReportService.generateStudentsExcel({
      id_turma: id_turma ? Number(id_turma) : undefined,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-alunos-${Date.now()}.xlsx`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de turmas em Excel
   */
  async generateClassesExcel(req: Request, res: Response) {
    const { id_curso, status } = req.query;

    const buffer = await ReportService.generateClassesExcel({
      id_curso: id_curso ? Number(id_curso) : undefined,
      status: status as string,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-turmas-${Date.now()}.xlsx`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de frequência em Excel
   */
  async generateAttendanceExcel(req: Request, res: Response) {
    const { id_turma, data_inicio, data_fim } = req.query;

    if (!id_turma) {
      throw new AppError('ID da turma é obrigatório', 400);
    }

    const buffer = await ReportService.generateAttendanceExcel({
      id_turma: Number(id_turma),
      data_inicio: data_inicio as string,
      data_fim: data_fim as string,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-frequencia-${Date.now()}.xlsx`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de instrutores em PDF
   */
  async generateInstructorsPDF(req: Request, res: Response) {
    const buffer = await ReportService.generateInstructorsPDF({});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-instrutores-${Date.now()}.pdf`
    );
    res.send(buffer);
  }

  /**
   * Gera relatório de instrutores em Excel
   */
  async generateInstructorsExcel(req: Request, res: Response) {
    const buffer = await ReportService.generateInstructorsExcel({});

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-instrutores-${Date.now()}.xlsx`
    );
    res.send(buffer);
  }

  /**
   * Busca estatísticas do dashboard
   */
  async getDashboardStats(req: Request, res: Response) {
    const { data_inicio, data_fim, id_curso, id_turma } = req.query;

    const stats = await ReportService.getDashboardStats({
      data_inicio: data_inicio as string,
      data_fim: data_fim as string,
      id_curso: id_curso ? Number(id_curso) : undefined,
      id_turma: id_turma ? Number(id_turma) : undefined,
    });

    res.status(200).json(stats);
  }
}

export default new ReportController();
