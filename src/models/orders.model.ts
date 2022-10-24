import mongoose from 'mongoose';
import { EmployeeDocument } from './employee.model';
import { ShippingDocument } from './shipping.model';
import { CustomerDocument } from './customer.model';

export interface OrderDocument extends mongoose.Document {
  orderNum: number;
  canal: string; //pedido web, desde mesa, mesero
  orderType: string; //llevar, comer aqui, recoger
  tableNum: Number; // numero de mesa si es ordentype = comer aqui

  employee: EmployeeDocument['_id']; // empleado que la ha creado , mesero
  shipping: ShippingDocument['_id']; //en caso de ordenType = llevar
  customer: CustomerDocument['_id']; //en caso de canal = pedido web

  status: string; //abierta, facturada,
  description: string; //detalles del pedido
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    orderNum: { type: Number, required: true },
    canal: { type: String, required: true, trim: true },
    orderType: { type: String, required: true, trim: true },
    tableNum: { type: Number },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: false, //depende del canal, solo si es por mesero
    },
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipping',
      required: false, //depende del canal, , solo si es por web
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false, //depende del canal, , solo si es por web
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
