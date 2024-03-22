import { Global, Module } from '@nestjs/common';
import { Database, DatabaseOptions } from './database';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.moduleDefinition';
import { MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        const dialect = new MysqlDialect({
          pool: async () =>
            createPool({
              host: databaseOptions.host,
              port: databaseOptions.port,
              user: databaseOptions.user,
              password: databaseOptions.password,
              database: databaseOptions.database,
            }),
        });
        return new Database({ dialect });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
