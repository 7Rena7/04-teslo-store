import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers: Headers = request.rawHeaders;
    if (!headers)
      throw new InternalServerErrorException(
        'Headers not found (request object)',
      );

    if (Array.isArray(data)) {
      const headersData = {};
      data.forEach((key) => {
        headersData[key] = headers[key];
      });
      return headersData;
    }

    if (data) return headers[data];

    return headers;
  },
);
