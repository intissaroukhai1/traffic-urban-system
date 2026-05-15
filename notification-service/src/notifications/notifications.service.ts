import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MarkNotificationReadDto } from './dto/mark-notification-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    input: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      title: input.title,
      message: input.message,
      isRead: false,
    });

    return this.notificationRepository.save(notification);
  }

  async findAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findNotificationById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(input: MarkNotificationReadDto): Promise<Notification> {
    const notification = await this.findNotificationById(input.notificationId);

    notification.isRead = true;

    return this.notificationRepository.save(notification);
  }
}