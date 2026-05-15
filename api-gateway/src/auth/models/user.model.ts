import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: number;

  @Field()
  fullName!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;
}