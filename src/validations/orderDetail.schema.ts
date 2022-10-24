import { object, string, number, TypeOf, boolean } from 'zod';

const payload = {
  body: object({
    order: string({
      required_error: 'Order ID es requerido',
    }),

    product: string({
      required_error: 'Product ID es requerido',
    }),

    quantity: number({
      required_error: 'Cantidad del Producto es requerida',
    }).positive(),

    price: number({
      required_error: 'Precio del Producto es requerida',
    }).positive(),

    subTotal: number({
      required_error: 'subTotal del OrderDetail es requerida',
    }).positive(),

    tax: number({
      required_error: 'Impuestos del Producto es requerida',
    }).positive(),

    discount: number().positive(),

    total: number({
      required_error: 'total de OrderDetail es requerida',
    }).positive(),

    notes: string().trim(),
  }),
};

const updatePayload = {
  body: object({
    order: string({
      required_error: 'Order ID es requerido',
    }),

    product: string({
      required_error: 'Product ID es requerido',
    }),

    quantity: number({
      required_error: 'Cantidad del Producto es requerida',
    }).positive(),

    price: number({
      required_error: 'Precio del Producto es requerida',
    }).positive(),

    subTotal: number({
      required_error: 'subTotal del OrderDetail es requerida',
    }).positive(),

    tax: number({
      required_error: 'Impuestos del Producto es requerida',
    }).positive(),

    discount: number().positive(),

    total: number({
      required_error: 'total de OrderDetail es requerida',
    }).positive(),

    notes: string().trim(),
  }),
};

const params = {
  params: object({
    orderDetailId: string({
      required_error: 'OrderDetail ID es requerido',
    }),
  }),
};

export const createOrderDetailSchema = object({
  ...payload,
});

export const getOrderDetailSchema = object({
  ...params,
});

export const updateOrderDetailSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteOrderDetailSchema = object({
  ...params,
});

export type CreateOrderDetailInput = TypeOf<typeof createOrderDetailSchema>;
export type ReadOrdeDetailInput = TypeOf<typeof getOrderDetailSchema>;
export type UpdateOrderDetailInput = TypeOf<typeof updateOrderDetailSchema>;
export type DeleteOrderDetailInput = TypeOf<typeof deleteOrderDetailSchema>;
