import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rawDocuments: [],
    cleanDocuments: [],
    curatedDocuments: [],
    loading: false,
    error: null,
};

export const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        // Raw documents
        getRawDocumentsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getRawDocumentsSuccess: (state, action) => {
            state.loading = false;
            state.rawDocuments = action.payload;
        },
        getRawDocumentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Clean documents
        getCleanDocumentsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getCleanDocumentsSuccess: (state, action) => {
            state.loading = false;
            state.cleanDocuments = action.payload;
        },
        getCleanDocumentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Curated documents
        getCuratedDocumentsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getCuratedDocumentsSuccess: (state, action) => {
            state.loading = false;
            state.curatedDocuments = action.payload;
        },
        getCuratedDocumentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Upload document
        uploadDocumentRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        uploadDocumentSuccess: (state, action) => {
            state.loading = false;
            // Optionally add to raw documents if needed
        },
        uploadDocumentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearDocumentsError: (state) => {
            state.error = null;
        },
    },
});

export const {
    getRawDocumentsRequest,
    getRawDocumentsSuccess,
    getRawDocumentsFailure,
    getCleanDocumentsRequest,
    getCleanDocumentsSuccess,
    getCleanDocumentsFailure,
    getCuratedDocumentsRequest,
    getCuratedDocumentsSuccess,
    getCuratedDocumentsFailure,
    uploadDocumentRequest,
    uploadDocumentSuccess,
    uploadDocumentFailure,
    clearDocumentsError,
} = documentsSlice.actions;

export default documentsSlice.reducer;