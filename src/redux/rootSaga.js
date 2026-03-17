import { all } from 'redux-saga/effects';

import userSaga from './users/userSaga';
import enterpriseSaga from './enterprise/enterpriseSaga';


export default function* rootSaga() {
    yield all([
        userSaga(),
        enterpriseSaga(),
    ]);
}
