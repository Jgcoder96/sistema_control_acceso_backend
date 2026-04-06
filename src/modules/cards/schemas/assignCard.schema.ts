import { z } from 'zod';

export const assignCardBodySchema = z.object({
  usuario_id: z
    .string('El ID de usuario es obligatorio')
    .uuid('El formato del ID de usuario no es un UUID válido'),
});
