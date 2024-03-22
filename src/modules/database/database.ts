import { Kysely } from 'kysely';
import { Company, CompanyFeature, Feature, Pricing } from '../company/entity';
import { User } from '../user/entity/user.entity';
import { Menu } from '../menu/entity/menu.entity';
import { Category } from '../category/entity/category.entity';

// Add your tables here.
interface Tables {
  company: Company;
  feature: Feature;
  company_feature: CompanyFeature;
  pricing: Pricing;
  user: User;
  menu: Menu;
  menu_category: Category;
}

export interface DatabaseOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class Database extends Kysely<Tables> {}
