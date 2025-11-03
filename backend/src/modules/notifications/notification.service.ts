import transporter, { emailConfig, isEmailConfigured } from '../../config/email.js';
import { AppError } from '../../utils/AppError.js';

/**
 * Interface para dados de email
 */
interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Interface para dados de matrícula
 */
interface EnrollmentData {
  alunoNome: string;
  alunoEmail: string;
  turmaNome: string;
  turno: string;
  dataInicio?: Date | null;
  dataFim?: Date | null;
}

/**
 * Interface para dados de turma
 */
interface ClassData {
  nome: string;
  turno: string;
  motivo?: string;
  dataInicio?: Date | null;
  dataFim?: Date | null;
}

/**
 * Service de Notificações
 * Responsável pelo envio de emails aos usuários do sistema
 */
class NotificationService {
  /**
   * Método privado para enviar email
   */
  private async sendEmail(data: EmailData, retries = 0): Promise<void> {
    // Se o email não está configurado, apenas loga e retorna
    if (!isEmailConfigured()) {
      console.warn(`📧 Email não enviado (sistema não configurado): ${data.subject} para ${data.to}`);
      return;
    }

    try {
      const info = await transporter.sendMail({
        from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
        to: data.to,
        subject: data.subject,
        text: data.text || this.stripHtml(data.html),
        html: data.html
      });

      console.log(`✅ Email enviado com sucesso: ${data.subject} para ${data.to}`);
      console.log(`   Message ID: ${info.messageId}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar email para ${data.to}:`, error);

      // Tentar reenviar se ainda houver tentativas
      if (retries < emailConfig.maxRetries) {
        console.log(`🔄 Tentando reenviar (tentativa ${retries + 1}/${emailConfig.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, emailConfig.retryDelay));
        return this.sendEmail(data, retries + 1);
      }

      // Se todas as tentativas falharam, não lança erro para não quebrar o fluxo principal
      console.error(`❌ Falha ao enviar email após ${emailConfig.maxRetries} tentativas`);
    }
  }

  /**
   * Remove tags HTML para versão texto do email
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<style[^>]*>.*<\/style>/gm, '')
      .replace(/<[^>]+>/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Formata data para exibição em português
   */
  private formatDate(date: Date | null | undefined): string {
    if (!date) return 'Não definida';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Template base para emails
   */
  private getEmailTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SECTI - Notificação</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 30px 20px;
          }
          .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box h3 {
            margin: 0 0 10px 0;
            color: #667eea;
            font-size: 16px;
          }
          .info-box p {
            margin: 5px 0;
            font-size: 14px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #495057;
          }
          .info-value {
            color: #6c757d;
          }
          .alert {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .alert.success {
            background-color: #d4edda;
            border-left-color: #28a745;
          }
          .alert.danger {
            background-color: #f8d7da;
            border-left-color: #dc3545;
          }
          .alert.info {
            background-color: #d1ecf1;
            border-left-color: #17a2b8;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
          }
          .footer p {
            margin: 5px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 15px 0;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 0;
              border-radius: 0;
            }
            .content {
              padding: 20px 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SECTI</h1>
            <p>Sistema de Cursos e Capacitação</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p><strong>SECTI - Sistema de Cursos</strong></p>
            <p>Esta é uma mensagem automática, por favor não responda.</p>
            <p>© ${new Date().getFullYear()} SECTI. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envia email de confirmação de matrícula
   */
  async sendEnrollmentConfirmation(data: EnrollmentData): Promise<void> {
    const content = `
      <div class="alert success">
        <h2 style="margin: 0 0 10px 0; color: #28a745;">✅ Matrícula Confirmada!</h2>
        <p>Olá <strong>${data.alunoNome}</strong>,</p>
        <p>Sua matrícula foi realizada com sucesso!</p>
      </div>

      <div class="info-box">
        <h3>📚 Detalhes da Turma</h3>
        <div class="info-row">
          <span class="info-label">Turma:</span>
          <span class="info-value">${data.turmaNome}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Turno:</span>
          <span class="info-value">${data.turno}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Início:</span>
          <span class="info-value">${this.formatDate(data.dataInicio)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Término:</span>
          <span class="info-value">${this.formatDate(data.dataFim)}</span>
        </div>
      </div>

      <p>Você receberá mais informações sobre as aulas em breve.</p>
      <p>Caso tenha alguma dúvida, entre em contato com a secretaria.</p>
      <p><strong>Bons estudos!</strong></p>
    `;

    await this.sendEmail({
      to: data.alunoEmail,
      subject: `✅ Matrícula confirmada - ${data.turmaNome}`,
      html: this.getEmailTemplate(content)
    });
  }

  /**
   * Envia email de cancelamento de matrícula
   */
  async sendEnrollmentCancellation(data: EnrollmentData): Promise<void> {
    const content = `
      <div class="alert danger">
        <h2 style="margin: 0 0 10px 0; color: #dc3545;">❌ Matrícula Cancelada</h2>
        <p>Olá <strong>${data.alunoNome}</strong>,</p>
        <p>Sua matrícula foi cancelada.</p>
      </div>

      <div class="info-box">
        <h3>📚 Detalhes da Turma</h3>
        <div class="info-row">
          <span class="info-label">Turma:</span>
          <span class="info-value">${data.turmaNome}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Turno:</span>
          <span class="info-value">${data.turno}</span>
        </div>
      </div>

      <p>Caso tenha alguma dúvida sobre o cancelamento, entre em contato com a secretaria.</p>
      <p>Esperamos vê-lo em breve em outros cursos!</p>
    `;

    await this.sendEmail({
      to: data.alunoEmail,
      subject: `❌ Matrícula cancelada - ${data.turmaNome}`,
      html: this.getEmailTemplate(content)
    });
  }

  /**
   * Envia email aos alunos quando turma é encerrada
   */
  async sendClassEnded(data: ClassData, alunosEmails: string[]): Promise<void> {
    const content = `
      <div class="alert info">
        <h2 style="margin: 0 0 10px 0; color: #17a2b8;">📢 Turma Encerrada</h2>
        <p>Informamos que a turma <strong>${data.nome}</strong> foi encerrada.</p>
      </div>

      <div class="info-box">
        <h3>📚 Detalhes da Turma</h3>
        <div class="info-row">
          <span class="info-label">Turma:</span>
          <span class="info-value">${data.nome}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Turno:</span>
          <span class="info-value">${data.turno}</span>
        </div>
      </div>

      <p>Agradecemos sua participação e dedicação ao longo do curso.</p>
      <p>Em breve você receberá informações sobre certificados e próximos cursos disponíveis.</p>
      <p><strong>Parabéns pela conclusão!</strong></p>
    `;

    // Enviar email para todos os alunos
    const emailPromises = alunosEmails.map(email =>
      this.sendEmail({
        to: email,
        subject: `📢 Turma encerrada - ${data.nome}`,
        html: this.getEmailTemplate(content)
      })
    );

    await Promise.all(emailPromises);
  }

  /**
   * Envia email aos alunos quando turma é cancelada
   */
  async sendClassCancelled(data: ClassData, alunosEmails: string[]): Promise<void> {
    const content = `
      <div class="alert danger">
        <h2 style="margin: 0 0 10px 0; color: #dc3545;">⚠️ Turma Cancelada</h2>
        <p>Informamos que a turma <strong>${data.nome}</strong> foi cancelada.</p>
      </div>

      <div class="info-box">
        <h3>📚 Detalhes da Turma</h3>
        <div class="info-row">
          <span class="info-label">Turma:</span>
          <span class="info-value">${data.nome}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Turno:</span>
          <span class="info-value">${data.turno}</span>
        </div>
        ${data.motivo ? `
        <div class="info-row">
          <span class="info-label">Motivo:</span>
          <span class="info-value">${data.motivo}</span>
        </div>
        ` : ''}
      </div>

      <p>Pedimos desculpas pelo transtorno. Sua matrícula foi automaticamente cancelada.</p>
      <p>Em breve entraremos em contato com opções de turmas alternativas.</p>
      <p>Para mais informações, entre em contato com a secretaria.</p>
    `;

    // Enviar email para todos os alunos
    const emailPromises = alunosEmails.map(email =>
      this.sendEmail({
        to: email,
        subject: `⚠️ Turma cancelada - ${data.nome}`,
        html: this.getEmailTemplate(content)
      })
    );

    await Promise.all(emailPromises);
  }

  /**
   * Envia email de teste
   */
  async sendTestEmail(to: string): Promise<void> {
    const content = `
      <div class="alert success">
        <h2 style="margin: 0 0 10px 0; color: #28a745;">✅ Email de Teste</h2>
        <p>Este é um email de teste do sistema SECTI.</p>
      </div>
      <p>Se você recebeu este email, significa que o sistema de notificações está funcionando corretamente!</p>
      <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
    `;

    await this.sendEmail({
      to,
      subject: '✅ Teste - Sistema de Notificações SECTI',
      html: this.getEmailTemplate(content)
    });
  }
}

export default new NotificationService();
