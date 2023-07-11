import { Inject, Injectable } from '@nestjs/common';
import { DrizzleType, PG_CONNECTION } from '../drizzle/drizzle.module';
import { User, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private conn: DrizzleType) {}

  async findAll() {
    const res = await this.conn.select().from(users);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByUsername(username: string): Promise<User | null> {
    const res = await this.conn
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return res[0];
  }
}
