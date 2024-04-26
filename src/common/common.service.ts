import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor() {}

  handleDBExceptions = (error: any, logger: Logger, dto?: any): never => {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status === 400) throw new BadRequestException(error.message);
    if (error.status === 404) throw new NotFoundException(error.message);
    if (error.status === 401) throw new UnauthorizedException(error.message);
    if (error.status) console.log(error.status);
    logger.error(error, [error.detail, dto]);
    throw new InternalServerErrorException('Unexpected error occurred.');
  };
}
