import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      firebaseUser?: admin.auth.DecodedIdToken;
    }
  }
}

export const firebaseAuthMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.userId = decodedToken.uid;
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}; 