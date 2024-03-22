import { ObjectType } from '@nestjs/graphql';
import { Token } from './token.entity';
import { User } from 'src/modules/user/entity/user.entity';

@ObjectType()
export class Auth extends Token {
  user: User;
}
