import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    users: null,
  },
  loading: false,
  error: null,

};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        getUsersRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.value.users = action.payload;
        },
        getUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

    },
  });
  
export const { 
                getUsersSuccess,
                getUsersFailure,
                getUsersRequest
            
            } = adminSlice.actions;

            
export default adminSlice.reducer;
