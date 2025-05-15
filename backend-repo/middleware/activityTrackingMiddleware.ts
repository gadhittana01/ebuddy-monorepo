import { Request, Response, NextFunction } from 'express';
import { updateUserActivityByFirebaseUid } from '../repository/userCollection';

export const activityTrackingMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const firebaseUid = req.userId;
    
    if (firebaseUid) {
      const now = Math.floor(Date.now() / 1000);
      
      updateUserActivityByFirebaseUid(firebaseUid, now).catch(err => {
        console.error('Error updating user activity:', err);
      });
    }
    
    next();
  } catch (error) {
    console.error('Activity tracking error:', error);
    next();
  }
}; 