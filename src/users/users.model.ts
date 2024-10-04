import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  rut: string;
  empresa: string;
  disciplina: string;
  perfil: 'trabajador' | 'supervisor' | 'duenoDeEnergia'; // Añadir el campo perfil
}

const UsuarioSchema: Schema = new Schema({
  nombre: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: true }, // Asegúrate de que sea requerido
  telefono: { type: String, required: false },
  rut: { type: String, required: false, unique: false },
  empresa: { type: String, required: false },
  disciplina: { type: String, required: false },
  perfil: { type: String, required: true, enum: ['trabajador', 'supervisor', 'duenoDeEnergia'] }, // Añadir el campo perfil
});

// Configurar toJSON para eliminar __v y otros campos no deseados
UsuarioSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password; // Eliminar la contraseña de la salida JSON
    return ret;
  },
});

const Usuario = mongoose.models.Usuario || mongoose.model<IUsuario>('Usuario', UsuarioSchema);
export default Usuario;