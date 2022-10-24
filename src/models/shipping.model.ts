import mongoose from 'mongoose';
import { CustomerDocument } from './customer.model';
import { AddressDocument } from './address.model';

export interface ShippingDocument extends mongoose.Document {
  customer: CustomerDocument['_id']; //aqui etan los datos de la direccion de entrega
  cost: Number; //costo del shipping
  status: String; //estatus de la entrega
  deliverName: String; // nombre del repartidor
  deliverTimeOut: Date; //fecha y hora de salida
  description: string; //detalles del shiping
  address: AddressDocument['_id']; //direccion de envio
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
