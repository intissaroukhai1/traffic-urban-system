import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateTrafficZoneInput } from './dto/create-traffic-zone.input';
import { UpdateTrafficDensityInput } from './dto/update-traffic-density.input';

@Injectable()
export class TrafficGatewayService {
  private readonly trafficServiceUrl = 'http://localhost:3003';

  constructor(private readonly httpService: HttpService) {}

  async createTrafficZone(input: CreateTrafficZoneInput) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.trafficServiceUrl}/traffic-zones`, input),
    );

    return response.data;
  }

  async findAllTrafficZones() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.trafficServiceUrl}/traffic-zones`),
    );

    return response.data;
  }

  async findTrafficZoneById(id: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.trafficServiceUrl}/traffic-zones/${id}`),
    );

    return response.data;
  }

  async updateTrafficDensity(input: UpdateTrafficDensityInput) {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.trafficServiceUrl}/traffic-zones/density`,
        input,
      ),
    );

    return response.data;
  }

  async findCongestedZones() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.trafficServiceUrl}/traffic-zones/congested`),
    );

    return response.data;
  }
}