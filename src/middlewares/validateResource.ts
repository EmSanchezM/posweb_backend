import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

const validate = (schemma: ZodType) => (req:Request, res:Response, next: NextFunction) => {
    try {
        schemma.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (error : any) {
        return res.status(400).send(error instanceof ZodError ? error.issues : error.errors);
    }
}

export default validate;