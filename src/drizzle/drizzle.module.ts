import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as schema from './schema';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { companies, insertItemSchema, items, users } from './schema';
import * as bcrypt from 'bcrypt';
import { generateCompany, generateItem } from './generator';
import { z } from 'nestjs-zod/z';

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

        await migrate(db, { migrationsFolder: 'migrations' });

        // flag for unseeded database
        const firstUser = await db.query.users.findFirst();

        if (!firstUser) {
          await db.insert(users).values({
            name: 'Akbar Maulana Ridho',
            username: 'admin',
            password: await bcrypt.hash('password', 10),
          });

          const companiesSeed = await db
            .insert(companies)
            .values([generateCompany(), generateCompany(), generateCompany()])
            .returning();

          for (const companySeed of companiesSeed) {
            const seededitems: z.infer<typeof insertItemSchema>[] = [];

            for (let i = 0; i < 10; i++) {
              seededitems.push(generateItem(companySeed.id));
            }

            await db.insert(items).values(seededitems);
          }
        }

        return db;
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
