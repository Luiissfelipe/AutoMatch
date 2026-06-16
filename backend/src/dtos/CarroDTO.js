import { z } from 'zod';

export const criarCarroDTO = z.object({
  modelo: z.string().trim().min(2, 'O modelo é obrigatório'),
  ano: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  preco: z.number().positive('O preço deve ser maior que zero'),
  tags: z.array(z.string().trim()).min(5, 'O carro deve ter pelo menos cinco características'),
  urlImagem: z.string().trim().url('A URL da imagem deve ser válida')
});

export const atualizarCarroDTO = z.object({
  modelo: z.string().trim().min(2).optional(),
  ano: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
  preco: z.number().positive().optional(),
  tags: z.array(z.string().trim()).min(1).optional(),
  urlImagem: z.string().trim().url('A URL da imagem deve ser válida').optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Envie pelo menos um campo para atualizar'
});
