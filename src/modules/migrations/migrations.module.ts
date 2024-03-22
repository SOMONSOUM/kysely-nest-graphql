import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { MigrationsResolver } from './migrations.resolver';

@Module({
  providers: [MigrationsResolver, MigrationsService],
  exports: [MigrationsService],
})
export class MigrationsModule {}
