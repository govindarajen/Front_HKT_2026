import { call, put, takeLatest } from 'redux-saga/effects';
import { apiClient } from '../../helpers/apiHelper';
import {
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
} from './documentsReducer';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

function* getRawDocumentsSaga(action) {
    try {
        const response = yield call([apiClient, apiClient.get], '/documents/raw');
        if (response.status === 200) {
            yield put(getRawDocumentsSuccess(response.data));
        } else {
            yield put(getRawDocumentsFailure('Failed to fetch raw documents'));
        }
    } catch (error) {
        yield put(getRawDocumentsFailure(getErrorMessage(error, 'Failed to fetch raw documents')));
    }
}

function* getCleanDocumentsSaga(action) {
    try {
        const response = yield call([apiClient, apiClient.get], '/documents/clean');
        if (response.status === 200) {
            yield put(getCleanDocumentsSuccess(response.data));
        } else {
            yield put(getCleanDocumentsFailure('Failed to fetch clean documents'));
        }
    } catch (error) {
        yield put(getCleanDocumentsFailure(getErrorMessage(error, 'Failed to fetch clean documents')));
    }
}

function* getCuratedDocumentsSaga(action) {
    try {
        const response = yield call([apiClient, apiClient.get], '/documents/curated');
        if (response.status === 200) {
            yield put(getCuratedDocumentsSuccess(response.data));
        } else {
            yield put(getCuratedDocumentsFailure('Failed to fetch curated documents'));
        }
    } catch (error) {
        yield put(getCuratedDocumentsFailure(getErrorMessage(error, 'Failed to fetch curated documents')));
    }
}

function* uploadDocumentSaga(action) {
    try {
        const { formData } = action.payload;
        const response = yield call([apiClient, apiClient.post], '/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            yield put(uploadDocumentSuccess(response.data));
        } else {
            yield put(uploadDocumentFailure('Failed to upload document'));
        }
    } catch (error) {
        yield put(uploadDocumentFailure(getErrorMessage(error, 'Failed to upload document')));
    }
}

export default function* documentsSaga() {
    yield takeLatest(getRawDocumentsRequest.type, getRawDocumentsSaga);
    yield takeLatest(getCleanDocumentsRequest.type, getCleanDocumentsSaga);
    yield takeLatest(getCuratedDocumentsRequest.type, getCuratedDocumentsSaga);
    yield takeLatest(uploadDocumentRequest.type, uploadDocumentSaga);
}