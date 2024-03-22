import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { Menu } from './entity/menu.entity';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guard/gql.auth.guard';
import CurrentUser from 'src/decorator/currentUser.decorator';
import { User } from '../user/entity/user.entity';
import { createMenuDto } from './dto/createMenu.dto';
import { CompanyService } from '../company/company.service';

@Resolver()
export class MenuResolver {
  constructor(
    private readonly menuService: MenuService,
    private readonly companyService: CompanyService,
  ) {}

  @Query(() => [Menu])
  @UseGuards(GqlAuthGuard)
  async getMenu(@CurrentUser() user: User) {
    const result = await this.menuService.getMenu(user.company_id);
    if (!result) {
      throw new HttpException('Menu not found', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Query(() => Menu)
  @UseGuards(GqlAuthGuard)
  async getMenuById(@CurrentUser() user: User, @Args('id') id: number) {
    const result = await this.menuService.getMenuById(id, user.company_id);
    if (!result) {
      throw new HttpException('Menu not found', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async createMenu(
    @Args('data') data: createMenuDto,
    @CurrentUser() user: User,
  ) {
    const maxMenuCount = await this.companyService.getMaxMenuCount(
      user.company_id,
    );
    if (!maxMenuCount) {
      throw new HttpException(
        'Max menu count not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const menuCount = await this.menuService.getMenuCount(user.company_id);
    if (!menuCount) {
      throw new HttpException('Menu count not found', HttpStatus.BAD_REQUEST);
    }
    if (menuCount >= maxMenuCount) {
      throw new HttpException('Max menu count reached', HttpStatus.BAD_REQUEST);
    }
    const result = await this.menuService.createMenu(data, user.company_id);
    if (!result) {
      throw new HttpException('Menu not created', HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
