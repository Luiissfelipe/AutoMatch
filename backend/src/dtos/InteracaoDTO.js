import { z } from 'zod';

export const interagirDTO = z.object({
  carroId: z.string().trim().min(1, 'O ID do carro é obrigatório')
});
