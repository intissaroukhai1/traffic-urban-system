import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IncidentModel {
  @Field(() => ID)
  id!: number;

  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field()
  location!: string;

  @Field()
  status!: string;

  @Field(() => String)
  createdAt!: string;
}