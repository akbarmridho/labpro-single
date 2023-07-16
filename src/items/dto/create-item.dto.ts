import { createZodDto } from 'nestjs-zod';
import { insertItemSchema } from '../../drizzle/schema';

export class CreateItemDto extends createZodDto(insertItemSchema) {}
