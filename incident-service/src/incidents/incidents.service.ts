import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async createIncident(input: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentRepository.create({
      type: input.type,
      description: input.description,
      location: input.location,
    });

    return this.incidentRepository.save(incident);
  }

  async findAllIncidents(): Promise<Incident[]> {
    return this.incidentRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findIncidentById(id: number): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  async updateIncidentStatus(
    input: UpdateIncidentStatusDto,
  ): Promise<Incident> {
    const incident = await this.findIncidentById(input.incidentId);

    incident.status = input.status;

    return this.incidentRepository.save(incident);
  }
}