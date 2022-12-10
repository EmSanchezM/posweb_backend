import { Request, Response, NextFunction } from "express";
import config from "config"

export const accessControl = () => {
    const domain = config.get<string>("domain");

    return (req: Request, res: Response, next: NextFunction) => {
        
        res.setHeader('Access-Control-Allow-Origin', domain);

        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        );

        res.setHeader(
          'Access-Control-Allow-Headers',
          'X-Requested-With,content-type'
        );

        res.setHeader('Access-Control-Allow-Credentials', 'true');

        next();
    }
}