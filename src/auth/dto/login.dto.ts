import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class LoginDto extends createZodDto(loginSchema) {}
