import { call, put, takeLatest } from 'redux-saga/effects';
import { 
        createUserRequest, 
        createUserSuccess,
        createUserFailure,
} from '../reducers/adminReducer.js';
import { apiClient } from '../../helpers/apiHelper';

function* createUser(action) {
        try {
                const response = yield call([apiClient, apiClient.post], '/users', action.payload);
                if (response.status === 200) {
                        yield put(createUserSuccess(response.data));
                } else {
                        yield put(createUserFailure('Failed to create user'));
                }
        } catch (error) {
                yield put(createUserFailure(error.message || 'Failed to create user'));
        }
}



export default function* adminSaga() {
        yield takeLatest(createUserRequest.type, createUser);
}
