import { Schema, model, Document } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  role: string;
  category: 'director' | 'secretary' | 'employee';
  photoUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
  order: number;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, enum: ['director', 'secretary', 'employee'], required: true },
  photoUrl: { type: String },
  email: { type: String },
  phone: { type: String },
  bio: { type: String },
  order: { type: Number, default: 0 }
});

export default model<IEmployee>('Employee', EmployeeSchema);
