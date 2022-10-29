import mongoose from 'mongoose';
import { CustomerDocument } from './customer.model';
import { AddressDocument } from './address.model';

export interface ShippingDocument extends mongoose.Document {
  customer: CustomerDocument['_id'];
  cost: Number; 
  status: String; 
  deliverName: String;
  deliverTimeOut: Date;
  description: string; 
  address: AddressDocument['_id'];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shippingSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, trim: true },
    deliverName: { type: String, trim: true },
    deliverTimeOut: { type: Date, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Shipping = mongoose.model<ShippingDocument>('Shipping', shippingSchema);

export default Shipping;
