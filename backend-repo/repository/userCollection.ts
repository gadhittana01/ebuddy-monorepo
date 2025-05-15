import { db } from '../config/firebaseConfig';
import { User, calculatePotentialScore } from '@repo/shared';
import { WriteResult } from 'firebase-admin/firestore';

const USERS = db.collection('USERS');

export const createUser = async (data: any): Promise<string> => {
  const userData = {
    ...data,
    createdAt: new Date().getTime() / 1000,
    updatedAt: new Date().getTime() / 1000
  };
  
  userData.potentialScore = calculatePotentialScore(userData);
  
  const docRef = await USERS.add(userData);
  return docRef.id;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<WriteResult> => {
  const updateData: any = {
    ...data,
    updatedAt: new Date().getTime() / 1000
  };
  
  if (
    data.totalAverageWeightRatings !== undefined || 
    data.numberOfRents !== undefined ||
    data.name !== undefined 
  ) {
    const userDoc = await USERS.doc(id).get();
    const userData = userDoc.data() as User;
    
    const updatedUser = {
      ...userData,
      ...data
    };
    
    updateData.potentialScore = calculatePotentialScore(updatedUser);
  }
  
  return USERS.doc(id).update(updateData);
};

export const getUser = async (id: string): Promise<User | null> => {
  const doc = await USERS.doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } as User : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const snapshot = await USERS.where('email', '==', email).limit(1).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
};

export const getUserByFirebaseUid = async (firebaseUid: string): Promise<User | null> => {
  const snapshot = await USERS.where('firebaseUid', '==', firebaseUid).limit(1).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
};

export const updateUserByFirebaseUid = async (firebaseUid: string, data: Partial<User>): Promise<WriteResult | null> => {
  const user = await getUserByFirebaseUid(firebaseUid);
  
  if (!user) {
    return null;
  }
  
  return updateUser(user.id, data);
};

export const getTopUsers = async (limit: number, lastScore?: number) => {
  let query = USERS.orderBy('potentialScore', 'desc').limit(limit);
  
  if (lastScore !== undefined) {
    query = query.startAfter(lastScore);
  }
  return query.get();
};

export const updateUserActivity = async (userId: string, timestamp: number): Promise<WriteResult> => {
  const userDoc = await USERS.doc(userId).get();
  if (!userDoc.exists) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  const userData = userDoc.data() as User;
  
  return USERS.doc(userId).update({
    recentlyActive: timestamp,
    updatedAt: timestamp,
    potentialScore: calculatePotentialScore({
      ...userData,
      recentlyActive: timestamp
    })
  });
};

export const updateUserActivityByFirebaseUid = async (firebaseUid: string, timestamp: number): Promise<WriteResult | null> => {
  try {
    const user = await getUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      console.warn(`User with Firebase UID ${firebaseUid} not found`);
      return null;
    }
    
    return updateUserActivity(user.id, timestamp);
  } catch (error) {
    console.error(`Error updating activity for user with Firebase UID ${firebaseUid}:`, error);
    return null;
  }
};
  
  