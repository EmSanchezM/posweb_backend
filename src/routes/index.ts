import { Router } from 'express';

import area from './area.routes';
import category from './category.routes';
import product from './product.routes';
import customer from './customer.routes';
import supplier from './supplier.routes';
import auth from './auth.routes';
import order from './order.routes';

const router = Router();

router.use(auth);
router.use(area);
router.use(product);
router.use(category);
router.use(customer);
router.use(supplier);
router.use(order);

export default router;
