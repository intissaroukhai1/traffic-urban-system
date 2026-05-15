import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVehicleInput {
  @Field()
  plateNumber!: string;

  @Field()
  type!: string;

  @Field({ defaultValue: 'ACTIVE' })
  status!: string;
}