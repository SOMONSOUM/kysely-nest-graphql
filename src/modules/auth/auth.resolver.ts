import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entity/auth.entity';
import { Token } from './entity/token.entity';
import { RefreshTokenInput } from './dto/refreshToken.dto';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: RegisterAuthDto) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.authService.createUser(
      data,
    );
    if (!accessToken || !refreshToken) {
      throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password, tenantId }: LoginAuthDto) {
    const { accessToken, refreshToken } = await this.authService.login(
      email.toLowerCase(),
      password,
      tenantId,
    );

    if (!accessToken || !refreshToken) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    const result = this.authService.refreshToken(token);
    if (!result) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
