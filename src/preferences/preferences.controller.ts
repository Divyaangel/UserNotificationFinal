import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Delete, 
    Body, 
    Param, 
    UseFilters 
  } from '@nestjs/common';
  import { PreferencesService } from './preferences.service';
  import { CreatePreferenceDto } from './dto/create-preference.dto';
  import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
  import { UserPreference } from '../types/user-preference.interface';
  
  @Controller('api/preferences')
  @UseFilters(HttpExceptionFilter)
  export class PreferencesController {
    constructor(private preferencesService: PreferencesService) {}
  
    @Post()
    async createPreferences(
      @Body() createPreferenceDto: CreatePreferenceDto
    ): Promise<UserPreference> {
      return this.preferencesService.createPreference(createPreferenceDto);
    }
  
    @Get(':userId')
    async getUserPreferences(
      @Param('userId') userId: string
    ): Promise<UserPreference> {
      return this.preferencesService.getUserPreferences(userId);
    }
  
    @Patch(':userId')
    async updateUserPreferences(
      @Param('userId') userId: string,
      @Body() updatePreferenceDto: Partial<CreatePreferenceDto>
    ): Promise<UserPreference> {
      return this.preferencesService.updateUserPreferences(userId, updatePreferenceDto);
    }
  
    @Delete(':userId')
    async deleteUserPreferences(
      @Param('userId') userId: string
    ): Promise<{ message: string }> {
      await this.preferencesService.deleteUserPreferences(userId);
      return { message: 'User preferences deleted successfully' };
    }
  }
  