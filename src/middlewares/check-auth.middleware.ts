import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenErrors } from '../interfaces/token-errors.interface';
import VeterinarioModel from '../models/veterinario.model';


const tokenVerificationErrors: TokenErrors = {
  ["jwt must be provided"]: "Debe de proporcionar un jsonwebtoken - Bearer Token",
  ["invalid signature"]: "Firma no válida del token",
  ["jwt malformed"]: "Formato inválido del token - token defectuoso/malformado",
  ["jwt expired"]: "El jsonwebtoken ha expirado",
  ["invalid token"]: "Token no válido"
}

const checkAuthStatusMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization
  try {
    if (bearerToken === undefined) throw new Error('jwt must be provided')

    if (bearerToken && bearerToken.startsWith('Bearer')) {
      const token = bearerToken.split(' ').pop()!
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

      req.veterinary = await VeterinarioModel.findById(decoded.id).select('-password -token -confirm')

      next()
    }
  } catch (error: any) {
    console.log(error.message)
    return res
      .status(401)
      .json(tokenVerificationErrors[error.message])
  }
}

export default checkAuthStatusMiddleware