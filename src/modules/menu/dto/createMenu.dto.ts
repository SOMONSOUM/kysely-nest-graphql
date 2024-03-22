import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class createMenuDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsString()
  desc?: string;

  @Field({ nullable: true })
  @IsString()
  bg_image?: string;

  @Field({ nullable: true })
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsString()
  currency_symbol?: string;
}
