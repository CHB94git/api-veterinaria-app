import { JwtPayload } from 'jsonwebtoken';
import { Veterinario } from '../../models/veterinario.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload | { id: string }
    }
  }
}


declare global {
  namespace Express {
    export interface Request {
      veterinary?: Veterinario | null
    }
  }
}
