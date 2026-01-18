import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      // P2002: Unique constraint failed (e.g., email already exists)
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[]) || [];

        response.status(status).json({
          statusCode: status,
          message: `Unique constraint failed on the: ${target.join(', ')}`,
          error: 'Conflict',
        });
        break;
      }

      // P2025: Record not found (e.g., update() on missing ID)
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;

        response.status(status).json({
          statusCode: status,
          message: 'The record you are trying to access or modify does not exist.',
          error: 'Not Found',
        });
        break;
      }

      default:
        super.catch(exception, host);
        break;
    }
  }
}
