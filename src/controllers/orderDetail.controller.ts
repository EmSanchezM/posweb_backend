import { Request, Response } from 'express';
import logger from '../utils/logger';

import {
  CreateOrderDetailInput,
  ReadOrdeDetailInput,
  UpdateOrderDetailInput,
  DeleteOrderDetailInput,
} from '../validations/orderDetail.schema';

import {
  createOrderDetail,
  deleteOrderDetail,
  findOrderDetails,
  findOrderDetail,
  updateOrderDetail,
} from '../services/orderDetail.service';
import { validateObjectID } from '../utils/validateObjectId';

export async function createOrderDetailHandler(
  req: Request<{}, {}, CreateOrderDetailInput['body']>,
  res: Response
) {
  try {
    const orderDetailSave = {
      ...req.body,
      isActive: true,
    };

    const orderDetail = await createOrderDetail(orderDetailSave);

    return res.status(201).json({
      ok: true,
      message: 'OrdenDetail creada exitosamente',
      data: orderDetail,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: true,
      message: error.message,
    });
  }
}

export async function findOrderDetailsHandler(req: Request, res: Response) {
  try {
    const ordersDetails = await findOrderDetails();

    return res.status(200).json({
      ok: true,
      data: ordersDetails,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function findOrderDetailHandler(
  req: Request<ReadOrdeDetailInput['params']>,
  res: Response
) {
  try {
    const orderDetailId = req.params.orderDetailId;

    const message = validateObjectID(orderDetailId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const orderDetail = await findOrderDetail(orderDetailId);

    if (!orderDetail) {
      return res.status(404).json({
        ok: false,
        message: 'OrderDetail no encontrada',
      });
    }

    return res.status(200).json({
      ok: true,
      data: orderDetail,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function updateOrderDetailHandler(
  req: Request<UpdateOrderDetailInput['params']>,
  res: Response
) {
  try {
    const orderDetailId = req.params.orderDetailId;

    const message = validateObjectID(orderDetailId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }
    const orderDetail = await findOrderDetail(orderDetailId);

    if (!orderDetail) {
      return res.status(404).json({
        ok: false,
        message: 'OrderDetail no encontrada',
      });
    }

    await updateOrderDetail(orderDetailId, req.body);

    return res.status(200).json({
      ok: true,
      message: 'OrdenDetail actualizada exitosamente',
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function deleteOrderDetailHandler(
  req: Request<DeleteOrderDetailInput['params']>,
  res: Response
) {
  try {
    const orderDetailId = req.params.orderDetailId;

    const message = validateObjectID(orderDetailId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const orderDetail = await findOrderDetail(orderDetailId);

    if (!orderDetail) {
      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada',
      });
    }

    await deleteOrderDetail(orderDetail._id);

    return res.status(200).json({
      ok: true,
      message: 'OrdenDetail eliminada exitosamente',
      data: orderDetail,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}
