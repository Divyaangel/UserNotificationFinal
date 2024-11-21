import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Preferences Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const mockUserPreference = {
    userId: 'test-user-123',
    email: 'test@example.com',
    preferences: {
      marketing: true,
      newsletter: false,
      updates: true,
      frequency: 'weekly',
      channels: {
        email: true,
        sms: false,
        push: true
      }
    },
    timezone: 'America/New_York'
  };

  it('should create user preferences', () => {
    return request(app.getHttpServer())
      .post('/api/preferences')
      .send(mockUserPreference)
      .expect(201)
      .expect((res) => {
        expect(res.body.userId).toBe(mockUserPreference.userId);
        expect(res.body.email).toBe(mockUserPreference.email);
      });
  });

  it('should retrieve user preferences', () => {
    return request(app.getHttpServer())
      .get(`/api/preferences/${mockUserPreference.userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.userId).toBe(mockUserPreference.userId);
      });
  });
});