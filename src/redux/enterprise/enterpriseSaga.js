import { call, put, takeLatest } from 'redux-saga/effects';
import { apiClient } from '../../helpers/apiHelper';
import { setUserEnterprise } from '../users/userReducer';
import {
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
} from './enterpriseReducer';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

function* createEnterpriseSaga(action) {
    try {
        const response = yield call([apiClient, apiClient.post], '/enterprises', action.payload);
        const enterprise = response?.data?.enterprise || response?.data;
        if (response.status === 200 || response.status === 201) {
            yield put(createEnterpriseSuccess(enterprise));
            const enterpriseId = enterprise?._id || enterprise?.id || enterprise?.enterpriseId || null;
            if (enterpriseId) {
                yield put(setUserEnterprise(enterpriseId));
            }
        } else {
            yield put(createEnterpriseFailure('Failed to create enterprise'));
        }
    } catch (error) {
        yield put(createEnterpriseFailure(getErrorMessage(error, 'Failed to create enterprise')));
    }
}

function* updateEnterpriseSaga(action) {
    try {
        const { id, data } = action.payload;
        const response = yield call([apiClient, apiClient.put], `/enterprises/${id}`, data);
        const enterprise = response?.data?.enterprise || response?.data;
        if (response.status === 200) {
            yield put(updateEnterpriseSuccess(enterprise));
            const enterpriseId = enterprise?._id || enterprise?.id || enterprise?.enterpriseId || null;
            if (enterpriseId) {
                yield put(setUserEnterprise(enterpriseId));
            }
        } else {
            yield put(updateEnterpriseFailure('Failed to update enterprise'));
        }
    } catch (error) {
        yield put(updateEnterpriseFailure(getErrorMessage(error, 'Failed to update enterprise')));
    }
}

function* getAllEnterprisesSaga() {
    try {
        const response = yield call([apiClient, apiClient.get], '/enterprises/all');
        const enterprises = response?.data?.enterprises || response?.data || [];
        if (response.status === 200) {
            yield put(getAllEnterprisesSuccess(enterprises));
        } else {
            yield put(getAllEnterprisesFailure('Failed to fetch enterprises'));
        }
    } catch (error) {
        yield put(getAllEnterprisesFailure(getErrorMessage(error, 'Failed to fetch enterprises')));
    }
}

function* getEnterpriseByIdSaga(action) {
    try {
        const response = yield call([apiClient, apiClient.get], `/enterprises/${action.payload}`);
        const enterprise = response?.data?.enterprise || response?.data;
        if (response.status === 200) {
            yield put(getEnterpriseByIdSuccess(enterprise));
        } else {
            yield put(getEnterpriseByIdFailure('Failed to fetch enterprise'));
        }
    } catch (error) {
        yield put(getEnterpriseByIdFailure(getErrorMessage(error, 'Failed to fetch enterprise')));
    }
}

function* deleteEnterpriseSaga(action) {
    try {
        const id = action.payload;
        const response = yield call([apiClient, apiClient.delete], `/enterprises/${id}`);
        if (response.status === 200 || response.status === 204) {
            yield put(deleteEnterpriseSuccess(id));
        } else {
            yield put(deleteEnterpriseFailure('Failed to delete enterprise'));
        }
    } catch (error) {
        yield put(deleteEnterpriseFailure(getErrorMessage(error, 'Failed to delete enterprise')));
    }
}

export default function* enterpriseSaga() {
    yield takeLatest(createEnterpriseRequest.type, createEnterpriseSaga);
    yield takeLatest(updateEnterpriseRequest.type, updateEnterpriseSaga);
    yield takeLatest(getAllEnterprisesRequest.type, getAllEnterprisesSaga);
    yield takeLatest(getEnterpriseByIdRequest.type, getEnterpriseByIdSaga);
    yield takeLatest(deleteEnterpriseRequest.type, deleteEnterpriseSaga);
}