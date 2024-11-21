import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PreferencesService } from '../preferences/preferences.service';
import { getModelToken } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationLog } from '../types/notification-log.interface';
import { UserPreference } from '../types/user-preference.interface';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let preferencesService: PreferencesService;

  const mockNotificationLogModel = {
    save: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockPreferences: UserPreference = {
    userId: '123',
    email: 'test@example.com',
    preferences: {
      marketing: true,
      newsletter: false,
      updates: true,
      frequency: 'daily',
      channels: {
        email: true,
        sms: false,
        push: true,
      },
    },
    timezone: 'America/New_York',
    lastUpdated: new Date('2024-11-20T10:00:00Z'),
    createdAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockNotificationLog: NotificationLog = {
    userId: '123',
    type: 'marketing',
    channel: 'email',
    status: 'sent',
    sentAt: new Date('2024-11-20T12:00:00Z'),
    metadata: {
      content: {
        subject: 'Test Subject',
        body: 'Test Body',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PreferencesService,
          useValue: {
            getUserPreferences: jest.fn(),
          },
        },
        {
          provide: getModelToken('NotificationLog'),
          useValue: mockNotificationLogModel,
        },
        Logger,
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    preferencesService = module.get<PreferencesService>(PreferencesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 
  
  
  it('should fetch notification logs for a user', async () => {
    const userId = '123';
    const mockLogs = [mockNotificationLog];

    jest.spyOn(mockNotificationLogModel, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockLogs),
      }),
    } as any);

    const result = await service.getNotificationLogs(userId);

    expect(mockNotificationLogModel.find).toHaveBeenCalledWith({ userId });
    expect(result).toEqual(mockLogs);
  });

  it('should return notification stats', async () => {
    jest.spyOn(mockNotificationLogModel, 'countDocuments').mockImplementation((query) => {
      if (query?.status === 'sent') return Promise.resolve(10);
      if (query?.status === 'failed') return Promise.resolve(5);
      return Promise.resolve(15);
    });

    jest.spyOn(mockNotificationLogModel, 'aggregate').mockImplementation((pipeline) => {
      if (pipeline[0]?.$group?._id === '$type') {
        return Promise.resolve([{ _id: 'marketing', count: 10 }]);
      }
      if (pipeline[0]?.$group?._id === '$channel') {
        return Promise.resolve([{ _id: 'email', count: 15 }]);
      }
      return [];
    });

    const result = await service.getNotificationStats();

    expect(mockNotificationLogModel.countDocuments).toHaveBeenCalledTimes(3);
    expect(mockNotificationLogModel.aggregate).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      totalNotifications: 15,
      sentNotifications: 10,
      failedNotifications: 5,
      notificationsByType: [{ _id: 'marketing', count: 10 }],
      notificationsByChannel: [{ _id: 'email', count: 15 }],
    });
  });
});
