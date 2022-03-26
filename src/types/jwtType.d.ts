import { JwtPayload } from 'jsonwebtoken';

declare type JWTType = {
  name: string;
  email: string;
  id: string;
} & JwtPayload;
