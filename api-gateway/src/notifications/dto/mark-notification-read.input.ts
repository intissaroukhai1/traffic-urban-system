import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MarkNotificationReadInput {
  @Field(() => Int)
  notificationId!: number;
}