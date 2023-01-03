import { object, string, number, boolean, date, TypeOf } from 'zod';

const payload = {
  body: object({
    number: string({
      required_error: 'El Nunero de Factura es requerida',
    }).trim(),

    CAI: string({
      required_error: 'El CAI de Factura es requerida',
    }).trim(),

    employee: string({
      required_error: 'El employeeId de Factura es requerida',
    }).trim(),

    order: string({
      required_error: 'El orderId de Factura es requerida',
    }).trim(),

    dateTime: date({
      required_error: 'La Fecha de Factura es requerida',
    }),

    subTotal: number({
      required_error: 'El SubTotal es requerido',
    }).positive(),

    discount: number({
      required_error: 'El Descount es requerido',
    }).positive(),

    tax: number({
      required_error: 'El Impuesto es requerido',
    }).positive(),

    shippingCost: number({
      required_error: 'El shippingCost es requerido',
    }).positive(),

    tips: number({
      required_error: 'La Propina es requerida',
    }).positive(),

    total: number({
      required_error: 'El Total es requerido',
    }).positive(),

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
    number: string({
      required_error: 'El Nunero de Factura es requerida',
    }).trim(),

    dateTime: date({
      required_error: 'La Fecha de Factura es requerida',
    }),

    CAI: string({
      required_error: 'El CAI de Factura es requerida',
    }).trim(),

    employee: string({
      required_error: 'El employeeId de Factura es requerida',
    }).trim(),

    order: string({
      required_error: 'El orderId de Factura es requerida',
    }).trim(),

    subTotal: number({
      required_error: 'El SubTotal es requerido',
    }).positive(),

    discount: number({
      required_error: 'El Descount es requerido',
    }).positive(),

    tax: number({
      required_error: 'El Impuesto es requerido',
    }).positive(),

    shippingCost: number({
      required_error: 'El shippingCost es requerido',
    }).positive(),

    tips: number({
      required_error: 'La Propina es requerida',
    }).positive(),

    total: number({
      required_error: 'El Total es requerido',
    }).positive(),

    paymentMethod: string().trim(),

    rtn: string()
      .min(14, { message: 'Debe tener 14 o más caracteres de largo' })
      .trim(),

    details: string().trim(),
  }),
};

const params = {
  params: object({
    invoiceId: string({
      required_error: 'Invoice ID es requerido',
    }),
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
