import { createZodDto } from 'nestjs-zod';
import { selectItemSchema } from '../../drizzle/schema';

export class Item extends createZodDto(selectItemSchema) {}
