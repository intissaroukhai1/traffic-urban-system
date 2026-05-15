import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficLevel, TrafficZone } from './traffic-zone.entity';
import { CreateTrafficZoneDto } from './dto/create-traffic-zone.dto';
import { UpdateTrafficDensityDto } from './dto/update-traffic-density.dto';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(TrafficZone)
    private readonly trafficZoneRepository: Repository<TrafficZone>,
  ) {}

  async createZone(input: CreateTrafficZoneDto): Promise<TrafficZone> {
    const density = this.calculateDensity(input.vehicleCount);
    const level = this.classifyLevel(density);
    const congested = this.isCongested(level);

    const zone = this.trafficZoneRepository.create({
      name: input.name,
      location: input.location,
      vehicleCount: input.vehicleCount,
      density,
      level,
      congested,
    });

    return this.trafficZoneRepository.save(zone);
  }

  async findAllZones(): Promise<TrafficZone[]> {
    return this.trafficZoneRepository.find();
  }

  async findZoneById(id: number): Promise<TrafficZone> {
    const zone = await this.trafficZoneRepository.findOne({
      where: { id },
    });

    if (!zone) {
      throw new NotFoundException('Traffic zone not found');
    }

    return zone;
  }

  async updateDensity(input: UpdateTrafficDensityDto): Promise<TrafficZone> {
    const zone = await this.findZoneById(input.zoneId);

    const density = this.calculateDensity(input.vehicleCount);
    const level = this.classifyLevel(density);
    const congested = this.isCongested(level);

    zone.vehicleCount = input.vehicleCount;
    zone.density = density;
    zone.level = level;
    zone.congested = congested;

    return this.trafficZoneRepository.save(zone);
  }

  async findCongestedZones(): Promise<TrafficZone[]> {
    return this.trafficZoneRepository.find({
      where: {
        congested: true,
      },
    });
  }

  private calculateDensity(vehicleCount: number): number {
    return vehicleCount;
  }

  private classifyLevel(density: number): TrafficLevel {
    if (density <= 30) {
      return TrafficLevel.FAIBLE;
    }

    if (density <= 70) {
      return TrafficLevel.MOYEN;
    }

    return TrafficLevel.ELEVE;
  }

  private isCongested(level: TrafficLevel): boolean {
    return level === TrafficLevel.ELEVE;
  }
}