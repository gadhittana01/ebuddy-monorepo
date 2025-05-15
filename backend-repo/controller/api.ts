import { Request, Response } from 'express';
import { createUser, getTopUsers, getUser, updateUser, getUserByEmail, getUserByFirebaseUid} from '../repository/userCollection';
import { admin } from '../config/firebaseConfig';

export const fetchUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId; 
    
    console.log(`Fetching user data for ID: ${id}, authenticated user: ${userId}`);
    
    let user = await getUser(id);
    
    if (!user) {
      console.log(`User not found by Firestore ID, trying Firebase Auth UID`);
      user = await getUserByFirebaseUid(id);
    }
    
    if (user) {
      res.json({ user });
    } else {
      console.log(`User not found with ID: ${id}`);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
  }
};

export const updateUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const data = req.body;
    
    const { recentlyActive, ...updateData } = data;
    
    if (recentlyActive !== undefined) {
      console.warn('Attempt to directly update recentlyActive field was ignored. This field is automatically maintained by the system.');
    }
    
    let user = await getUser(id);
    let firestoreId = id;
    
    if (!user) {
      console.log(`User not found by Firestore ID, trying Firebase Auth UID`);
      user = await getUserByFirebaseUid(id);
      if (user) {
        firestoreId = user.id;
      }
    }
    
    if (!user) {
      console.log(`User not found with ID: ${id}`);
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    await updateUser(firestoreId, updateData);
    
    const updatedUser = await getUser(firestoreId);
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
  }
};

export const fetchTopUsers = async (req: Request, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string) || 10;
  const lastScore = req.query.lastScore ? parseFloat(req.query.lastScore as string) : undefined;
  const userId = req.userId; 

  try {
    const snapshot = await getTopUsers(limit, lastScore);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data()
    }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastVisible ? {
      lastScore: lastVisible.get('potentialScore'),
    } : null;

    res.json({ users, nextCursor });
  } catch (err) {
    console.error('Error fetching top users:', err);
    res.status(500).json({ message: 'Error fetching top users', error: err });
  }
};

export const createUserWithFirebase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const userData = {
      name,
      email,
      totalAverageWeightRatings: 0,
      numberOfRents: 0,
      recentlyActive: Math.floor(Date.now() / 1000), 
      potentialScore: 0,
      firebaseUid: firebaseUser.uid 
    };

    const userId = await createUser(userData);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId, 
        firebaseUid: firebaseUser.uid, 
        name,
        email,
      }
    });
  } catch (error: any) {
    console.error('User creation error:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message || 'Unknown error'
    });
  }
};

