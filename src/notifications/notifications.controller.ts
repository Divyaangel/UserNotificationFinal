import { 
    Controller, 
    Post, 
    Get, 
    Param, 
    Body, 
    UseFilters 
  } from '@nestjs/common';
  import { NotificationsService } from './notifications.service';
  import { SendNotificationDto } from './dto/send-notification.dto';
  import { NotificationLog } from '../types/notification-log.interface';
  import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
  
  @Controller('api/notifications')
  @UseFilters(HttpExceptionFilter)
  export class NotificationsController {
    constructor(private notificationsService: NotificationsService) {}
  
    @Post('send')
    async sendNotification(
      @Body() sendNotificationDto: SendNotificationDto
    ): Promise<NotificationLog> {
      return this.notificationsService.sendNotification(sendNotificationDto);
    }
  
    @Get(':userId/logs')
    async getNotificationLogs(
      @Param('userId') userId: string
    ): Promise<NotificationLog[]> {
      return this.notificationsService.getNotificationLogs(userId);
    }
  
    @Get('stats')
    async getNotificationStats(): Promise<any> {
      return this.notificationsService.getNotificationStats();
    }
  }