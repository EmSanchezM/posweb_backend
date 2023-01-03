import { Router } from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';

//Invoices
import {
  createInvoiceHandler,
  findInvoiceHandler,
  findInvoicesHandler,
  updateInvoiceHandler,
  deleteInvoiceHandler,
} from '../controllers/invoice.controller';

import {
  getInvoiceSchema,
  createInvoiceSchema,
  updateInvoiceSchema,
  deleteInvoiceSchema,
} from '../validations/invoice.schema';

const router = Router();

// Invoices routes
router.get('/api/invoices', findInvoicesHandler);
router.get(
  '/api/invoice/:invoiceId',
  [requireUser, validateResource(getInvoiceSchema)],
  findInvoiceHandler
);
router.post(
  '/api/invoices',
  [requireUser, validateResource(createInvoiceSchema)],
  createInvoiceHandler
);
router.put(
  '/api/invoice/:invoiceId',
  [requireUser, validateResource(updateInvoiceSchema)],
  updateInvoiceHandler
);
router.delete(
  '/api/invoice/:invoiceId',
  [requireUser, validateResource(deleteInvoiceSchema)],
  deleteInvoiceHandler
);

export default router;
