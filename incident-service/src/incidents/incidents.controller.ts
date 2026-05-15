import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  createIncident(@Body() input: CreateIncidentDto) {
    return this.incidentsService.createIncident(input);
  }

  @Get()
  findAllIncidents() {
    return this.incidentsService.findAllIncidents();
  }

  @Get(':id')
  findIncidentById(@Param('id', ParseIntPipe) id: number) {
    return this.incidentsService.findIncidentById(id);
  }

  @Patch('status')
  updateIncidentStatus(@Body() input: UpdateIncidentStatusDto) {
    return this.incidentsService.updateIncidentStatus(input);
  }
}