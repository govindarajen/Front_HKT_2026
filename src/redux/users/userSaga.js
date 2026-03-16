import { call, put, takeLatest } from 'redux-saga/effects';
import { apiClient } from '../../helpers/apiHelper';
import { loginRequest, loginSuccess, loginFailure, setLogout } from './userReducer';
import { getUsersFailure, getUsersSuccess, getUsersRequest } from '../admin/adminReducer';

function* loginSaga(action) {
    try {
        const { username, password, navigate } = action.payload;
        const response = yield call([apiClient, apiClient.post], '/users/login', { username, password });
        if (response.status === 200) {
            yield put(loginSuccess(response.data.user));
            if (navigate) navigate('/dashboard');
        } else {
            yield put(loginFailure('Login failed'));
        }
    } catch (error) {
        yield put(loginFailure(error.message || 'Login failed'));
    }
}


function* logoutSaga() {
    // Remove token and clear localStorage
    localStorage.removeItem('token');
    localStorage.clear();
    window.location.reload(); // Reload the page to reset the state
    // Optionally, redirect or perform other side effects
}


function* getUsers() {
    try {
        const response = yield call([apiClient, apiClient.get], '/users');
        if (response.status === 200) {
            yield put(getUsersSuccess(response.data.users));
        } else {
            yield put(getUsersFailure('Failed to fetch users'));
        }
    } catch (error) {
        yield put(getUsersFailure(error.message || 'Failed to fetch users'));
    }
}


export default function* userSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
    yield takeLatest(setLogout.type, logoutSaga);
    yield takeLatest(getUsersRequest.type, getUsers);
}
