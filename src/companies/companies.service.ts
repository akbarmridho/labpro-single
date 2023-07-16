import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DrizzleType, PG_CONNECTION } from '../drizzle/drizzle.module';
import { companies, Company, items } from '../drizzle/schema';
import { eq, like, or } from 'drizzle-orm';

@Injectable()
export class CompaniesService {
  constructor(@Inject(PG_CONNECTION) private conn: DrizzleType) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.conn.insert(companies).values(createCompanyDto).returning();
  }

  async findAll(q?: string): Promise<Company[]> {
    let query = this.conn.select().from(companies);
    if (q && q !== '') {
      query = query.where(or(eq(companies.kode, q), like(companies.nama, q)));
    }

    return query;
  }

  async findOne(id: string) {
    const res = await this.conn
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return res[0];
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.conn
      .update(companies)
      .set(updateCompanyDto)
      .where(eq(companies.id, id))
      .returning();
  }

  async remove(id: string) {
    await this.conn.delete(items).where(eq(items.perusahaan_id, id));
    return this.conn.delete(companies).where(eq(companies.id, id)).returning();
  }
}
