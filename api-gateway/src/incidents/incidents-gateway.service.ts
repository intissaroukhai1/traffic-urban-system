import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateIncidentStatusInput } from './dto/update-incident-status.input';

@Injectable()
export class IncidentsGatewayService {
  private readonly incidentServiceUrl = 'http://localhost:3004';

  constructor(private readonly httpService: HttpService) {}

  async createIncident(input: CreateIncidentInput) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.incidentServiceUrl}/incidents`, input),
    );

    return response.data;
  }

  async findAllIncidents() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.incidentServiceUrl}/incidents`),
    );

    return response.data;
  }

  async findIncidentById(id: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.incidentServiceUrl}/incidents/${id}`),
    );

    return response.data;
  }

  async updateIncidentStatus(input: UpdateIncidentStatusInput) {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.incidentServiceUrl}/incidents/status`,
        input,
      ),
    );

    return response.data;
  }
}