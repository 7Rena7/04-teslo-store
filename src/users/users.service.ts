import {
  Injectable,
  Logger,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDetails } = createUserDto;

      const user = this.usersRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10),
      });
      await this.usersRepository.save(user);
      // Todo: Send email verification or return JWT token
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger, createUserDto);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.usersRepository.findOne({
        where: { email },
        select: { id: true, password: true },
      });
      if (!user || !bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException();
      return {
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger, loginUserDto);
    }
  }

  checkAuthStatus(user: User) {
    try {
      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger, user);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
