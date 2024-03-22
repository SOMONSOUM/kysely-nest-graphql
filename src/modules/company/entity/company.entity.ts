export class Company {
  id: number;
  name: string;
  slug: string;
  tenant_id: string;
  email: string;
  id_pricing: number;
  is_active: boolean;
  trial_days: number;
  is_deleted: boolean;
  is_trial: boolean;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  website?: string;
  logo?: string;
  created_at: Date;
  updated_at: Date;
}
