'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUser, fetchUsers } from '@/apis/userApi';
import { User } from '@/entities/user';
import UserCard from '@/components/UserCard';
import Tabs from '@/components/Tabs';
import Header from '@/components/Header';
import styles from './page.module.css';

export default function MainPage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchUserData = useCallback(async () => {
    if (user && !loading) {
      try {
        const data = await fetchUser(user.uid);
        
        if (!data) {
          throw new Error('No user data returned from API');
        }
        
        setUserData(data);
        setFetchError(null);
      } catch (error) {
        setFetchError(`Failed to load user data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [user, loading]);

  const fetchAllUsersData = useCallback(async () => {
    if (activeTab === 'users') {
      try {
        const users = await fetchUsers();
        
        const sortedUsers = users ? [...users].sort((a, b) => b.potentialScore - a.potentialScore) : [];
        setAllUsers(sortedUsers);
        setFetchError(null);
      } catch (error) {
        setFetchError(`Failed to load users: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, refreshTrigger]);

  useEffect(() => {
    fetchAllUsersData();
  }, [fetchAllUsersData, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div className={styles.error}>Please sign in to access this page.</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Tabs 
          tabs={[
            { id: 'profile', label: 'My Profile' },
            { id: 'users', label: 'All Users' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {fetchError && <div className={styles.error}>{fetchError}</div>}

        {activeTab === 'profile' && (
          <div className={styles.profile}>
            {userData ? (
              <>
                <h1>Welcome, {userData.name}</h1>
                <UserCard 
                  user={userData} 
                  onUserUpdated={handleRefresh} 
                />
              </>
            ) : !fetchError ? (
              <div className={styles.loading}>Loading user data...</div>
            ) : null}
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.usersList}>
            <h2>Top Users</h2>
            {allUsers.length > 0 ? (
              allUsers.map(user => (
                <div key={user.id} className={styles.userCardContainer}>
                  <UserCard 
                    user={user} 
                    onUserUpdated={handleRefresh} 
                  />
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No users found</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}