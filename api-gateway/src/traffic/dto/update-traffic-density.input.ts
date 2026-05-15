import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTrafficDensityInput {
  @Field(() => Int)
  zoneId!: number;

  @Field(() => Int)
  vehicleCount!: number;
}