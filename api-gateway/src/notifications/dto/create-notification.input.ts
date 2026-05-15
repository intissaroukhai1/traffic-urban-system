import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
  @Field()
  title!: string;

  @Field()
  message!: string;
}