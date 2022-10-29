import { Request, Response } from 'express';
import logger from '../utils/logger';

import {
  CreateOrderInput,
  ReadOrdeInput,
  UpdateOrderInput,
  DeleteOrderInput,
} from '../validations/orders.schema';

import {
  createOrder,
  deleteOrder,
  findOrders,
  findOrder,
  updateOrder,
} from '../services/order.service';
import { validateObjectID } from '../utils/validateObjectId';
import { createOrderDetail } from '../services/orderDetail.service';

export async function createOrderHandler(
  req: Request<{}, {}, CreateOrderInput['body']>,
  res: Response
) {
  try {
    const {
      orderNumber,
      channel,
      orderType,
      tableNumber,
      employee,
      shipping,
      customer,
      status,
      description,
      orderItems
    } = req.body;

    const orderSave = {
      orderNumber,
      channel,
      orderType,
      tableNumber,
      employee,
      shipping,
      customer,
      status,
      description,
      isActive: true
    }

    const order = await createOrder(orderSave);

    await Promise.all(
      orderItems.map(async(orderItem) => await createOrderDetail({ ...orderItem, order: order._id, isActive: true }))
    );

    return res.status(201).json({
      ok: true,
      message: 'Orden creada exitosamente',
      data: order,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: true,
      message: error.message,
    });
  }
}

export async function findOrdersHandler(req: Request, res: Response) {
  try {
    const orders = await findOrders();

    return res.status(200).json({
      ok: true,
      data: orders,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function findOrderHandler(
  req: Request<ReadOrdeInput['params']>,
  res: Response
) {
  try {
    const orderId = req.params.orderId;

    const message = validateObjectID(orderId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const order = await findOrder(orderId);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada',
      });
    }

    return res.status(200).json({
      ok: true,
      data: order,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function updateOrderHandler(
  req: Request<UpdateOrderInput['params']>,
  res: Response
) {
  try {
    const orderId = req.params.orderId;

    const message = validateObjectID(orderId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }
    const order = await findOrder(orderId);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada',
      });
    }

    await updateOrder(orderId, req.body);

    return res.status(200).json({
      ok: true,
      message: 'Orden actualizada exitosamente',
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function deleteOrderHandler(
  req: Request<DeleteOrderInput['params']>,
  res: Response
) {
  try {
    const orderId = req.params.orderId;

    const message = validateObjectID(orderId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const order = await findOrder(orderId);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada',
      });
    }

    await deleteOrder(order._id);

    return res.status(200).json({
      ok: true,
      message: 'Orden eliminada exitosamente',
      data: order,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}
