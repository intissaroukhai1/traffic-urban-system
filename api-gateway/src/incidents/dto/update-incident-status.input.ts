import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateIncidentStatusInput {
  @Field(() => Int)
  incidentId!: number;

  @Field()
  status!: string;
}