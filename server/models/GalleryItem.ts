import { Schema, model, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title?: string;
  description?: string;
  imageUrl: string;
  createdAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IGalleryItem>('GalleryItem', GalleryItemSchema);
