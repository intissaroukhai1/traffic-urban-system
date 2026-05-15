import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { NotificationsGatewayService } from './notifications-gateway.service';
import { NotificationModel } from './models/notification.model';
import { CreateNotificationInput } from './dto/create-notification.input';
import { MarkNotificationReadInput } from './dto/mark-notification-read.input';

import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Resolver(() => NotificationModel)
export class NotificationsGatewayResolver {
  constructor(
    private readonly notificationsGatewayService: NotificationsGatewayService,
  ) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => NotificationModel)
  createNotification(
    @Args('input') input: CreateNotificationInput,
  ): Promise<NotificationModel> {
    return this.notificationsGatewayService.createNotification(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => [NotificationModel])
  notifications(): Promise<NotificationModel[]> {
    return this.notificationsGatewayService.findAllNotifications();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Query(() => NotificationModel)
  notification(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<NotificationModel> {
    return this.notificationsGatewayService.findNotificationById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Mutation(() => NotificationModel)
  markNotificationAsRead(
    @Args('input') input: MarkNotificationReadInput,
  ): Promise<NotificationModel> {
    return this.notificationsGatewayService.markNotificationAsRead(input);
  }
}