import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user)
      throw new InternalServerErrorException('User not found (request object)');

    if (Array.isArray(data)) {
      const userData = {};
      data.forEach((key) => {
        userData[key] = user[key];
      });
      return userData;
    }

    if (data) return user[data];

    return user;
  },
);
