import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const schemaValidator =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Error de validación en los datos enviados',
          issues,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error Interno del Servidor',
        });
      }
    }
  };
