import { object, string, number, TypeOf, array } from 'zod';

const payload = {
  body: object({
    orderNumber: number({
      required_error: 'Numero de Order es requerida',
    }).positive(),

    channel: string({
      required_error: 'canal de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderType: string({
      required_error: 'orderType de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderItems: array(
      object({
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

const updatePayload = {
  body: object({
    orderNumber: number({
      required_error: 'Numero de Order es requerida',
    }).positive(),

    channel: string({
      required_error: 'canal de la order es requerido',
    })
      .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
      .trim(),

    orderType: string({
      required_error: 'orderType de la order es requerido',
    })
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
