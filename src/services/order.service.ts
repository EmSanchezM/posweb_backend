import { isNull, omit } from 'lodash';
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import Order, { OrderDocument } from '../models/orders.model';

export async function createOrder(
  input: DocumentDefinition<Omit<OrderDocument, 'createdAt' | 'updatedAt'>>
) {
  try {
    const order = await Order.create(input);

    return order;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findOrders() {
  try {
    const orders = await Order.find();

    return orders;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findOrder(orderId: string) {
  try {
    const order = await Order.findById(orderId);

    return order;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateOrder(
  orderId: string,
  orderUpdate: UpdateQuery<OrderDocument>
) {
  try {
    const order = Order.findByIdAndUpdate(orderId, orderUpdate);

    return order;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteOrder(orderId: string) {
  try {
    return Order.findByIdAndDelete(orderId);
  } catch (error: any) {
    throw new Error(error);
  }
}
