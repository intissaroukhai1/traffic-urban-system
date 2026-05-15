import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './vehicle.entity';
import { GpsPosition } from './gps-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, GpsPosition])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}