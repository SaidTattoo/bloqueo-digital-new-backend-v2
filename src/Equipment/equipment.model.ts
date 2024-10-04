import mongoose, { Document, Schema } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  type: string;
  status: string;
}

const EquipmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
});

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema);