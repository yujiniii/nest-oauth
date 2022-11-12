import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService, GoogleStrategy],
})
export class UsersModule {}
