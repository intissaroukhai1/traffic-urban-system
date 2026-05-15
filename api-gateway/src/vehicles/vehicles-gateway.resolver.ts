import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VehiclesGatewayService } from './vehicles-gateway.service';
import { VehicleModel } from './models/vehicle.model';
import { GpsPositionModel } from './models/gps-position.model';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { CreateGpsPositionInput } from './dto/create-gps-position.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Resolver(() => VehicleModel)
export class VehiclesGatewayResolver {
  constructor(
    private readonly vehiclesGatewayService: VehiclesGatewayService,
  ) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => VehicleModel)
  createVehicle(
    @Args('input') input: CreateVehicleInput,
  ): Promise<VehicleModel> {
    return this.vehiclesGatewayService.createVehicle(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => [VehicleModel])
  vehicles(): Promise<VehicleModel[]> {
    return this.vehiclesGatewayService.findAllVehicles();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => VehicleModel)
  vehicle(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<VehicleModel> {
    return this.vehiclesGatewayService.findVehicleById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Mutation(() => GpsPositionModel)
  addGpsPosition(
    @Args('input') input: CreateGpsPositionInput,
  ): Promise<GpsPositionModel> {
    return this.vehiclesGatewayService.addGpsPosition(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => [GpsPositionModel])
  vehicleHistory(
    @Args('vehicleId', { type: () => Int }) vehicleId: number,
  ): Promise<GpsPositionModel[]> {
    return this.vehiclesGatewayService.getVehicleHistory(vehicleId);
  }
}