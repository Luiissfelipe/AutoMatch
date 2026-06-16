import { z } from 'zod';

export const buscarTagsDTO = z.object({
  categoria: z.string().optional()
});