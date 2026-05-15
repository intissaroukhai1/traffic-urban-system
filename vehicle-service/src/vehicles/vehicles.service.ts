import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { GpsPosition } from './gps-position.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CreateGpsPositionDto } from './dto/create-gps-position.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(GpsPosition)
    private readonly gpsPositionRepository: Repository<GpsPosition>,
  ) {}

  async createVehicle(input: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create({
      plateNumber: input.plateNumber,
      type: input.type,
      status: input.status || 'ACTIVE',
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      relations: ['positions'],
    });
  }

  async findVehicleById(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['positions'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async addGpsPosition(input: CreateGpsPositionDto): Promise<GpsPosition> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: input.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const gpsPosition = this.gpsPositionRepository.create({
      latitude: input.latitude,
      longitude: input.longitude,
      vehicle,
    });

    return this.gpsPositionRepository.save(gpsPosition);
  }

  async getVehicleHistory(vehicleId: number): Promise<GpsPosition[]> {
    await this.findVehicleById(vehicleId);

    return this.gpsPositionRepository.find({
      where: {
        vehicle: {
          id: vehicleId,
        },
      },
      order: {
        timestamp: 'DESC',
      },
    });
  }
}