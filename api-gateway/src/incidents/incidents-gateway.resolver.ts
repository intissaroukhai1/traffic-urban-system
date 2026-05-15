import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IncidentsGatewayService } from './incidents-gateway.service';
import { IncidentModel } from './models/incident.model';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateIncidentStatusInput } from './dto/update-incident-status.input';

import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Resolver(() => IncidentModel)
export class IncidentsGatewayResolver {
  constructor(
    private readonly incidentsGatewayService: IncidentsGatewayService,
  ) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Mutation(() => IncidentModel)
  createIncident(
    @Args('input') input: CreateIncidentInput,
  ): Promise<IncidentModel> {
    return this.incidentsGatewayService.createIncident(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => [IncidentModel])
  incidents(): Promise<IncidentModel[]> {
    return this.incidentsGatewayService.findAllIncidents();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => IncidentModel)
  incident(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<IncidentModel> {
    return this.incidentsGatewayService.findIncidentById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => IncidentModel)
  updateIncidentStatus(
    @Args('input') input: UpdateIncidentStatusInput,
  ): Promise<IncidentModel> {
    return this.incidentsGatewayService.updateIncidentStatus(input);
  }
}