/**
 * Logger Estruturado para Desenvolvimento e Produção
 * Usa console em dev e pode ser migrado para Winston/Pino em prod
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, data, error } = entry;
    const contextStr = context ? ` [${context}]` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    const errorStr = error ? ` ERROR: ${error.message}${error.code ? ` (${error.code})` : ''}` : '';
    
    return `${timestamp} ${level}${contextStr}: ${message}${dataStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error: error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        code: (error as any).code
      } : undefined
    };

    const formatted = this.formatLog(entry);

    // Em desenvolvimento, mostrar cores
    if (this.isDevelopment) {
      const colors = {
        [LogLevel.DEBUG]: '\x1b[36m', // Cyan
        [LogLevel.INFO]: '\x1b[32m',  // Green
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.ERROR]: '\x1b[31m'  // Red
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}${formatted}${reset}`);
    } else {
      // Em produção, apenas texto
      console.log(formatted);
    }

    // Também salvar JSON para parsing posterior (se usar Winston)
    if (level === LogLevel.ERROR || level === LogLevel.WARN) {
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: string, data?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context, data);
    }
  }

  info(message: string, context?: string, data?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, error: Error, context?: string, data?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, context, data, error);
  }
}

export const logger = new Logger();
