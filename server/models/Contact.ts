import { Schema, model, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  contact?: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  contact: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IContact>('Contact', ContactSchema);
