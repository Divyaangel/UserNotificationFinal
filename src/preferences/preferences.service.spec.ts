import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesService } from './preferences.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserPreference } from '../types/user-preference.interface';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreatePreferenceDto } from './dto/create-preference.dto';

// Mock Data for testing
const mockUserPreference: UserPreference = {
  userId: '123',
  email: 'test@example.com',
  preferences: {
    marketing: true,
    newsletter: false,
    updates: true,
    frequency: 'weekly',
    channels: {
      email: true,
      sms: false,
      push: true,
    },
  },
  timezone: 'UTC',
  createdAt: new Date(),
  lastUpdated: new Date(),
};

describe('PreferencesService', () => {
  let service: PreferencesService;
  let model: Model<UserPreference>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        {
          provide: getModelToken('UserPreference'),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
    model = module.get<Model<UserPreference>>(getModelToken('UserPreference'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  // Test createPreference method
  

      
      
    

   
  // Test getUserPreferences method
  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUserPreference);
      const result = await service.getUserPreferences('123');
      expect(result).toEqual(mockUserPreference);
    });

    it('should throw NotFoundException if user preferences not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null); // No preferences found
      await expect(service.getUserPreferences('123')).rejects.toThrow(NotFoundException);
    });
  });

  // Test updateUserPreferences method
  

    
 

  
  
  });

