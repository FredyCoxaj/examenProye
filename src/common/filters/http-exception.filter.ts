import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global que captura CUALQUIER excepción no manejada
 * y la transforma en una respuesta JSON uniforme.
 *
 * Formato de respuesta:
 * {
 *   statusCode: 400,
 *   timestamp: "2024-...",
 *   path: "/api/v1/students",
 *   method: "POST",
 *   message: "..." | ["error1", "error2"]
 * }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar el código de estado HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraer el mensaje (puede ser string o arreglo de strings de class-validator)
    let message: string | string[];
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        message = (r.message as string | string[]) ?? exception.message;
      } else {
        message = exception.message;
      }
    } else {
      message = 'Error interno del servidor';
    }

    // Log de errores internos (500) para debug
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `❌ ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }
}