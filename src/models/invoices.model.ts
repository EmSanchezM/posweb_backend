import mongoose from 'mongoose';
import { OrderDocument } from './orders.model';
import { EmployeeDocument } from './employee.model';

export interface InvoiceDocument extends mongoose.Document {
  order: OrderDocument['_id']; // id de la orden a la que pertenece
  employee: EmployeeDocument['_id']; // empleado que la creado la factura , no la orden
  dateTime: Date; //fecha y hora de creacion de la factura

  subTotal: Number; // suma de subtotales de orderDetails
  tax: Number; // suma de impuestos de orderDetails
  discount: Number; // suma de descuentos de orderDetails

  tips: Number; // propina para el mesero
  shippingCost: Number; // precio  del shipping, esta en orden

  total: Number; // suma de totales de orderDetails + tips + shippingCost

  paymentMethod: String; // efectivo, tarjeta, transferencia, etc
  rtn: String; // efectivo, tarjeta, transferencia, etc
  details: string; //detalles de la factura

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    dateTime: { type: Number, required: true },
    subTotal: { type: String, required: true, default: 0.0 },
    tax: { type: String, required: true, default: 0.0 },
    discount: { type: String, required: true, default: 0.0 },
    tips: { type: String, required: true, default: 0.0 },
    shippingCost: { type: String, required: true, default: 0.0 },
    total: { type: String, required: true, default: 0.0 },

    paymentMethod: { type: String, required: true, trim: true },
    rtn: { type: String, trim: true },
    details: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Invoice = mongoose.model<InvoiceDocument>('Invoice', invoiceSchema);

export default Invoice;
