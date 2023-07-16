import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [DrizzleModule],
})
export class UsersModule {}
