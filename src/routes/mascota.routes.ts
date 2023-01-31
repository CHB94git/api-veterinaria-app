import { Router } from 'express';
import 'express-async-errors';
import * as PacienteController from '../controllers/mascota.controller';
import checkAuthStatusMiddleware from '../middlewares/check-auth.middleware';
import { validatorCreatePatient, validatorMongoId, validatorUpdatePatient } from '../validators/mascota.validator';


const router = Router()

router.route('/')
  .get(checkAuthStatusMiddleware, PacienteController.getAllPatients)
  .post(checkAuthStatusMiddleware, validatorCreatePatient, PacienteController.createPatient)

router.route('/:idPet')
  .get(checkAuthStatusMiddleware, validatorMongoId, PacienteController.getOnePatient)
  .put(checkAuthStatusMiddleware, validatorUpdatePatient, PacienteController.updatePatient)
  .delete(checkAuthStatusMiddleware, validatorMongoId, PacienteController.deletePatient)


export default router