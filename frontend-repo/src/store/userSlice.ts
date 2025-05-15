import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/entities/user';

interface UserState {
  user: User | null;
  users: User[];
  loading: boolean;
  usersLoading: boolean;
  success: boolean;
  error: string | null;
  usersError: string | null;
}

const initialState: UserState = {
  user: null,
  users: [],
  loading: false,
  usersLoading: false,
  success: false,
  error: null,
  usersError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSuccess(state, action: PayloadAction<boolean>) {
      state.success = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    
    // Users list actions
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUsers(state, action: PayloadAction<User[]>) {
      state.users = [...state.users, ...action.payload];
    },
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.usersLoading = action.payload;
    },
    setUsersError(state, action: PayloadAction<string | null>) {
      state.usersError = action.payload;
    },
    
    updateUserInList(state, action: PayloadAction<User>) {
      const updatedUser = action.payload;
      const index = state.users.findIndex(user => user.id === updatedUser.id);
      
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    }
  },
});

export const { 
  setUser, 
  setLoading, 
  setSuccess, 
  setError,
  setUsers,
  addUsers,
  setUsersLoading,
  setUsersError,
  updateUserInList
} = userSlice.actions;

export default userSlice.reducer;
