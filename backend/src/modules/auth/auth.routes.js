import { Router } from 'express';
import { requireMasterDataDatabase } from '../../middleware/masterDataAccess.js';
import { forgotPassword, resetPassword, signIn, signUp } from './auth.controller.js';

const router = Router();

router.use(requireMasterDataDatabase);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
