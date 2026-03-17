import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    username: null,
    fullName: null,
    lang: 'en',
    hasPage: false,
    rights: [],
    enterpriseId: null,
    },
    users: null,
    loading: false,
    error: null,
    errorPref: null,
    passwordChangeSuccess: null,

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
                rights: action.payload.groupId?.rights
            }
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        registerRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.value = {
                ...state.value,
                ...action.payload,
                rights: action.payload.groupId?.rights ?? []
            }
            state.loading = false;
            state.error = null;
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        getUsersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        getUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setUserEnterprise: (state, action) => {
            state.value.enterpriseId = action.payload;
        },
        
        changePasswordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        changePasswordSuccess: (state, action) => {
            state.value = {
                rights: action.payload.groupId?.rights
            }
            state.loading = false;
            state.error = null;
            state.passwordChangeSuccess = true;
        },
        changePasswordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.passwordChangeSuccess = false;
        },
        setLogout: (state) => {
            // No side effects here, saga will handle localStorage
            return initialState;
        },

        clearAuthError: (state) => {
            state.error = null;
            state.passwordChangeSuccess = null;
        },

    },
  });
  
export const { 
            loginRequest,
            loginSuccess,
            loginFailure,
            registerRequest,
            registerSuccess,
            registerFailure,
            getUsersRequest,
            getUsersSuccess,
            getUsersFailure,
            setUserEnterprise,
            setLogout,
            changePasswordRequest,
            changePasswordSuccess,
            changePasswordFailure,
            clearAuthError,
            } = accountSlice.actions;

            
export default accountSlice.reducer;
