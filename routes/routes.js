import express from 'express';
import { CustomerOrders } from '../controlles/Order.control.js';
import { cutomerData } from '../controlles/Order.control.js';

const router = express.Router();

router.post('/customer-order', CustomerOrders);
router.get('/customerdata', cutomerData);

export default router;