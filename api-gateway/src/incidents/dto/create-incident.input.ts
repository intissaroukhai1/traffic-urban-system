import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateIncidentInput {
  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field()
  location!: string;
}