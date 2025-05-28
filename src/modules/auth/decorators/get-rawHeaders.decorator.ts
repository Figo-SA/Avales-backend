import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express'; // 👈 Asegúrate de importar desde express

export const GetRawHeader = createParamDecorator(
  (data: number | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const rawHeaders = request.rawHeaders;

    if (!rawHeaders) {
      throw new InternalServerErrorException(
        'Raw headers not found in request',
      );
    }

    return typeof data === 'number' ? rawHeaders[data] : rawHeaders;
  },
);
