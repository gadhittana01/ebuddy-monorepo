import express from 'express';
import { 
  fetchUserData, 
  updateUserData, 
  fetchTopUsers, 
  createUserWithFirebase 
} from '../controller/api';
import { firebaseAuthMiddleware } from '../middleware/firebaseAuthMiddleware';
import { activityTrackingMiddleware } from '../middleware/activityTrackingMiddleware';

const router = express.Router();

router.post('/', createUserWithFirebase);
router.get('/:id', firebaseAuthMiddleware, activityTrackingMiddleware, fetchUserData);
router.put('/:id', firebaseAuthMiddleware, activityTrackingMiddleware, updateUserData);
router.get('/', firebaseAuthMiddleware, activityTrackingMiddleware, fetchTopUsers);

export default router;
