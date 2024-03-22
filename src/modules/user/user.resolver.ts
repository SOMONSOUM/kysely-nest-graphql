import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guard/gql.auth.guard';
import CurrentUser from 'src/decorator/currentUser.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getUserById(@Args('id') id: number, @CurrentUser() user: User) {
    const result = await this.userService.getUserById(id, user.company_id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
