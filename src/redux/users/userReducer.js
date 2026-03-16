import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    username: null,
    fullName: null,
    lang: 'en',
    hasPage: false,
    rights: []
  },
  loading: false,
  error: null,
  errorPref: null,

};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        loginRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.value = {
                ...state.value,
                ...action.payload,
                hasPage: action.payload.hasPage,
                rights: action.payload.groupId?.rights
            }
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setLogout: (state) => {
            // No side effects here, saga will handle localStorage
            return initialState;
        },

        clearAuthError: (state) => {
            state.error = null;
        },

    },
  });
  
export const { 
            loginRequest,
            loginSuccess,
            loginFailure,
            setLogout,
            
            clearAuthError,
            } = accountSlice.actions;

            
export default accountSlice.reducer;
