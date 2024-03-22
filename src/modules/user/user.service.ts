import { Injectable } from '@nestjs/common';
import { Database } from '../database/database';
import { Selectable } from 'kysely';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly database: Database) {}

  async getUserById(id: number, tenantId: string): Promise<Selectable<User>> {
    const user = await this.database
      .withSchema(tenantId)
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return user;
  }

  async getUserByEmail(
    email: string,
    tenantId: string,
  ): Promise<Selectable<User>> {
    const user = await this.database
      .withSchema(tenantId)
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirstOrThrow();

    return user;
  }

  async createUser(user: CreateUserDto, tenantId: string): Promise<number> {
    user.company_id = tenantId;
    const createdUser = await this.database
      .withSchema(tenantId)
      .insertInto('user')
      .values([user])
      .returning('id')
      .executeTakeFirstOrThrow();

    return createdUser.id;
  }
}
