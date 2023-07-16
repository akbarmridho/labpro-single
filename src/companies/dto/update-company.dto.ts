import { createZodDto } from 'nestjs-zod';
import { insertCompanySchema } from '../../drizzle/schema';

export class UpdateCompanyDto extends createZodDto(insertCompanySchema) {}
