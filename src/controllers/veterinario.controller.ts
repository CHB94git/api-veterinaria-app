import { NextFunction, Request, Response } from 'express';
import { VeterinarioService } from '../services/veterinario.service';


const register = async ({ body }: Request, response: Response, next: NextFunction) => {
  try {
    const newVeterinary = await VeterinarioService.createVeterinary(body)
    return response.status(201).json(newVeterinary)
  } catch (error: any) {
    console.log(error.message)
    next(error)
  }
}

const authenticate = async ({ body }: Request, response: Response, next: NextFunction) => {
  try {
    const loggedUser = await VeterinarioService.loginUser(body)
    return response.status(200).json(loggedUser)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const listAllVeterinaries = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const veterinarians = await VeterinarioService.findAll()
    return response.status(200).json(veterinarians)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const confirmRegister = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { token } = request.params
    const userConfirmed = await VeterinarioService.confirm(token)
    return response.status(200).json({
      message: 'Usuario confirmado correctamente',
      userConfirmed
    })
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const forgetMyPassword = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body
    const resp = await VeterinarioService.forgetThePassword(email)
    return response.status(200).json(resp)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const verifyOneTimeUseToken = async ({ params }: Request, response: Response, next: NextFunction) => {
  const { token } = params
  try {
    const tokenVerification = await VeterinarioService.checkValidToken(token)
    return response.status(200).json(tokenVerification)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const generateNewPassword = async (request: Request, response: Response, next: NextFunction) => {
  const { token } = request.params
  const { password } = request.body
  try {
    const msgSuccess = await VeterinarioService.newPassword(token, password)
    return response.status(200).json(msgSuccess)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const profile = async ({ veterinary }: Request, response: Response) => {
  return response.status(200).json(veterinary)
}

const updateProfileInfo = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // const { id } = request.user as { id: string; }
    const { veterinary, body } = request
    const updatedVet = await VeterinarioService.updateVetProfile(veterinary?._id!, body)
    return response.status(200).json(updatedVet)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const updatePassword = async ({ veterinary, body }: Request, response: Response, next: NextFunction) => {
  try {
    const updatedPass = await VeterinarioService.changePassword(veterinary?._id!, body)
    return response.status(200).json(updatedPass)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

export {
  listAllVeterinaries,
  authenticate,
  confirmRegister,
  forgetMyPassword,
  register,
  verifyOneTimeUseToken,
  generateNewPassword,
  profile,
  updateProfileInfo,
  updatePassword,
};

