import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RemoveHeaderMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.removeHeader('X-Powered-By');
        next();
    }
}
