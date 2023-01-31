import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Veterinario } from './veterinario.model';

enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNDISCLOSED = "undisclosed"
}

@modelOptions({ schemaOptions: { collection: 'mascotas', timestamps: true, versionKey: false } })
export class Mascota {
  @prop()
  public name!: string

  @prop({ enum: Gender, addNullToEnum: true, default: Gender.UNDISCLOSED })
  public gender!: Gender

  @prop()
  public owner!: string

  @prop()
  public email!: string

  @prop({ default: Date.now() })
  public date!: Date

  @prop()
  public symptoms!: string

  @prop({ ref: () => Veterinario })
  public veterinary!: Ref<Veterinario>
}

const MascotaModel = getModelForClass(Mascota)

export default MascotaModel