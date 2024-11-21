import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UserPreference } from '../types/user-preference.interface';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel('UserPreference') 
    private userPreferenceModel: Model<UserPreference>
  ) {}

  async createPreference(dto: CreatePreferenceDto): Promise<UserPreference> {
    const existingPreference = await this.userPreferenceModel.findOne({ userId: dto.userId });
    if (existingPreference) {
      throw new Error('User preferences already exist');
    }

    const newPreference = new this.userPreferenceModel({
      ...dto,
      createdAt: new Date(),
      lastUpdated: new Date()
    });

    return newPreference.save();
  }

  async getUserPreferences(userId: string): Promise<UserPreference> {
    const preferences = await this.userPreferenceModel.findOne({ userId });
    if (!preferences) {
      throw new NotFoundException('User preferences not found');
    }
    return preferences;
  }

  async updateUserPreferences(
    userId: string, 
    updateDto: Partial<CreatePreferenceDto>
  ): Promise<UserPreference> {
    const updatedPreferences = await this.userPreferenceModel.findOneAndUpdate(
      { userId },
      { 
        ...updateDto, 
        lastUpdated: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!updatedPreferences) {
      throw new NotFoundException('User preferences not found');
    }

    return updatedPreferences;
  }

  async deleteUserPreferences(userId: string): Promise<void> {
    const result = await this.userPreferenceModel.deleteOne({ userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User preferences not found');
    }
  }
}