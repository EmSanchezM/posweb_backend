import { object, string, number, TypeOf } from 'zod';

const payload = {
  body: object({
    orderNum: number({
      required_error: 'Numero de Order es requerida',
    }).positive(),

    canal: string({
      required_error: 'canal de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderType: string({
      required_error: 'orderType de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    tableNum: number().positive(),

    employee: string().trim(),
    shipping: string().trim(),
    customer: string().trim(),

    status: string().trim(),
    description: string().trim(),
  }),
};

const updatePayload = {
  body: object({
    orderNum: number({
      required_error: 'Numero de Order es requerida',
    }).positive(),

    canal: string({
      required_error: 'canal de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderType: string({
      required_error: 'orderType de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    tableNum: number().positive(),

    employee: string().trim(),
    shipping: string().trim(),
    customer: string().trim(),

    status: string().trim(),
    description: string().trim(),
  }),
};

const params = {
  params: object({
    orderId: string({
      required_error: 'Order ID es requerido',
    }),
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
