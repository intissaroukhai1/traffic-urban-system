import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationModel {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field()
  isRead!: boolean;

  @Field(() => String)
  createdAt!: string;
}