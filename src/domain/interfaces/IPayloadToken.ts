import { JwtPayload } from 'jsonwebtoken';

export interface IFPayloadToken extends JwtPayload {
  id: string
}
