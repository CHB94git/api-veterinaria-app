import { AppError, generateID, generateJwt } from '../helpers';
import { ChangePassword } from '../interfaces/change-password.interface';
import VeterinarioModel, { Veterinario } from '../models/veterinario.model';
import { emailForgetPassword, registerEmail } from '../utils';


export class VeterinarioService {
  public static async createVeterinary(user: Veterinario) {
    const { email, name, phone, web, password } = user

    const veterinary = await VeterinarioModel.create({
      name,
      email,
      phone,
      web,
      password
    })

    await registerEmail({
      email,
      name,
      token: veterinary.token
    })

    return veterinary
  }

  public static async findOneByEmail(email: string) {
    return await VeterinarioModel.findOne({ email })
  }

  public static async findAll() {
    return await VeterinarioModel.find().sort('-createdAt')
  }

  public static async loginUser(data: Veterinario) {
    const { email, password } = data

    const user = await this.findOneByEmail(email)

    if (!user)
      throw new AppError(`El usuario ${ email } no existe`, 404)

    if (await user.checkPassword(password)) {
      return {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateJwt(user.id)
      }
    }

    throw new AppError('Credenciales incorrectas', 403)
  }

  public static async confirm(token: string) {
    const confirmUser = await this.checkToken(token)

    if (!confirmUser)
      throw new AppError('Token no válido - No se pudo confirmar la cuenta', 400)

    confirmUser.token = null
    confirmUser.confirmed = true
    await confirmUser.save()
    return confirmUser
  }

  public static async forgetThePassword(email: string) {
    const vetExists = await this.findOneByEmail(email)

    if (!vetExists)
      throw new AppError('El usuario no existe', 404)

    try {
      vetExists.token = generateID()
      await vetExists.save()

      await emailForgetPassword({
        email,
        name: vetExists.name,
        token: vetExists.token
      })

      return { message: 'Hemos enviado a su email un link de recuperación' }
    } catch (err: any) {
      throw err
    }
  }

  public static async checkToken(token: string) {
    const validToken = await VeterinarioModel.findOne({ token })
    return validToken
  }

  public static async checkValidToken(token: string) {
    const validateToken = await this.checkToken(token)

    if (!validateToken)
      throw new AppError('Token inválido para reestablecer la cuenta', 400)

    return { message: 'Token válido, usuario registrado exitosamente', userConfirmed: validateToken }
  }

  public static async updateVetProfile(id: Veterinario['_id'], dataUser: Veterinario) {
    const vet = await VeterinarioModel.findById(id).select('-password')

    if (!vet)
      throw new AppError('Hubo un error', 404)

    // Actualizar el email
    if (vet.email !== dataUser.email) {
      const { email } = dataUser
      const emailExists = await VeterinarioModel.findOne({ email })
      if (emailExists)
        throw new AppError(`Email de usuario ${ email } ya está en uso!`, 400)
    }

    try {
      vet.name = dataUser.name ?? vet.name
      vet.email = dataUser.email ?? vet.email
      vet.web = dataUser.web ?? vet.web
      vet.phone = dataUser.phone ?? vet.phone

      return await vet.save()
    } catch (error: any) {
      throw error
    }
  }

  public static async newPassword(token: string, password: string) {
    const vet = await this.checkToken(token)

    if (!vet)
      throw new AppError('Hubo un error', 403)

    try {
      vet.token = null
      vet.password = password
      await vet.save()
      return { message: 'Contraseña/Password modificada con éxito' }
    } catch (error: any) {
      throw error
    }
  }

  // Pick<Veterinario, '_id'
  public static async changePassword(id: Veterinario['_id'], data: ChangePassword) {
    const { current_password, new_password } = data

    const vet = await VeterinarioModel.findById(id)

    if (!vet)
      throw new AppError('Hubo un error', 403)

    if (await vet.checkPassword(current_password)) {
      vet.password = new_password
      await vet.save()
      return { message: 'Contraseña actualizada y guardada correctamente' }
    }
    throw new AppError('La actual contraseña no coincide con nuestros registros', 400)
  }
} 