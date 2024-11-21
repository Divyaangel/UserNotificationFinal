import { Test, TestingModule } from '@nestjs/testing';
import { RateLimiterMiddleware } from './rate-limiter.middleware';
import { PreferencesController } from '../../preferences/preferences.controller';
import { PreferencesService } from '../../preferences/preferences.service';
import { NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('Rate Limiting', () => {
  let controller: PreferencesController;
  let rateLimitMiddleware: RateLimiterMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferencesController],
      providers: [PreferencesService, RateLimiterMiddleware],
    }).compile();

    controller = module.get<PreferencesController>(PreferencesController);
    rateLimitMiddleware = module.get<RateLimiterMiddleware>(RateLimiterMiddleware);

    // Create mock request, response, and next function
    mockReq = { ip: '127.0.0.1' };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();
  });

  it('should block request if rate limit exceeded', () => {
    // Simulate 10 requests already made by this IP
    rateLimitMiddleware['requestCounts'].set('127.0.0.1', { count: 10, resetTime: Date.now() + 15 * 60 * 1000 });

    // Call the middleware with the mock request and response
    rateLimitMiddleware.use(mockReq as Request, mockRes as Response, nextFunction);

    // Check that the response is status 429 (Too many requests)
    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith({
      statusCode: 429,
      message: 'Too many requests, please try again later',
    });
    expect(nextFunction).not.toHaveBeenCalled(); // Request should be blocked
  });

  it('should allow request within rate limit', () => {
    // Simulate 9 requests already made by this IP
    rateLimitMiddleware['requestCounts'].set('127.0.0.1', { count: 9, resetTime: Date.now() + 15 * 60 * 1000 });

    // Call the middleware with the mock request and response
    rateLimitMiddleware.use(mockReq as Request, mockRes as Response, nextFunction);

    // Check that the next function was called to allow the request
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled(); // Status should not be set to 429
  });

  it('should reset the request count after the time window has passed', () => {
    // Simulate a reset of the window
    const pastTime = Date.now() - 16 * 60 * 1000; // 16 minutes ago
    rateLimitMiddleware['requestCounts'].set('127.0.0.1', { count: 5, resetTime: pastTime });

    // Call the middleware with the mock request and response
    rateLimitMiddleware.use(mockReq as Request, mockRes as Response, nextFunction);

    // Check that the request count was reset to 1
    const updatedRecord = rateLimitMiddleware['requestCounts'].get('127.0.0.1');
    expect(updatedRecord.count).toBe(1);
    expect(nextFunction).toHaveBeenCalled();
  });
});
