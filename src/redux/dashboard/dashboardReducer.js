import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    stats: null,
    anomaliesBySeverity: null,
    topAnomalies: null,
    documentsByType: null,
    anomaliesRateByDocType: null,
    suppliersAtRisk: null,
    validationStatus: null,
    processingStatus: null,
    loading: false,
    error: null,
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Stats
    fetchStatsRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchStatsSuccess: (state, action) => {
      state.value.stats = action.payload;
      state.value.loading = false;
    },
    fetchStatsFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Anomalies by Severity
    fetchAnomaliesBySeverityRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchAnomaliesBySeveritySuccess: (state, action) => {
      state.value.anomaliesBySeverity = action.payload;
      state.value.loading = false;
    },
    fetchAnomaliesBySeverityFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Top Anomalies
    fetchTopAnomaliesRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchTopAnomaliesSuccess: (state, action) => {
      state.value.topAnomalies = action.payload;
      state.value.loading = false;
    },
    fetchTopAnomaliesFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Documents by Type
    fetchDocumentsByTypeRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchDocumentsByTypeSuccess: (state, action) => {
      state.value.documentsByType = action.payload;
      state.value.loading = false;
    },
    fetchDocumentsByTypeFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Anomalies Rate by Doc Type
    fetchAnomaliesRateByDocTypeRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchAnomaliesRateByDocTypeSuccess: (state, action) => {
      state.value.anomaliesRateByDocType = action.payload;
      state.value.loading = false;
    },
    fetchAnomaliesRateByDocTypeFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Suppliers at Risk
    fetchSuppliersAtRiskRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchSuppliersAtRiskSuccess: (state, action) => {
      state.value.suppliersAtRisk = action.payload;
      state.value.loading = false;
    },
    fetchSuppliersAtRiskFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Validation Status
    fetchValidationStatusRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchValidationStatusSuccess: (state, action) => {
      state.value.validationStatus = action.payload;
      state.value.loading = false;
    },
    fetchValidationStatusFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Processing Status
    fetchProcessingStatusRequest: (state) => {
      state.value.loading = true;
      state.value.error = null;
    },
    fetchProcessingStatusSuccess: (state, action) => {
      state.value.processingStatus = action.payload;
      state.value.loading = false;
    },
    fetchProcessingStatusFailure: (state, action) => {
      state.value.error = action.payload;
      state.value.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.value.error = null;
    },
  },
});

export const {
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchAnomaliesBySeverityRequest,
  fetchAnomaliesBySeveritySuccess,
  fetchAnomaliesBySeverityFailure,
  fetchTopAnomaliesRequest,
  fetchTopAnomaliesSuccess,
  fetchTopAnomaliesFailure,
  fetchDocumentsByTypeRequest,
  fetchDocumentsByTypeSuccess,
  fetchDocumentsByTypeFailure,
  fetchAnomaliesRateByDocTypeRequest,
  fetchAnomaliesRateByDocTypeSuccess,
  fetchAnomaliesRateByDocTypeFailure,
  fetchSuppliersAtRiskRequest,
  fetchSuppliersAtRiskSuccess,
  fetchSuppliersAtRiskFailure,
  fetchValidationStatusRequest,
  fetchValidationStatusSuccess,
  fetchValidationStatusFailure,
  fetchProcessingStatusRequest,
  fetchProcessingStatusSuccess,
  fetchProcessingStatusFailure,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
