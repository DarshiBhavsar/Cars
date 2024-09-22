import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import authSlice from './slices/authSlice';
import storage from 'redux-persist/lib/storage'; // default localStorage for web

// Your existing changeState reducer for sidebar and theme
const initialState = {
    sidebarShow: true,
    theme: 'light',
};

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest };
        default:
            return state;
    }
};

// Combine the reducers
const rootReducer = combineReducers({
    user: authSlice, // Handles auth state
    layout: changeState, // Handles sidebar and theme state
});

const persistConfig = {
    key: 'root',
    storage, // Using localStorage for persistence
    whitelist: ['user', 'layout'], // Persisting both user and layout states
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store using configureStore
const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
