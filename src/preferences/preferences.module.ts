import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { UserPreferenceSchema } from './schemas/user-preference.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserPreference', schema: UserPreferenceSchema }
    ])
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService]
})
export class PreferencesModule {}
