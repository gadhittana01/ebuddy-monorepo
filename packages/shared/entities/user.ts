export interface User {
  id: string;
  name: string;
  email: string;
  totalAverageWeightRatings: number;
  numberOfRents: number;
  recentlyActive: number;
  potentialScore: number;
  firebaseUid: string;
  password?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const calculatePotentialScore = (user: Partial<User>): number => {
  if (!user.totalAverageWeightRatings || !user.numberOfRents || !user.recentlyActive) {
    return 0;
  }

  return (
    (user.totalAverageWeightRatings * 10) + 
    (user.numberOfRents * 0.1) +            
    (user.recentlyActive * 0.000001)        
  );
};
