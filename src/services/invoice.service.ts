import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import Invoice, { InvoiceDocument } from '../models/invoice.model';

export async function createInvoice(
  input: DocumentDefinition<Omit<InvoiceDocument, 'createdAt' | 'updatedAt'>>
) {
  try {
    const invoice = await Invoice.create(input);
    return invoice;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findInvoices() {
  try {
    const invoices = await Invoice.find().populate('order');

    return invoices;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findInvoice(invoiceId: string) {
  try {
    const invoice = await Invoice.findById(invoiceId);

    return invoice;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateInvoice(
  invoiceId: string,
  invoiceUpdate: UpdateQuery<InvoiceDocument>
) {
  try {
    const customer = await Invoice.findByIdAndUpdate(
      invoiceId,
      invoiceUpdate
    ).populate('order');

    return customer;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    return Invoice.findByIdAndDelete(invoiceId);
  } catch (error: any) {
    throw new Error(error);
  }
}
