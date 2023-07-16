import { createZodDto } from 'nestjs-zod';
import { insertItemSchema } from '../../drizzle/schema';

export class UpdateItemDto extends createZodDto(insertItemSchema) {}
