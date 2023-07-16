import { z } from 'nestjs-zod/z';

export interface Response<T = null> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export function createResponseSchema<T extends z.ZodTypeAny>(payloadSchema: T) {
  return z.object({
    status: z.enum(['success', 'error']),
    message: z.string(),
    data: payloadSchema.optional(),
  });
}
