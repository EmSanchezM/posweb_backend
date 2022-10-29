import mongoose from 'mongoose';
import { EmployeeDocument } from './employee.model';
import { ShippingDocument } from './shipping.model';
import { CustomerDocument } from './customer.model';

export interface OrderDocument extends mongoose.Document {
  orderNumber: number;
  channel: string; //pedido web, desde mesa, mesero
  orderType: string; //llevar, comer aqui, recoger
  tableNumber: Number; 

  employee: EmployeeDocument['_id']; // empleado que la ha creado , mesero
  shipping: ShippingDocument['_id']; //en caso de ordenType = llevar
  customer: CustomerDocument['_id']; //en caso de canal = pedido web

  status: string; //abierta, facturada,
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true },
    channel: { type: String, required: true, trim: true },
    orderType: { type: String, required: true, trim: true },
    tableNumber: { type: Number },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipping'
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },

    status: { type: String, default: 'open', trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
