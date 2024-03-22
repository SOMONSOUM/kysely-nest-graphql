import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field()
  id: number;

  @Field()
  id_menu: number;

  @Field()
  name: string;

  @Field()
  desc: string;

  @Field()
  is_active: boolean;

  @Field()
  bg_image: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
