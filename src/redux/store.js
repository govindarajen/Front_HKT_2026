import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import accountSlice from "./users/userReducer.js";
import adminSlice from './admin/adminReducer.js';


import rootSaga from './rootSaga.js';

const persistConfig = {
    key: 'root',
    storage
};

const rootReducer = combineReducers({
    account: accountSlice,
    admin: adminSlice,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                        serializableCheck: false,
                        thunk: false,
                }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;