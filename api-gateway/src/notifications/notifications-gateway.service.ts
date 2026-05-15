import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateNotificationInput } from './dto/create-notification.input';
import { MarkNotificationReadInput } from './dto/mark-notification-read.input';

@Injectable()
export class NotificationsGatewayService {
  private readonly notificationServiceUrl = 'http://localhost:3005';

  constructor(private readonly httpService: HttpService) {}

  async createNotification(input: CreateNotificationInput) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.notificationServiceUrl}/notifications`,
        input,
      ),
    );

    return response.data;
  }

  async findAllNotifications() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.notificationServiceUrl}/notifications`),
    );

    return response.data;
  }

  async findNotificationById(id: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.notificationServiceUrl}/notifications/${id}`),
    );

    return response.data;
  }

  async markNotificationAsRead(input: MarkNotificationReadInput) {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.notificationServiceUrl}/notifications/read`,
        input,
      ),
    );

    return response.data;
  }
}