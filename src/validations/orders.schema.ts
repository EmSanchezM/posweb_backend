import { object, string, number, TypeOf, array } from 'zod';
import { required } from './errorMessages';

const payload = {
  body: object({
    orderNumber: number(required('Numero de Order es requerida')).positive(),

    channel: string(required('canal de la order es requerido'))
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderType: string(required('orderType de la order es requerido'))
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderItems: array(
      object({
        product: string(required('Product ID es requerido')),

        quantity: number(required('Cantidad del Producto es requerida')).positive(),

        price: number(required('Precio del Producto es requerida')).positive(),

        subTotal: number(required('subTotal del OrderDetail es requerida')).positive(),

        tax: number(required('Impuestos del Producto es requerida')).positive(),

        discount: number(),

        total: number(required('total de OrderDetail es requerida')).positive(),

        notes: string().trim(),
      })
    ),

    tableNumber: number().positive(),

    employee: string().trim(),
    shipping: object({
      cost: number().positive(),
      status: string().trim(), 
      deliverName: string().trim(),
      deliverTimeOut: string(),
      descriptionShipping: string().trim(),
      country: string(),
      department: string(),
      city: string(),
      typeAddress: string(),
      address1: string(),
      address2: string(),
      phone: string(),
      details: string(),
    }),

    customer: object({
      identidad: string().trim(),
      name: string().trim(),
      lastName: string().trim(),
      email: string().trim(),
      country: string().trim(),
      city: string().trim(),
      location: string().trim()
    }),

    status: string().trim(),
    description: string().trim(),
  }),
};

const updatePayload = {
  body: object({
    orderNumber: number(required('Numero de Order es requerida')).positive(),

    channel: string(required('canal de la order es requerido'))
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderType: string(required('orderType de la order es requerido'))
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderItems: array(
      object({
        product: string(),

        quantity: number().positive(),

        price: number().positive(),

        subTotal: number().positive(),

        tax: number().positive(),

        discount: number().positive(),

        total: number().positive(),

        notes: string().trim(),
      })
    ),

    tableNumber: number().positive(),

    employee: string().trim(),
    shipping: string().trim(),
    customer: string().trim(),

    status: string().trim(),
    description: string().trim(),
  }),
};

const params = {
  params: object({
    orderId: string(required('Order ID es requerido')),
  }),
};

export const createOrderSchema = object({
  ...payload,
});

export const getOrderSchema = object({
  ...params,
});

export const updateOrderSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteOrderSchema = object({
  ...params,
});

export type CreateOrderInput = TypeOf<typeof createOrderSchema>;
export type ReadOrdeInput = TypeOf<typeof getOrderSchema>;
export type UpdateOrderInput = TypeOf<typeof updateOrderSchema>;
export type DeleteOrderInput = TypeOf<typeof deleteOrderSchema>;
