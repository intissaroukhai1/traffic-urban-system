import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GpsPositionModel } from './gps-position.model';

@ObjectType()
export class VehicleModel {
  @Field(() => ID)
  id!: number;

  @Field()
  plateNumber!: string;

  @Field()
  type!: string;

  @Field()
  status!: string;

  @Field(() => [GpsPositionModel], { nullable: true })
  positions?: GpsPositionModel[];
}