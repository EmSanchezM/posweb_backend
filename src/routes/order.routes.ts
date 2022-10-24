import { Router } from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';

//Areas
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
router.get('/api/order', findOrdersHandler);
router.get(
  '/api/order/:orderId',
  [requireUser, validateResource(getOrderSchema)],
  findOrderHandler
);
router.post(
  '/api/order',
  [requireUser, validateResource(createOrderSchema)],
  createOrderHandler
);
router.put(
  '/api/order/:orderId',
  [requireUser, validateResource(updateOrderSchema)],
  updateOrderHandler
);
router.delete(
  '/api/order/:orderId',
  [requireUser, validateResource(deleteOrderSchema)],
  deleteOrderHandler
);

export default router;
