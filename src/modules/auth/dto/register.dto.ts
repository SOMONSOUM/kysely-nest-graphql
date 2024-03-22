import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CompanyDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  id_pricing: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  trial_days: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  is_trial: boolean;

  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
}

@InputType()
export class RegisterAuthDto {
  // User fields
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @MinLength(4)
  @IsNotEmpty()
  password: string;

  @Field()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  // Company fields CompanyDto
  @Field(() => CompanyDto)
  @IsNotEmpty()
  company: CompanyDto;
}
