import { getModelForClass, modelOptions, pre, prop, Severity } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import generateID from '../helpers/generateId.helper';


@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { collection: 'veterinarios', timestamps: true, versionKey: false } })
@pre<Veterinario>('save', async function (next) {
  if (!this.isModified('password'))
    next()
  this.password = await bcrypt.hash(this.password, 10)
})
export class Veterinario {
  readonly _id!: mongoose.Types.ObjectId

  @prop()
  public name!: string

  @prop({ trim: true, unique: true })
  public email!: string

  @prop({ minlength: 6 })
  public password!: string

  @prop({ default: null })
  public phone?: number

  @prop({ default: null })
  public web?: string

  @prop({ default: generateID() })
  public token?: string | null

  @prop({ default: false })
  public confirmed?: boolean

  public async checkPassword(passForm: string): Promise<boolean> {
    return await bcrypt.compare(passForm, this.password)
  }
}

const VeterinarioModel = getModelForClass(Veterinario)

export default VeterinarioModel