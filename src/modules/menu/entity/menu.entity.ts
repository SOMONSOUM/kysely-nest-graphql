import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Menu {
  @Field()
  id: number;

  @Field()
  slug: string;

  @Field()
  desc: string;

  @Field({ nullable: true })
  bg_image?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  is_active?: boolean;

  @Field({ nullable: true })
  currency_symbol?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
