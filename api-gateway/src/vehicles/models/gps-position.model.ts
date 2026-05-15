import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GpsPositionModel {
  @Field(() => ID)
  id!: number;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => String)
  timestamp!: string;
}