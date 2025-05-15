import { User } from '@repo/shared';
import styles from './UserCard.module.css';
import UpdateButton from './UpdateButton';

interface UserCardProps {
  user: User;
  onUserUpdated?: () => void;
}

export default function UserCard({ user, onUserUpdated }: UserCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{user.name}</h3>
        <span className={styles.score}>Score: {user.potentialScore.toFixed(2)}</span>
      </div>
      
      <div className={styles.info}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rating:</strong> {user.totalAverageWeightRatings.toFixed(1)}</p>
        <p><strong>Rents:</strong> {user.numberOfRents}</p>
        <p><strong>Last Active:</strong> {formatDate(user.recentlyActive)}</p>
      </div>
      
      <div className={styles.actions}>
        <UpdateButton 
          userId={user.id} 
          user={user} 
          onUpdate={onUserUpdated} 
        />
      </div>
    </div>
  );
} 