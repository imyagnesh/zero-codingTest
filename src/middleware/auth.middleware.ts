import { Request, Response, NextFunction } from 'express';
import { JWTVerify } from '../util/auth';
import ResponseWrapper from '../helpers/response_wrapper';
import { JWTType } from '../types/jwtType';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;
  const response: ResponseWrapper = new ResponseWrapper(res);

  if (!authorization) {
    response.forbidden('No token provided!');
    return;
  }

  JWTVerify(authorization, (err: Error, decoded: JWTType) => {
    if (err) {
      response.unauthorized('Invalid Token!');
      return;
    }
    const body = { ...req.body, userId: decoded.id };
    req.body = body;
    next();
  });
};

export default verifyToken;
