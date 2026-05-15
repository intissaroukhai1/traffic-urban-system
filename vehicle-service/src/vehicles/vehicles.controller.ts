import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CreateGpsPositionDto } from './dto/create-gps-position.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  createVehicle(@Body() input: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(input);
  }

  @Get()
  findAllVehicles() {
    return this.vehiclesService.findAllVehicles();
  }

  @Get(':id')
  findVehicleById(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findVehicleById(id);
  }

  @Post('gps')
  addGpsPosition(@Body() input: CreateGpsPositionDto) {
    return this.vehiclesService.addGpsPosition(input);
  }

  @Get(':id/history')
  getVehicleHistory(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.getVehicleHistory(id);
  }
}