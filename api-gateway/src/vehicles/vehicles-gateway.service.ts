import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { CreateGpsPositionInput } from './dto/create-gps-position.input';

@Injectable()
export class VehiclesGatewayService {
  private readonly vehicleServiceUrl = 'http://localhost:3002';

  constructor(private readonly httpService: HttpService) {}

  async createVehicle(input: CreateVehicleInput) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.vehicleServiceUrl}/vehicles`, input),
    );

    return response.data;
  }

  async findAllVehicles() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.vehicleServiceUrl}/vehicles`),
    );

    return response.data;
  }

  async findVehicleById(id: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.vehicleServiceUrl}/vehicles/${id}`),
    );

    return response.data;
  }

  async addGpsPosition(input: CreateGpsPositionInput) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.vehicleServiceUrl}/vehicles/gps`, input),
    );

    return response.data;
  }

  async getVehicleHistory(vehicleId: number) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.vehicleServiceUrl}/vehicles/${vehicleId}/history`,
      ),
    );

    return response.data;
  }
}