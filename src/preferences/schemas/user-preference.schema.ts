import * as mongoose from 'mongoose';

export const UserPreferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  preferences: {
    marketing: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: false },
    updates: { type: Boolean, default: false },
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'never'], 
      default: 'weekly' 
    },
    channels: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    }
  },
  timezone: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
