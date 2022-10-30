import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import OrderDetail, { OrderDetailDocument } from '../models/orderDetails.model';

export async function createOrderDetail(
  input: DocumentDefinition<
    Omit<OrderDetailDocument, 'createdAt' | 'updatedAt'>
  >
) {
  try {
    const orderDetail = await OrderDetail.create(input);

    return orderDetail;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findOrderDetails() {
  try {
    const orderDetails = await OrderDetail.find();

    return orderDetails;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findOrderDetail(orderDetailId: string) {
  try {
    const orderDetail = await OrderDetail.findById(orderDetailId);

    return orderDetail;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateOrderDetail(
  orderDetailId: string,
  orderDetailUpdate: UpdateQuery<OrderDetailDocument>
) {
  try {
    const orderDetail = OrderDetail.findByIdAndUpdate(
      orderDetailId,
      orderDetailUpdate
    );

    return orderDetail;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteOrderDetail(orderDetailId: string) {
  try {
    return OrderDetail.findByIdAndDelete(orderDetailId);
  } catch (error: any) {
    throw new Error(error);
  }
}
