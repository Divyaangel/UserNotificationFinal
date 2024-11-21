import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongodbConfig: MongooseModuleOptions = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/notification_preferences',
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    // If you need authentication
    // auth: {
    //   username: process.env.MONGO_USERNAME,
    //   password: process.env.MONGO_PASSWORD
    // }
  }