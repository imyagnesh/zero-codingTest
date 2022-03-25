import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../util/secrets';

type JWTType = {
  name: string;
  email: string;
  id: string;
};

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(403).send({ message: 'No token provided!' });
    return;
  }

  const token = authorization.replace(/bearer /i, '');

  jwt.verify(token, JWT_SECRET, (err: Error, decoded: JWTType) => {
    if (err) {
      res.status(401).send({ message: 'Unauthorized!' });
      return;
    }
    const body = { ...req.body, userId: decoded.id };
    req.body = body;
    next();
  });
};

export default verifyToken;
