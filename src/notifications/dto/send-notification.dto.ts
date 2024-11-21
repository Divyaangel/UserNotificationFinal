import { IsString, IsIn, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NotificationContentDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}

export class SendNotificationDto {
  
  @IsString()
  userId: string;

  @IsIn(['marketing', 'newsletter', 'updates'])
  type: 'marketing' | 'newsletter' | 'updates';

  @IsIn(['email', 'sms', 'push'])
  channel: 'email' | 'sms' | 'push';

  @IsObject()
  @ValidateNested()
  @Type(() => NotificationContentDto)
  content: NotificationContentDto;
}

