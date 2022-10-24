import { Router } from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';

//Orders Details
import {
  createOrderDetailHandler,
  findOrderDetailHandler,
  findOrderDetailsHandler,
  updateOrderDetailHandler,
  deleteOrderDetailHandler,
} from '../controllers/orderDetail.controller';

import {
  getOrderDetailSchema,
  createOrderDetailSchema,
  updateOrderDetailSchema,
  deleteOrderDetailSchema,
} from '../validations/orderDetail.schema';

const router = Router();

// OrdersDetails routes
router.get('/api/orderDetail', findOrderDetailsHandler);
router.get(
  '/api/orderDetail/:orderDetailId',
  [requireUser, validateResource(getOrderDetailSchema)],
  findOrderDetailHandler
);
router.post(
  '/api/orderDetail',
  [requireUser, validateResource(createOrderDetailSchema)],
  createOrderDetailHandler
);
router.put(
  '/api/orderDetail/:orderDetailId',
  [requireUser, validateResource(updateOrderDetailSchema)],
  updateOrderDetailHandler
);
router.delete(
  '/api/orderDetail/:orderDetailId',
  [requireUser, validateResource(deleteOrderDetailSchema)],
  deleteOrderDetailHandler
);

export default router;
