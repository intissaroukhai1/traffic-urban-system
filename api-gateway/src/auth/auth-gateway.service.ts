import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthGatewayService {
  private readonly authServiceUrl = 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async register(input: RegisterInput) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/register`, input),
    );

    return response.data;
  }

  async login(input: LoginInput) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/login`, input),
    );

    return response.data;
  }

  async users() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.authServiceUrl}/users`),
    );

    return response.data;
  }
}