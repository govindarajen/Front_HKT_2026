import { call, put, takeEvery } from 'redux-saga/effects';
import { apiClient } from '../../helpers/apiHelper';
import {
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
} from './dashboardReducer';

// Stats Saga
function* fetchStatsSaga() {
  try {
    const response = yield call(() => apiClient.get('dashboard/stats'));
    yield put(fetchStatsSuccess(response.data.data));
  } catch (error) {
    yield put(fetchStatsFailure(error.response?.data?.error || 'Failed to fetch stats'));
  }
}

// Anomalies by Severity Saga
function* fetchAnomaliesBySeveritySaga() {
  try {
    const response = yield call(() => apiClient.get('dashboard/anomalies/severity'));
    yield put(fetchAnomaliesBySeveritySuccess(response.data.data));
  } catch (error) {
    yield put(fetchAnomaliesBySeverityFailure(error.response?.data?.error || 'Failed to fetch anomalies'));
  }
}

// Top Anomalies Saga
function* fetchTopAnomaliesSaga(action) {
  try {
    const limit = action.payload?.limit || 10;
    const response = yield call(() => apiClient.get(`dashboard/anomalies/top?limit=${limit}`));
    yield put(fetchTopAnomaliesSuccess(response.data.data));
  } catch (error) {
    yield put(fetchTopAnomaliesFailure(error.response?.data?.error || 'Failed to fetch top anomalies'));
  }
}

// Documents by Type Saga
function* fetchDocumentsByTypeSaga() {
  try {
    const response = yield call(() => apiClient.get('dashboard/documents/by-type'));
    yield put(fetchDocumentsByTypeSuccess(response.data.data));
  } catch (error) {
    yield put(fetchDocumentsByTypeFailure(error.response?.data?.error || 'Failed to fetch documents'));
  }
}

// Anomalies Rate by Doc Type Saga
function* fetchAnomaliesRateByDocTypeSaga() {
  try {
    const response = yield call(() => apiClient.get('dashboard/anomalies/by-document-type'));
    yield put(fetchAnomaliesRateByDocTypeSuccess(response.data.data));
  } catch (error) {
    yield put(fetchAnomaliesRateByDocTypeFailure(error.response?.data?.error || 'Failed to fetch anomalies rate'));
  }
}

// Suppliers at Risk Saga
function* fetchSuppliersAtRiskSaga(action) {
  try {
    const limit = action.payload?.limit || 10;
    const response = yield call(() => apiClient.get(`dashboard/suppliers/at-risk?limit=${limit}`));
    yield put(fetchSuppliersAtRiskSuccess(response.data.data));
  } catch (error) {
    yield put(fetchSuppliersAtRiskFailure(error.response?.data?.error || 'Failed to fetch suppliers at risk'));
  }
}

// Validation Status Saga
function* fetchValidationStatusSaga() {
  try {
    const response = yield call(() => apiClient.get('dashboard/validation/status'));
    yield put(fetchValidationStatusSuccess(response.data.data));
  } catch (error) {
    yield put(fetchValidationStatusFailure(error.response?.data?.error || 'Failed to fetch validation status'));
  }
}

// Processing Status Saga
function* fetchProcessingStatusSaga() {
  try {
    const response = yield call(() => apiClient.get('dashboard/processing/status'));
    yield put(fetchProcessingStatusSuccess(response.data.data));
  } catch (error) {
    yield put(fetchProcessingStatusFailure(error.response?.data?.error || 'Failed to fetch processing status'));
  }
}

function* dashboardSaga() {
  yield takeEvery(fetchStatsRequest.type, fetchStatsSaga);
  yield takeEvery(fetchAnomaliesBySeverityRequest.type, fetchAnomaliesBySeveritySaga);
  yield takeEvery(fetchTopAnomaliesRequest.type, fetchTopAnomaliesSaga);
  yield takeEvery(fetchDocumentsByTypeRequest.type, fetchDocumentsByTypeSaga);
  yield takeEvery(fetchAnomaliesRateByDocTypeRequest.type, fetchAnomaliesRateByDocTypeSaga);
  yield takeEvery(fetchSuppliersAtRiskRequest.type, fetchSuppliersAtRiskSaga);
  yield takeEvery(fetchValidationStatusRequest.type, fetchValidationStatusSaga);
  yield takeEvery(fetchProcessingStatusRequest.type, fetchProcessingStatusSaga);
}

export default dashboardSaga;
