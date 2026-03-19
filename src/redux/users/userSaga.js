import { call, put, takeLatest } from 'redux-saga/effects';
import { apiClient } from '../../helpers/apiHelper';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure, getUsersRequest, getUsersSuccess, getUsersFailure, setLogout } from './userReducer';
import { persistor } from '../store';
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

function* registerSaga(action) {
    try {
        const { username, password, fullName, isEnterpriseOwner, navigate } = action.payload;
        const response = yield call([apiClient, apiClient.post], '/users/register', {
            username,
            password,
            fullName,
            role: isEnterpriseOwner ? 'enterprise_owner' : 'employee',
        });

        if (response.status === 200 || response.status === 201) {
            if (response.data?.user) {
                yield put(registerSuccess(response.data.user));
            } else {
                yield put(registerSuccess({ username, fullName }));
            }
            if (navigate) navigate('/dashboard');
        } else {
            yield put(registerFailure('Register failed'));
        }
    } catch (error) {
        yield put(registerFailure(error.message || 'Register failed'));
    }
}


function* logoutSaga() {
    // Remove token and clear only user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('persist:user'); // Remove only user slice if using redux-persist
    // Optionally clear other user-specific keys
    yield persistor.flush(); // Ensure state is written before logout
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
    yield takeLatest(registerRequest.type, registerSaga);
    yield takeLatest(setLogout.type, logoutSaga);
    yield takeLatest(getUsersRequest.type, getUsers);
}
