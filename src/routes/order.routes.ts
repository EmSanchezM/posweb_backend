import { Router } from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';

import {
  createOrderHandler,
  findOrderHandler,
  findOrdersHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from '../controllers/orders.controller';

import {
  getOrderSchema,
  createOrderSchema,
  updateOrderSchema,
  deleteOrderSchema,
} from '../validations/orders.schema';

const router = Router();

// Orders routes
router.get('/api/orders', findOrdersHandler);
router.get(
  '/api/orders/:orderId',
  [requireUser, validateResource(getOrderSchema)],
  findOrderHandler
);
router.post(
  '/api/orders',
  [requireUser, validateResource(createOrderSchema)],
  createOrderHandler
);
router.put(
  '/api/orders/:orderId',
  [requireUser, validateResource(updateOrderSchema)],
  updateOrderHandler
);
router.delete(
  '/api/orders/:orderId',
  [requireUser, validateResource(deleteOrderSchema)],
  deleteOrderHandler
);

export default router;
