import { Response } from 'express';

export const errorHandlerHttp = async (response: Response, error: any, source?: string) => {
  return response.json({
    error,
    sourceError: source
  })
}