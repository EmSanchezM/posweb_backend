import { object, string, number, boolean, TypeOf } from "zod";

const payload = {
    body: object({
        name: string({
            required_error: 'Nombre es requerido'
        })
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        description: string().trim(),

        category: string({
            required_error: 'Category ID es requerida'
        }),

        supplier: string({
            required_error: 'Supplier ID es requerido'
        }),

        price1: number({
            required_error: 'Price es requerido'
        }).positive(),

        price2: number().positive(),

        price3: number().positive(),

        price4: number().positive(),

        cost: number({
            required_error: 'Costo es requerido'
        })
        .positive(),

        inStock: number({
            required_error: 'Stock es requerido'
        }).positive(),

        brand: string().trim(),

        serie: string().trim(),

        color: string().trim(),

        year: string().trim(),

        weight: string().trim(),

        size: string().trim(),

        minCount: number({
            required_error: 'Cantidad minima es requerida'
        }).positive(),

        expiredDate: string().trim(),

        expiredSaleDate: string().trim(),

        isConsumible: boolean()
    })
};

const updatePayload = {
    body: object({
        name: string()
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim()
        .optional(),

        description: string().trim().optional(),

        category: string().trim(),

        supplier: string().trim(),

        price1: number().positive().optional(),

        price2: number().positive().optional(),

        price3: number().positive().optional(),

        price4: number().positive().optional(),

        cost: number().positive().optional(),

        brand: string().trim().optional(),

        serie: string().trim().optional(),

        color: string().trim().optional(),

        year: string().trim().optional(),

        weight: string().trim().optional(),

        size: string().trim().optional(),

        minCount: number().positive().optional(),

        expiredDate: string().trim().optional(),

        expiredSaleDate: string().trim().optional(),

        isConsumible: boolean()
    })
};

const params = {
    params: object({
        productId: string({
            required_error: 'Product ID es requerido'
        }),
    }),
};

export const createProductSchema = object({
    ...payload
});

export const getProductSchema = object({
    ...params 
});

export const updateProductSchema = object({
    ...updatePayload,
    ...params
});

export const deleteProductSchema = object({
    ...params 
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type ReadProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;