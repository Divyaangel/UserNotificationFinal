import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip;
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 10;

    const currentTime = Date.now();
    const requestRecord = this.requestCounts.get(clientIp);

    // Reset count if window has passed
    if (!requestRecord || currentTime > requestRecord.resetTime) {
      this.requestCounts.set(clientIp, { 
        count: 1, 
        resetTime: currentTime + windowMs 
      });
      return next();
    }

    // Check if request limit exceeded
    if (requestRecord.count >= maxRequests) {
      return res.status(429).json({
        statusCode: 429,
        message: 'Too many requests, please try again later'
      });
    }

    // Increment request count
    this.requestCounts.set(clientIp, {
      count: requestRecord.count + 1,
      resetTime: requestRecord.resetTime
    });

    next();
  }
}