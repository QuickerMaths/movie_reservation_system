import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string, identifier?: string | number) {
    const message =
      identifier !== undefined
        ? `${entity} not found with id ${identifier}`
        : `${entity} not found`;

    super({
      statusCode: 404,
      message,
      error: 'Not Found',
      entity,
      identifier,
    });
  }
}
