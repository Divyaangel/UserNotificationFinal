import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationLogSchema } from './schemas/notification-log.schema';
import { PreferencesModule } from '../preferences/preferences.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'NotificationLog', schema: NotificationLogSchema }
    ]),
    PreferencesModule  // Import PreferencesModule to use PreferencesService
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}