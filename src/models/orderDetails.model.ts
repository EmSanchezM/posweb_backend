import mongoose from 'mongoose';
import { OrderDocument } from './orders.model';
import { ProductDocument } from './product.model';

export interface OrderDetailDocument extends mongoose.Document {
  order: OrderDocument['_id']; // id de la orden a la que pertenece
  product: ProductDocument['_id'];
  quantity: Number; //cantidad
  price: Number; //precio
  subTotal: Number; // cantidad X precio
  tax: Number; // impuestos
  discount: Number; // descuento
  total: Number; // subTotal + tax - discount

  notes: string; //detalles de este producto pedido
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderDetailSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0.0 },
    total: { type: Number, required: true },

    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OrderDetail = mongoose.model<OrderDetailDocument>(
  'OrderDetail',
  orderDetailSchema
);

export default OrderDetail;
