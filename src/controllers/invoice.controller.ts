import { Request, Response } from 'express';
import logger from '../utils/logger';

import {
  CreateInvoiceInput,
  ReadInvoiceInput,
  UpdateInvoiceInput,
  DeleteInvoiceInput,
} from '../validations/invoice.schema';

import {
  createInvoice,
  findInvoice,
  findInvoices,
  updateInvoice,
  deleteInvoice,
} from '../services/invoice.service';
import { validateObjectID } from '../utils/validateObjectId';

export async function createInvoiceHandler(
  req: Request<{}, {}, CreateInvoiceInput['body']>,
  res: Response
) {
  try {
    const {
      number,
      employee,
      order,
      CAI,
      dateTime,
      subTotal,
      discount,
      tax,
      shippingCost,
      tips,
      total,
      paymentMethod,
      rtn,
      details,
    } = req.body;

    const invoiceSave = {
      number,
      employee,
      order,
      CAI,
      dateTime,
      subTotal,
      discount,
      tax,
      shippingCost,
      tips,
      total,
      paymentMethod,
      rtn,
      details,
      isActive: true,
    };

    const invoice = await createInvoice(invoiceSave);

    return res.status(201).json({
      ok: true,
      message: 'Invoice creado exitosamente',
      data: invoice,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: true,
      message: error.message,
    });
  }
}

export async function findInvoicesHandler(req: Request, res: Response) {
  try {
    const invoices = await findInvoices();

    return res.status(200).json({
      ok: true,
      data: invoices,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function findInvoiceHandler(
  req: Request<ReadInvoiceInput['params']>,
  res: Response
) {
  try {
    const invoiceId = req.params.invoiceId;

    const message = validateObjectID(invoiceId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const invoice = await findInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        ok: false,
        message: 'Invoice no encontrado',
      });
    }

    return res.status(200).json({
      ok: true,
      data: invoice,
    });
  } catch (error: any) {
    logger.error(error);

    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function updateInvoiceHandler(
  req: Request<UpdateInvoiceInput['params']>,
  res: Response
) {
  try {
    const invoiceId = req.params.invoiceId;

    const {
      number,
      employeeId,
      orderId,
      CAI,
      datetime,
      subtotal,
      descount,
      tax,
      shippingCost,
      tips,
      total,
      paymentMethod,
      rtn,
      details,
      isActive,
    } = req.body;

    const message = validateObjectID(invoiceId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const invoiceFind = await findInvoice(invoiceId);

    if (!invoiceFind) {
      return res.status(404).json({
        ok: false,
        message: 'Invoice no encontrado',
      });
    }

    const invoice = await updateInvoice(invoiceId, req.body);

    return res.status(200).json({
      ok: true,
      message: 'Invoice actualizado exitosamente',
      data: invoice,
    });
  } catch (error: any) {
    logger.error(error);

    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function deleteInvoiceHandler(
  req: Request<DeleteInvoiceInput['params']>,
  res: Response
) {
  try {
    const invoiceId = req.params.invoiceId;

    const message = validateObjectID(invoiceId);

    if (message !== '') {
      return res.status(400).send({
        ok: false,
        message,
      });
    }

    const invoice = await findInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        ok: false,
        message: 'Invoice no encontrado',
      });
    }

    await deleteInvoice(invoice._id);

    return res.status(200).json({
      ok: true,
      message: 'Invoice eliminado exitosamente',
      data: invoice,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).json({
      ok: false,
      message: error.message,
    });
  }
}
