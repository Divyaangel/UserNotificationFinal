import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { mongodbConfig } from './config/mongodb.config';
import { validationConfig } from './config/validation.config';

import { PreferencesModule } from './preferences/preferences.module';
import { NotificationsModule } from './notifications/notifications.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { ConfigModule } from '@nestjs/config';
@Module({
  
    imports: [
      ConfigModule.forRoot({
         envFilePath: '.env',
         isGlobal: true,
      }),
      MongooseModule.forRoot(process.env.MONGODB_URI),
        PreferencesModule,
    NotificationsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: validationConfig
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes({ path: '*', method:RequestMethod.ALL });
 }
}
