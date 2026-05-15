import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrafficZoneModel {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  location!: string;

  @Field(() => Int)
  vehicleCount!: number;

  @Field(() => Int)
  density!: number;

  @Field()
  level!: string;

  @Field()
  congested!: boolean;
}