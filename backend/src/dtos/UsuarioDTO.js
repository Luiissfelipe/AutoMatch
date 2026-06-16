import { z } from 'zod';

export const coldStartDTO = z.object({
  tags: z.array(z.string().trim()).min(1, 'Escolha pelo menos 1 tag').max(5, 'Escolha no máximo cinco tags')
});

export const atualizarPerfilDTO = z.object({
  nome: z.string().trim().min(3).optional()
}).refine(data => data.nome, {
  message: 'Envie pelo menos um campo para atualizar'
});
