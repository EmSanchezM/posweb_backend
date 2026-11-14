import { object, string, number, boolean, date, TypeOf } from 'zod';
import { required } from './errorMessages';

const payload = {
  body: object({
    number: string(required('El Nunero de Factura es requerida')).trim(),

    CAI: string(required('El CAI de Factura es requerida')).trim(),

    employee: string(required('El employeeId de Factura es requerida')).trim(),

    order: string(required('El orderId de Factura es requerida')).trim(),

    dateTime: date(required('La Fecha de Factura es requerida')),

    subTotal: number(required('El SubTotal es requerido')).positive(),

    discount: number(required('El Descount es requerido')).positive(),

    tax: number(required('El Impuesto es requerido')).positive(),

    shippingCost: number(required('El shippingCost es requerido')).positive(),

    tips: number(required('La Propina es requerida')).positive(),

    total: number(required('El Total es requerido')).positive(),

    paymentMethod: string().trim(),

    rtn: string()
      .min(14, { message: 'Debe tener 14 o más caracteres de largo' })
      .trim(),

    details: string().trim(),

    isActive: boolean().default(true),
  }),
};

const updatePayload = {
  body: object({
    number: string(required('El Nunero de Factura es requerida')).trim(),

    dateTime: date(required('La Fecha de Factura es requerida')),

    CAI: string(required('El CAI de Factura es requerida')).trim(),

    employee: string(required('El employeeId de Factura es requerida')).trim(),

    order: string(required('El orderId de Factura es requerida')).trim(),

    subTotal: number(required('El SubTotal es requerido')).positive(),

    discount: number(required('El Descount es requerido')).positive(),

    tax: number(required('El Impuesto es requerido')).positive(),

    shippingCost: number(required('El shippingCost es requerido')).positive(),

    tips: number(required('La Propina es requerida')).positive(),

    total: number(required('El Total es requerido')).positive(),

    paymentMethod: string().trim(),

    rtn: string()
      .min(14, { message: 'Debe tener 14 o más caracteres de largo' })
      .trim(),

    details: string().trim(),
  }),
};

const params = {
  params: object({
    invoiceId: string(required('Invoice ID es requerido')),
  }),
};

export const createInvoiceSchema = object({
  ...payload,
});

export const getInvoiceSchema = object({
  ...params,
});

export const updateInvoiceSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteInvoiceSchema = object({
  ...params,
});

export type CreateInvoiceInput = TypeOf<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = TypeOf<typeof updateInvoiceSchema>;
export type ReadInvoiceInput = TypeOf<typeof getInvoiceSchema>;
export type DeleteInvoiceInput = TypeOf<typeof deleteInvoiceSchema>;
