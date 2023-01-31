import { Router } from 'express';
import 'express-async-errors';
import * as VeterinarioController from '../controllers/veterinario.controller';
import checkAuthStatusMiddleware from '../middlewares/check-auth.middleware';
import { validatorAuthenticate, validatorConfirmRegister, validatorForgetMyPassword, validatorGenerateNewPassword, validatorRegister, validatorUpdatePassword, validatorUpdateProfile } from '../validators/veterinario.validator';

const router = Router()

router.route('/')
  .post(validatorRegister, VeterinarioController.register)
  .get(VeterinarioController.listAllVeterinaries)

router.post('/login', validatorAuthenticate, VeterinarioController.authenticate)
router.get('/confirm/:token', validatorConfirmRegister, VeterinarioController.confirmRegister)
router.post('/forget-password', validatorForgetMyPassword, VeterinarioController.forgetMyPassword)

router.route('/forget-password/:token')
  .get(VeterinarioController.verifyOneTimeUseToken)
  .post(validatorGenerateNewPassword, VeterinarioController.generateNewPassword)

// Auth Required
router.route('/profile')
  .get(checkAuthStatusMiddleware, VeterinarioController.profile)
  .put(checkAuthStatusMiddleware, validatorUpdateProfile, VeterinarioController.updateProfileInfo)

router.patch('/update-password', checkAuthStatusMiddleware, validatorUpdatePassword, VeterinarioController.updatePassword)

export default router