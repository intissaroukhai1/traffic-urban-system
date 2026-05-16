import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification with isRead false', async () => {
    const input = {
      title: 'Nouvel incident',
      message: 'Un accident a ete signale dans la zone Centre Ville.',
    };

    const createdNotification = {
      id: 1,
      title: input.title,
      message: input.message,
      isRead: false,
      createdAt: new Date(),
    };

    mockNotificationRepository.create.mockReturnValue(createdNotification);
    mockNotificationRepository.save.mockResolvedValue(createdNotification);

    const result = await service.createNotification(input);

    expect(mockNotificationRepository.create).toHaveBeenCalledWith({
      title: input.title,
      message: input.message,
      isRead: false,
    });

    expect(mockNotificationRepository.save).toHaveBeenCalledWith(
      createdNotification,
    );

    expect(result.isRead).toBe(false);
    expect(result.title).toBe(input.title);
  });

  it('should return all notifications ordered by createdAt DESC', async () => {
    const notifications = [
      {
        id: 1,
        title: 'Notification 1',
        message: 'Message 1',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    mockNotificationRepository.find.mockResolvedValue(notifications);

    const result = await service.findAllNotifications();

    expect(mockNotificationRepository.find).toHaveBeenCalledWith({
      order: {
        createdAt: 'DESC',
      },
    });

    expect(result).toEqual(notifications);
  });

  it('should return one notification by id', async () => {
    const notification = {
      id: 1,
      title: 'Notification 1',
      message: 'Message 1',
      isRead: false,
      createdAt: new Date(),
    };

    mockNotificationRepository.findOne.mockResolvedValue(notification);

    const result = await service.findNotificationById(1);

    expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual(notification);
  });

  it('should throw NotFoundException when notification does not exist', async () => {
    mockNotificationRepository.findOne.mockResolvedValue(null);

    await expect(service.findNotificationById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should mark notification as read', async () => {
    const existingNotification = {
      id: 1,
      title: 'Notification 1',
      message: 'Message 1',
      isRead: false,
      createdAt: new Date(),
    };

    const updatedNotification = {
      ...existingNotification,
      isRead: true,
    };

    mockNotificationRepository.findOne.mockResolvedValue(existingNotification);
    mockNotificationRepository.save.mockResolvedValue(updatedNotification);

    const result = await service.markAsRead({
      notificationId: 1,
    });

    expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(mockNotificationRepository.save).toHaveBeenCalledWith({
      ...existingNotification,
      isRead: true,
    });

    expect(result.isRead).toBe(true);
  });
});