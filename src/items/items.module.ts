import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [DrizzleModule],
})
export class ItemsModule {}
