import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTrafficZoneInput {
  @Field()
  name!: string;

  @Field()
  location!: string;

  @Field(() => Int)
  vehicleCount!: number;
}