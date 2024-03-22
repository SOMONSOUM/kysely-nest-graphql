import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { Token } from './entity/token.entity';
import { RegisterAuthDto } from './dto/register.dto';
import { PasswordService } from '../../utils/password.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { MigrationsService } from '../migrations/migrations.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly migrationsService: MigrationsService,
  ) {}

  async createUser(payload: RegisterAuthDto): Promise<Token> {
    const { company, ...user } = payload;

    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );

    user.password = hashedPassword;

    try {
      // Crear la compañia y el usuario
      const tenantId = await this.companyService.createCompany(company);
      if (!tenantId) {
        throw new BadRequestException('Error creating company');
      }
      const migration = await this.migrationsService.createSchemaTenantTables(
        tenantId,
      );
      if (!migration) {
        throw new BadRequestException('Error creating schema');
      }
      const userId = await this.userService.createUser(user, tenantId);
      if (!userId) {
        throw new BadRequestException('Error creating user');
      }
      return this.generateTokens({
        userId: userId.toString(),
        tenantId: tenantId,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(
    email: string,
    password: string,
    tenantId: string,
  ): Promise<Token> {
    // Find user by email
    const user = await this.userService.getUserByEmail(email, tenantId);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return this.generateTokens({
      userId: user.id.toString(),
      tenantId: tenantId,
    });
  }

  async validateUser(userId: string, tenantId: string): Promise<User> {
    // Find user by id
    const user = await this.userService.getUserById(parseInt(userId), tenantId);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  getUserFromToken(token: string): Promise<User> {
    // Decode token and get user id from sub property
    const id = this.jwtService.decode(token)['userId'];
    const tenantId = this.jwtService.decode(token)['tenantId'];
    return this.validateUser(id, tenantId);
  }

  generateTokens(payload: { userId: string; tenantId: string }): Token {
    // Generate access token and refresh token
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: {
    userId: string;
    tenantId: string;
  }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: {
    userId: string;
    tenantId: string;
  }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId, tenantId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
        tenantId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
