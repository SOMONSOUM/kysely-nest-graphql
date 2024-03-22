import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';
import { CompanyModule } from '../company/company.module';

@Module({
  providers: [MenuResolver, MenuService],
  imports: [CompanyModule],
})
export class MenuModule {}
