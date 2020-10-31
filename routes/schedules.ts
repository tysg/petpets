import { Router } from 'express';
import * as schedulesController from '../controllers/schedulesController';

export const router = Router();

router.post('/part_time', schedulesController.createPT);
router.post('/full_time', schedulesController.createFT);
router.post('/part_time/:email/', schedulesController.update);
router.post('/full_time/:email/', schedulesController.update);
router.post('/:cardholder/:cardNumber', schedulesController.remove);
router.get('/:cardholder', schedulesController.index);
router.get('/:cardholder/:cardNumber', schedulesController.get);

export default router;
