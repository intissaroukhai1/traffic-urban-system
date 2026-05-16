import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockNotificationsService = {
    createNotification: jest.fn(),
    findAllNotifications: jest.fn(),
    findNotificationById: jest.fn(),
    markAsRead: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a notification', async () => {
    const input = {
      title: 'Nouvel incident',
      message: 'Un accident a ete signale dans la zone Centre Ville.',
    };

    const expectedResult = {
      id: 1,
      title: input.title,
      message: input.message,
      isRead: false,
      createdAt: new Date(),
    };

    mockNotificationsService.createNotification.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.createNotification(input);

    expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
      input,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return all notifications', async () => {
    const expectedResult = [
      {
        id: 1,
        title: 'Notification 1',
        message: 'Message 1',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    mockNotificationsService.findAllNotifications.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.findAllNotifications();

    expect(mockNotificationsService.findAllNotifications).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should return notification by id', async () => {
    const expectedResult = {
      id: 1,
      title: 'Notification 1',
      message: 'Message 1',
      isRead: false,
      createdAt: new Date(),
    };

    mockNotificationsService.findNotificationById.mockResolvedValue(
      expectedResult,
    );

    const result = await controller.findNotificationById(1);

    expect(mockNotificationsService.findNotificationById).toHaveBeenCalledWith(
      1,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should mark notification as read', async () => {
    const input = {
      notificationId: 1,
    };

    const expectedResult = {
      id: 1,
      title: 'Notification 1',
      message: 'Message 1',
      isRead: true,
      createdAt: new Date(),
    };

    mockNotificationsService.markAsRead.mockResolvedValue(expectedResult);

    const result = await controller.markAsRead(input);

    expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });
});