import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class createCategoryDto {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  id_menu: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  desc?: string;

  @Field({ nullable: true })
  @IsString()
  bg_image?: string;
}
