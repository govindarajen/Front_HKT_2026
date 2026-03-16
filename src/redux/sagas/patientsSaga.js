import { call, put, takeLatest } from 'redux-saga/effects';
import { 
    getAllExamplesRequest, 
} from '../reducers/exampleReducer.js';
import { apiClient } from '../../helpers/apiHelper';

function* getAllExamplesSaga(action) {
        try {
                const response = yield call([apiClient, apiClient.get], '/example/all');
                if (response.status === 200) {
                        yield put(getExampleSuccess(response.data.example));
                } else {
                        yield put(exampleRequestFailure('Failed to fetch example'));
                }
        } catch (error) {
                yield put(exampleRequestFailure(error.message || 'Failed to fetch example'));
        }
}



export default function* exampleSaga() {
        yield takeLatest(getAllExamplesRequest.type, getAllExamplesSaga);
}
