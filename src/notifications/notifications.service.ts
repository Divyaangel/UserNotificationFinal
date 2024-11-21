import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationLog } from '../types/notification-log.interface';
import { PreferencesService } from '../preferences/preferences.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel('NotificationLog') 
    private notificationLogModel: Model<NotificationLog>,
    private preferencesService: PreferencesService
  ) {}

  async sendNotification(dto: SendNotificationDto): Promise<NotificationLog> {
    // Retrieve user preferences to validate notification settings
    const userPreferences = await this.preferencesService.getUserPreferences(dto.userId);
    
    // Check if notification is allowed based on user preferences
    const isNotificationAllowed = this.validateNotificationPreferences(userPreferences, dto);
    
    if (!isNotificationAllowed) {
      return this.createFailedNotificationLog(dto, 'Notification not allowed by user preferences');
    }

    try {
      // Simulate notification sending (in a real-world scenario, this would interact with actual notification services)
      const sendResult = await this.simulateNotificationSending(dto);

      // Create and save notification log
      const notificationLog = new this.notificationLogModel({
        userId: dto.userId,
        type: dto.type,
        channel: dto.channel,
        status: 'sent',
        sentAt: new Date(),
        metadata: {
          content: dto.content
        }
      });

      return notificationLog.save();
    } catch (error) {
      this.logger.error(`Notification sending failed: ${error.message}`);
      return this.createFailedNotificationLog(dto, error.message);
    }
  }

  private validateNotificationPreferences(userPreferences, dto: SendNotificationDto): boolean {
    const { preferences } = userPreferences;
    
    // Check if the specific notification type is enabled
    const typeEnabled = preferences[dto.type];
    
    // Check if the specific channel is enabled
    const channelEnabled = preferences.channels[dto.channel];

    return typeEnabled && channelEnabled;
  }

  private async simulateNotificationSending(dto: SendNotificationDto): Promise<void> {
    // Simulated notification sending logic
    // In a real-world scenario, this would interact with email, SMS, or push notification services
    return new Promise((resolve, reject) => {
      const randomSuccess = Math.random() > 0.1; // 90% success rate
      
      setTimeout(() => {
        if (randomSuccess) {
          this.logger.log(`Notification sent: ${dto.type} via ${dto.channel}`);
          resolve();
        } else {
          reject(new Error('Notification service temporarily unavailable'));
        }
      }, 100); // Simulate network delay
    });
  }

  private async createFailedNotificationLog(
    dto: SendNotificationDto, 
    failureReason: string
  ): Promise<NotificationLog> {
    const failedLog = new this.notificationLogModel({
      userId: dto.userId,
      type: dto.type,
      channel: dto.channel,
      status: 'failed',
      failureReason,
      metadata: {
        content: dto.content
      }
    });

    return failedLog.save();
  }

  async getNotificationLogs(userId: string): Promise<NotificationLog[]> {
    return this.notificationLogModel.find({ userId }).sort({ sentAt: -1 }).limit(50);
  }

  async getNotificationStats(): Promise<any> {
    return {
      totalNotifications: await this.notificationLogModel.countDocuments(),
      sentNotifications: await this.notificationLogModel.countDocuments({ status: 'sent' }),
      failedNotifications: await this.notificationLogModel.countDocuments({ status: 'failed' }),
      notificationsByType: await this.notificationLogModel.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      notificationsByChannel: await this.notificationLogModel.aggregate([
        { $group: { _id: '$channel', count: { $sum: 1 } } }
      ])
    };
  }
}