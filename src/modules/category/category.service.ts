import { Injectable } from '@nestjs/common';
import { Database } from '../database/database';
import { createCategoryDto } from './dto/createCategory.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly database: Database) {}

  async createCategory(
    category: createCategoryDto,
    tenantId: string,
  ): Promise<Category> {
    const newCategory = await this.database
      .withSchema(tenantId)
      .insertInto('menu_category')
      .values(category)
      .returningAll()
      .executeTakeFirst();

    return newCategory;
  }

  async getAllCategories(
    tenantId: string,
    menuId: number,
  ): Promise<Category[]> {
    const categories = await this.database
      .withSchema(tenantId)
      .selectFrom('menu_category')
      .where('id_menu', '=', menuId)
      .selectAll()
      .execute();

    return categories;
  }
}
