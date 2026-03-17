import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    users: [],
  },
  loading: false,
  error: null,
  errorPref: null,

};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        createUserRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        createUserSuccess: (state, action) => {
            state.value = {
                ...state.value,
                users: [...state.value.users, action.payload]
            };
            state.loading = false;
            state.error = null;
        },
        createUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        clearAdminErrors: (state) => {
            state.error = null;
        },

    },
  });
  
export const { 
            loginRequest,
            loginSuccess,
            loginFailure,
            setLogout,
            
            clearAdminErrors,
            } = adminSlice.actions;

            
export default adminSlice.reducer;
