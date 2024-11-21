export interface NotificationLog {
    userId: string;
    type: 'marketing' | 'newsletter' | 'updates';
    channel: 'email' | 'sms' | 'push';
    status: 'pending' | 'sent' | 'failed';
    sentAt?: Date;
    failureReason?: string;
    metadata: Record<string, any>;
  }