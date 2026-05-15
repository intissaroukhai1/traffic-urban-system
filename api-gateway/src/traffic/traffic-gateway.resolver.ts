import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TrafficGatewayService } from './traffic-gateway.service';
import { TrafficZoneModel } from './models/traffic-zone.model';
import { CreateTrafficZoneInput } from './dto/create-traffic-zone.input';
import { UpdateTrafficDensityInput } from './dto/update-traffic-density.input';

import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Resolver(() => TrafficZoneModel)
export class TrafficGatewayResolver {
  constructor(private readonly trafficGatewayService: TrafficGatewayService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => TrafficZoneModel)
  createTrafficZone(
    @Args('input') input: CreateTrafficZoneInput,
  ): Promise<TrafficZoneModel> {
    return this.trafficGatewayService.createTrafficZone(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => [TrafficZoneModel])
  trafficZones(): Promise<TrafficZoneModel[]> {
    return this.trafficGatewayService.findAllTrafficZones();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => TrafficZoneModel)
  trafficZone(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TrafficZoneModel> {
    return this.trafficGatewayService.findTrafficZoneById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => TrafficZoneModel)
  updateTrafficDensity(
    @Args('input') input: UpdateTrafficDensityInput,
  ): Promise<TrafficZoneModel> {
    return this.trafficGatewayService.updateTrafficDensity(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => [TrafficZoneModel])
  congestedZones(): Promise<TrafficZoneModel[]> {
    return this.trafficGatewayService.findCongestedZones();
  }
}