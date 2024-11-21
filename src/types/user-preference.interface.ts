export interface UserPreference {
    userId: string;
    email: string;
    preferences: {
      marketing: boolean;
      newsletter: boolean;
      updates: boolean;
      frequency: 'daily' | 'weekly' | 'monthly' | 'never';
      channels: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
    timezone: string;
    lastUpdated: Date;
    createdAt: Date;
  }