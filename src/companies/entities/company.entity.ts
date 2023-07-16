import { createZodDto } from 'nestjs-zod';
import { selectCompanySchema } from '../../drizzle/schema';

export class Company extends createZodDto(selectCompanySchema) {}
