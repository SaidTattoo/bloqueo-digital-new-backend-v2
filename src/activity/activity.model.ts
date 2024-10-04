import mongoose, { Document, Schema } from 'mongoose';
import { IEnergyOwner } from '../EnergyOwner/energyOwner.model'; // Importar modelo EnergyOwner
import { IEquipment } from '../Equipment/equipment.model'; // Importar modelo Equipment
import Counter from './counter.model';

// Definir la interfaz para Activity
export interface IActivity extends Document {
  activityId: number;
  name: string;
  description: string;
  isBlocked: boolean;
  blockType: string;
  createdAt: Date;
  energyOwners: IEnergyOwner[];
  equipments: IEquipment[];
  zeroEnergyValidation: {
    validatorName: string;
    instrumentUsed: string;
    energyValue: string; // Cambiado a string
  };
}

// Definir el esquema para Activity
const ActivitySchema: Schema = new Schema({
  activityId: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  blockType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  energyOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EnergyOwner' }], // Referencia a EnergyOwner
  equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }], // Referencia a Equipment
  zeroEnergyValidation: {
    validatorName: { type: String, required: false },
    instrumentUsed: { type: String, required: false },
    energyValue: { type: String, required: false },
  },
});

// Middleware para incrementar el ID automáticamente
ActivitySchema.pre<IActivity>('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'activityId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.activityId = counter.seq;
  }
  next();
});

// Configurar toJSON para eliminar __v y otros campos no deseados
ActivitySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Registrar el modelo
export default mongoose.model<IActivity>('Activity', ActivitySchema);