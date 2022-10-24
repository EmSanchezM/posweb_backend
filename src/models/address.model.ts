import mongoose from 'mongoose';
import { CustomerDocument } from './customer.model';

export interface AddressDocument extends mongoose.Document {
  customer: CustomerDocument['_id']; //aqui etan los datos de la direccion de entrega
  name: String; // casa , trabajo, etc
  city: String;
  address1: String;
  address2: String;
  details: String;
  phone: String;
}

const addressSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address1: { type: String, required: true, trim: true },
    address2: { type: String, trim: true },
    details: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Address = mongoose.model<AddressDocument>('Address', addressSchema);

export default Address;
