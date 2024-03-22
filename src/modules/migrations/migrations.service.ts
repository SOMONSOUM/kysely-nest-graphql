import { Injectable } from '@nestjs/common';
import { Database } from '../database/database';
import { sql } from 'kysely';

@Injectable()
export class MigrationsService {
  constructor(private readonly database: Database) {}

  async createSchemaTenantTables(tenantId: string): Promise<boolean> {
    try {
      const transaction = await this.database
        .transaction()
        .execute(async (trx) => {
          await trx.schema.createSchema(tenantId).ifNotExists().execute();
          await sql`
          CREATE OR REPLACE FUNCTION ${sql.ref(
            tenantId,
          )}.update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = now();
            RETURN NEW;
          END;
          $$ language 'plpgsql';
        `.execute(trx);
          await trx.schema
            .withSchema(tenantId)
            .createTable('user')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('email', 'varchar(100)', (col) =>
              col.unique().notNull().unique(),
            )
            .addColumn('password', 'varchar(100)', (col) => col.notNull())
            .addColumn('name', 'varchar(100)', (col) => col.notNull())
            .addColumn('company_id', 'varchar(20)', (col) =>
              col.references('public.company.tenant_id').notNull(),
            )
            .addColumn('created_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .addColumn('updated_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .execute();

          await sql`CREATE OR REPLACE TRIGGER update_user_updated_at BEFORE UPDATE ON ${sql.ref(
            tenantId,
          )}.user FOR EACH ROW EXECUTE PROCEDURE ${sql.ref(
            tenantId,
          )}.update_updated_at_column();`.execute(trx);

          await trx.schema
            .withSchema(tenantId)
            .createTable('menu')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('slug', 'varchar(50)', (col) =>
              col.unique().notNull().unique(),
            )
            .addColumn('desc', 'varchar(200)', (col) =>
              col.notNull().defaultTo(''),
            )
            .addColumn('bg_image', 'varchar(200)')
            .addColumn('currency', 'varchar(10)', (col) =>
              col.notNull().defaultTo('CLP'),
            )
            .addColumn('currency_symbol', 'varchar(10)', (col) =>
              col.notNull().defaultTo('$'),
            )
            .addColumn('is_active', 'boolean', (col) =>
              col.notNull().defaultTo(true),
            )
            .addColumn('created_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .addColumn('updated_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .execute();

          await sql`CREATE OR REPLACE TRIGGER update_menu_updated_at BEFORE UPDATE ON ${sql.ref(
            tenantId,
          )}.menu FOR EACH ROW EXECUTE PROCEDURE ${sql.ref(
            tenantId,
          )}.update_updated_at_column();`.execute(trx);

          await trx.schema
            .withSchema(tenantId)
            .createTable('menu_category')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('id_menu', 'integer', (col) =>
              col.references('menu.id').notNull(),
            )
            .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
            .addColumn('desc', 'varchar(200)')
            .addColumn('is_active', 'boolean', (col) =>
              col.notNull().defaultTo(true),
            )
            .addColumn('bg_image', 'varchar(200)')
            .addColumn('created_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .addColumn('updated_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .execute();

          await sql`CREATE OR REPLACE TRIGGER update_menu_category_updated_at BEFORE UPDATE ON ${sql.ref(
            tenantId,
          )}.menu_category FOR EACH ROW EXECUTE PROCEDURE ${sql.ref(
            tenantId,
          )}.update_updated_at_column();`.execute(trx);

          await trx.schema
            .withSchema(tenantId)
            .createTable('menu_product')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('id_category', 'integer', (col) =>
              col.references('menu_category.id').notNull(),
            )
            .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
            .addColumn('desc', 'varchar(200)')
            .addColumn('price', 'integer', (col) => col.notNull())
            .addColumn('is_active', 'boolean', (col) =>
              col.notNull().defaultTo(true),
            )
            .addColumn('is_deleted', 'boolean', (col) =>
              col.notNull().defaultTo(false),
            )
            .addColumn('bg_image', 'varchar(200)')
            .addColumn('created_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .addColumn('updated_at', 'timestamp', (col) =>
              col.defaultTo(sql`now()`).notNull(),
            )
            .execute();

          await sql`CREATE OR REPLACE TRIGGER update_menu_product_updated_at BEFORE UPDATE ON ${sql.ref(
            tenantId,
          )}.menu_product FOR EACH ROW EXECUTE PROCEDURE ${sql.ref(
            tenantId,
          )}.update_updated_at_column();`.execute(trx);

          await trx.schema
            .withSchema(tenantId)
            .createTable('modifier')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
            .addColumn('is_multiple_choice', 'boolean', (col) =>
              col.notNull().defaultTo(false),
            )
            .addColumn('is_required', 'boolean', (col) =>
              col.notNull().defaultTo(false),
            )
            .execute();

          await trx.schema
            .withSchema(tenantId)
            .createTable('modifier_option')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('name', 'varchar(100)', (col) => col.notNull())
            .addColumn('overcharge', 'integer', (col) =>
              col.notNull().defaultTo(0),
            )
            .addColumn('id_modifer', 'integer', (col) =>
              col.references('modifier.id').notNull(),
            )
            .execute();

          await trx.schema
            .withSchema(tenantId)
            .createTable('modifier_product')
            .addColumn('id', 'integer', (col) =>
              col.primaryKey().generatedByDefaultAsIdentity(),
            )
            .addColumn('id_modifer', 'integer', (col) =>
              col.references('modifier.id').notNull(),
            )
            .addColumn('id_product', 'integer', (col) =>
              col.references('menu_product.id').notNull(),
            )
            .execute();

          return true;
        });
      return transaction;
    } catch (error) {
      return false;
    }
  }
}
