import { AppError } from '../helpers/app-errors.helper';
import MascotaModel, { Mascota } from '../models/mascota.model';
import { Veterinario } from '../models/veterinario.model';


export class MascotaService {
  public static async createPet(data: Mascota, vetId: Veterinario['_id']) {
    const { name, email, owner, symptoms, gender } = data

    try {
      const pet = await MascotaModel.create({
        name,
        email,
        owner,
        symptoms,
        gender
      })
      pet.veterinary = vetId
      await pet.save()

      return pet
    } catch (error: any) {
      throw error
    }
  }

  public static async findAllPetsByVet(veterinary: Veterinario) {
    return await MascotaModel.find().where('veterinary').equals(veterinary).sort('-createdAt')
  }

  public static async findDetailsPet(id: string, veterinary: Veterinario) {
    return await this.findPetById(id, veterinary)
  }

  public static async findPetById(id: string, veterinary: Veterinario) {
    const patient = await MascotaModel.findById(id)
    if (!patient)
      throw new AppError('Paciente/Mascota no encontrado/a', 404)

    if (patient.veterinary._id.toString() !== veterinary._id.toString())
      throw new AppError('Acción no válida para este usuario', 403)

    return patient
  }

  public static async updatePet(id: string, veterinary: Veterinario, data: Partial<Mascota>) {
    const patient = await this.findPetById(id, veterinary)

    patient.name = data.name ?? patient.name
    patient.owner = data.owner ?? patient.owner
    patient.email = data.email ?? patient.email
    patient.date = data.date ?? patient.date
    patient.symptoms = data.symptoms ?? patient.symptoms
    patient.gender = data.gender ?? patient.gender

    try {
      const updatedPatient = await patient.save()
      return updatedPatient
    } catch (error: any) {
      throw error
    }
  }

  public static async deletePet(id: string, veterinary: Veterinario) {
    const patient = await this.findPetById(id, veterinary)

    try {
      return await patient.deleteOne()
    } catch (error: any) {
      throw error
    }
  }
}