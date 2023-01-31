import { NextFunction, Request, Response } from 'express';
import { MascotaService } from '../services/mascota.service';


const createPatient = async ({ body, veterinary }: Request, response: Response, next: NextFunction) => {
  try {
    // const { id } = request.user as { id: string }
    const petCreated = await MascotaService.createPet(body, veterinary?._id!)
    return response.status(201).json(petCreated)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const getAllPatients = async ({ veterinary }: Request, response: Response, next: NextFunction) => {
  try {
    const pets = await MascotaService.findAllPetsByVet(veterinary!)
    return response.status(200).json(pets)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const getOnePatient = async ({ params, veterinary }: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = params
    const patient = await MascotaService.findDetailsPet(id, veterinary!)
    return response.status(200).json(patient)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const updatePatient = async ({ params, body, veterinary }: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = params
    const patient = await MascotaService.updatePet(id, veterinary!, body)
    return response.status(200).json(patient)
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

const deletePatient = async ({ params, veterinary }: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = params
    await MascotaService.deletePet(id, veterinary!)
    return response.status(204).send()
  } catch (error: any) {
    console.log(error)
    next(error)
  }
}

export {
  createPatient,
  getAllPatients,
  getOnePatient,
  updatePatient,
  deletePatient,
};

