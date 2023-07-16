import { createZodDto } from 'nestjs-zod';
import { insertCompanySchema } from '../../drizzle/schema';

export class CreateCompanyDto extends createZodDto(insertCompanySchema) {}
