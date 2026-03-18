import { all } from 'redux-saga/effects';

import userSaga from './users/userSaga';
import enterpriseSaga from './enterprise/enterpriseSaga';
import documentsSaga from './documents/documentsSaga';
import dashboardSaga from './dashboard/dashboardSaga';


export default function* rootSaga() {
    yield all([
        userSaga(),
        enterpriseSaga(),
        documentsSaga(),
        dashboardSaga(),
    ]);
}
