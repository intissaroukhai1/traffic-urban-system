import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateGpsPositionInput {
  @Field(() => Int)
  vehicleId!: number;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;
}