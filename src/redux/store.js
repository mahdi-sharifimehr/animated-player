import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';

import user from './slices/user'

import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({ user });

const middlewares = [];

// blacklist a store attribute using it's reducer name. Blacklisted attributes will not persist. (I did not find a way to blacklist specific values)
const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    blacklist: [''], //blacklisting a store attribute name, will not persist that store attribute.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(...middlewares),
});

export const persistor = persistStore(store);
export default store;