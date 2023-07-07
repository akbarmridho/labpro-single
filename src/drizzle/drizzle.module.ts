import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as schema from './schema';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleType = NodePgDatabase<typeof schema>;

export const PG_CONNECTION = Symbol('PG_CONNECTION');

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString,
          ssl: true,
        });

        const db: DrizzleType = drizzle(pool, { schema });

        return db;
      },
    },
  ],
})
export class DrizzleModule {}
