import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ItemsModule,
    CompaniesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
