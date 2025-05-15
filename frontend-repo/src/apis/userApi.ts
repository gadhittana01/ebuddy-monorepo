import { User } from '@repo/shared';
import { apiClient } from '@/utils/api';
import { BACKEND_URL } from '@/utils/constants';

export const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`${BACKEND_URL}/api/v1/user/${id}`);
    
    if (response.data && typeof response.data === 'object') {
      if (response.data.id && response.data.email) {
        return response.data;
      }
      
      if (response.data.user && response.data.user.id && response.data.user.email) {
        return response.data.user;
      }
    }
    
    throw new Error('Unexpected API response structure');
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get(`${BACKEND_URL}/api/v1/user`);
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    if (response.data && response.data.users && Array.isArray(response.data.users)) {
      return response.data.users;
    }
    
    throw new Error('Unexpected API response structure');
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, updateData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put(`${BACKEND_URL}/api/v1/user/${id}`, updateData);
    
    if (response.data && typeof response.data === 'object') {
      if (response.data.id && response.data.email) {
        return response.data;
      }
      
      if (response.data.user && response.data.user.id && response.data.user.email) {
        return response.data.user;
      }
    }
    
    throw new Error('Unexpected API response structure');
  } catch (error) {
    throw error;
  }
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};
