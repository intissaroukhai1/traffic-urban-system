import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  fullName!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  role!: string;
}