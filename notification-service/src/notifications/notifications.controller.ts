import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MarkNotificationReadDto } from './dto/mark-notification-read.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(@Body() input: CreateNotificationDto) {
    return this.notificationsService.createNotification(input);
  }

  @Get()
  findAllNotifications() {
    return this.notificationsService.findAllNotifications();
  }

  @Get(':id')
  findNotificationById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findNotificationById(id);
  }

  @Patch('read')
  markAsRead(@Body() input: MarkNotificationReadDto) {
    return this.notificationsService.markAsRead(input);
  }
}