import jwt, { JwtPayload, VerifyCallback } from 'jsonwebtoken';
import { JWT_SECRET } from './secrets';

interface User {
  _id: string;
  email: string;
}

interface JWTToken {
  name: string;
  id: number;
  exp: number;
}

export function createToken(user: User): string {
  const { _id: id, email } = user;
  return jwt.sign(
    {
      email,
      // eslint-disable-next-line no-underscore-dangle
      id,
      exp: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime(),
    },
    JWT_SECRET,
    {
      expiresIn: 24 * 60 * 60,
    },
  );
}

export const JWTVerify = (authorization: string, callback?: VerifyCallback<JwtPayload | string>) => {
  const token = authorization.replace(/bearer /i, '');

  jwt.verify(token, JWT_SECRET, callback);
};

export function verifyToken(req: any, res: any, next: any): void {
  const { token } = req.headers;
  if (!token) {
    res.status(403).send({ auth: false, message: 'No token provided.' });
    return;
  }
  // verifies secret and checks exp
  jwt.verify(token, JWT_SECRET, (error: any, decoded: JWTToken) => {
    if (error) {
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return;
    }
    req.userId = decoded.id;
    next();
  });
}
