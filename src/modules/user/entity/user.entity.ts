import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  password: string;

  @Field()
  name: string;

  @Field()
  company_id: string;

  @Field({ nullable: true })
  created_by: number;

  @Field()
  created_at?: Date = new Date();

  @Field()
  updated_at?: Date = new Date();
}
