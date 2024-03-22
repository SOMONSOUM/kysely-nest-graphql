import { Resolver } from '@nestjs/graphql';
import { MigrationsService } from './migrations.service';

@Resolver()
export class MigrationsResolver {
  constructor(private readonly migrationsService: MigrationsService) {}
}
