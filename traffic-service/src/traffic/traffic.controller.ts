import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { CreateTrafficZoneDto } from './dto/create-traffic-zone.dto';
import { UpdateTrafficDensityDto } from './dto/update-traffic-density.dto';

@Controller('traffic-zones')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post()
  createZone(@Body() input: CreateTrafficZoneDto) {
    return this.trafficService.createZone(input);
  }

  @Get()
  findAllZones() {
    return this.trafficService.findAllZones();
  }

  @Get('congested')
  findCongestedZones() {
    return this.trafficService.findCongestedZones();
  }

  @Get(':id')
  findZoneById(@Param('id', ParseIntPipe) id: number) {
    return this.trafficService.findZoneById(id);
  }

  @Patch('density')
  updateDensity(@Body() input: UpdateTrafficDensityDto) {
    return this.trafficService.updateDensity(input);
  }
}