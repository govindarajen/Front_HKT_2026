import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        enterprises: [],
        enterprise: null,
    },
    loading: false,
    error: null,
    success: null,
};

export const enterpriseSlice = createSlice({
    name: 'enterprise',
    initialState,
    reducers: {
        createEnterpriseRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        createEnterpriseSuccess: (state, action) => {
            state.loading = false;
            state.value.enterprise = action.payload;
            state.value.enterprises = [action.payload, ...(state.value.enterprises || [])];
            state.success = 'create';
        },
        createEnterpriseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateEnterpriseRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        updateEnterpriseSuccess: (state, action) => {
            state.loading = false;
            state.value.enterprise = action.payload;
            state.value.enterprises = (state.value.enterprises || []).map((enterprise) =>
                enterprise?._id === action.payload?._id ? action.payload : enterprise
            );
            state.success = 'update';
        },
        updateEnterpriseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        getAllEnterprisesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAllEnterprisesSuccess: (state, action) => {
            state.loading = false;
            state.value.enterprises = action.payload || [];
        },
        getAllEnterprisesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        getEnterpriseByIdRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getEnterpriseByIdSuccess: (state, action) => {
            state.loading = false;
            state.value.enterprise = action.payload;
        },
        getEnterpriseByIdFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        deleteEnterpriseRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        deleteEnterpriseSuccess: (state, action) => {
            state.loading = false;
            state.value.enterprises = (state.value.enterprises || []).filter(
                (enterprise) => enterprise?._id !== action.payload
            );
            if (state.value.enterprise?._id === action.payload) {
                state.value.enterprise = null;
            }
            state.success = 'delete';
        },
        deleteEnterpriseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearEnterpriseError: (state) => {
            state.error = null;
        },
        clearEnterpriseSuccess: (state) => {
            state.success = null;
        },
    },
});

export const {
    createEnterpriseRequest,
    createEnterpriseSuccess,
    createEnterpriseFailure,
    updateEnterpriseRequest,
    updateEnterpriseSuccess,
    updateEnterpriseFailure,
    getAllEnterprisesRequest,
    getAllEnterprisesSuccess,
    getAllEnterprisesFailure,
    getEnterpriseByIdRequest,
    getEnterpriseByIdSuccess,
    getEnterpriseByIdFailure,
    deleteEnterpriseRequest,
    deleteEnterpriseSuccess,
    deleteEnterpriseFailure,
    clearEnterpriseError,
    clearEnterpriseSuccess,
} = enterpriseSlice.actions;

export default enterpriseSlice.reducer;