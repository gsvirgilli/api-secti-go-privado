import NotificationCenterService from '../modules/notifications/notification-center.service.js';

/**
 * Helper para criar notificações importantes
 */
class NotificationHelper {
  /**
   * Notificação: Novo aluno cadastrado
   */
  async notifyNewStudent(alunoNome: string, turmaNome: string) {
    try {
      await NotificationCenterService.create({
        titulo: 'Novo aluno cadastrado',
        descricao: `${alunoNome} foi matriculado na turma ${turmaNome}`,
        tipo: 'ALUNO',
        icone: 'User',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de novo aluno:', error);
    }
  }

  /**
   * Notificação: Turma concluída
   */
  async notifyClassCompleted(turmaNome: string, curseName: string) {
    try {
      await NotificationCenterService.create({
        titulo: 'Turma concluída',
        descricao: `A turma "${turmaNome}" do curso "${curseName}" finalizou o curso`,
        tipo: 'TURMA',
        icone: 'CheckCircle',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de turma concluída:', error);
    }
  }

  /**
   * Notificação: Instrutor adicionado
   */
  async notifyInstructorAdded(instructorNome: string, especialidade: string) {
    try {
      await NotificationCenterService.create({
        titulo: 'Instrutor adicionado',
        descricao: `${instructorNome} foi cadastrado como instrutor de ${especialidade}`,
        tipo: 'INSTRUTOR',
        icone: 'Users',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de instrutor adicionado:', error);
    }
  }

  /**
   * Notificação: Evento do calendário próximo
   */
  async notifyUpcomingCalendarEvent(titulo: string, tipo: string, diasRestantes: number) {
    try {
      const diasTexto = diasRestantes === 1 ? 'amanhã' : `em ${diasRestantes} dias`;
      
      await NotificationCenterService.create({
        titulo: `${tipo} próximo`,
        descricao: `"${titulo}" acontece ${diasTexto}`,
        tipo: 'CALENDARIO',
        icone: 'Calendar',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de evento do calendário:', error);
    }
  }

  /**
   * Notificação: Candidato aprovado
   */
  async notifyCandidateApproved(candidateName: string) {
    try {
      await NotificationCenterService.create({
        titulo: 'Candidato aprovado',
        descricao: `${candidateName} foi aprovado no processo seletivo`,
        tipo: 'CANDIDATO',
        icone: 'ThumbsUp',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidato aprovado:', error);
    }
  }

  /**
   * Notificação: Candidato reprovado
   */
  async notifyCandidateRejected(candidateName: string) {
    try {
      await NotificationCenterService.create({
        titulo: 'Candidato reprovado',
        descricao: `${candidateName} foi reprovado no processo seletivo`,
        tipo: 'CANDIDATO',
        icone: 'ThumbsDown',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidato reprovado:', error);
    }
  }

  /**
   * Notificação: Candidato em lista de espera
   */
  async notifyCandidateWaitlisted(candidateName: string) {
    try {
      await NotificationCenterService.create({
        titulo: 'Candidato em lista de espera',
        descricao: `${candidateName} foi adicionado à lista de espera`,
        tipo: 'CANDIDATO',
        icone: 'Clock',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de candidato em lista de espera:', error);
    }
  }
}

export default new NotificationHelper();
