import { ZodError, type ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import type { RequestFile } from '../types/RequestFile.type.js';

export const formDataValidator =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const reqWithMulter = req as Request & {
        file?: RequestFile;
        files?: RequestFile[] | Record<string, RequestFile[]>;
      };

      const dataToValidate: Record<string, unknown> = { ...req.body };

      if (reqWithMulter.file) {
        dataToValidate[reqWithMulter.file.fieldname] = reqWithMulter.file;
      }

      if (reqWithMulter.files) {
        if (Array.isArray(reqWithMulter.files)) {
          const fieldName = reqWithMulter.files[0]?.fieldname;
          if (fieldName) {
            dataToValidate[fieldName] = reqWithMulter.files;
          }
        } else {
          Object.assign(dataToValidate, reqWithMulter.files);
        }
      }

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({ success: false, issues });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
      });
    }
  };
