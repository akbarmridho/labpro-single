import { Inject, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { DrizzleType, PG_CONNECTION } from '../drizzle/drizzle.module';
import { companies, items } from '../drizzle/schema';
import { eq, like, or } from 'drizzle-orm';

@Injectable()
export class ItemsService {
  constructor(@Inject(PG_CONNECTION) private conn: DrizzleType) {}

  async create(createItemDto: CreateItemDto) {
    return this.conn.insert(items).values(createItemDto).returning();
  }

  async findAll(q?: string, perusahaan?: string) {
    let query = this.conn.select().from(items);

    if (q && q !== '') {
      query = query.where(or(like(items.nama, q), eq(items.kode, q)));
    }

    if (perusahaan && perusahaan !== '') {
      const company = await this.conn
        .select()
        .from(companies)
        .where(eq(companies.nama, perusahaan));

      if (company.length !== 0) {
        query = query.where(eq(items.perusahaan_id, company[0].id));
      }
    }

    return query;
  }

  async findOne(id: string) {
    const res = await this.conn
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return res[0];
  }

  update(id: string, updateItemDto: UpdateItemDto) {
    return this.conn
      .update(items)
      .set(updateItemDto)
      .where(eq(items.id, id))
      .returning();
  }

  remove(id: string) {
    return this.conn.delete(items).where(eq(items.id, id)).returning();
  }
}
