import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [DrizzleModule],
})
export class CompaniesModule {}
