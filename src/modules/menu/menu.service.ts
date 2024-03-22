import { Injectable } from '@nestjs/common';
import { Database } from '../database/database';
import { Menu } from './entity/menu.entity';
import { createMenuDto } from './dto/createMenu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly database: Database) {}

  async getMenu(tenantId: string): Promise<Menu[]> {
    const menu = await this.database
      .withSchema(tenantId)
      .selectFrom('menu')
      .selectAll()
      .execute();
    return menu;
  }

  async getMenuById(id: number, tenantId: string): Promise<Menu> {
    const menu = await this.database
      .withSchema(tenantId)
      .selectFrom('menu')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return menu;
  }

  async getMenuCount(tenantId: string): Promise<number> {
    const result = await this.database
      .withSchema(tenantId)
      .selectFrom('menu')
      .select((col) => col.fn.count('id').as('count'))
      .executeTakeFirst();

    const menuCount = parseInt(result.count.toString());

    return menuCount;
  }

  async createMenu(menu: createMenuDto, tenantId: string): Promise<number> {
    const newMenu = await this.database
      .withSchema(tenantId)
      .insertInto('menu')
      .values(menu)
      .returning('id')
      .executeTakeFirst();

    return newMenu.id;
  }
}
