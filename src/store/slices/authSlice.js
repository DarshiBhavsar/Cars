import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../../config/config';
const initialState = {
    loading: false,
    error: "",
    user: null,
    role: null,
    token: localStorage.getItem('token') || null,
};

// Define the async thunk for signing up the user
export const signUpUser = createAsyncThunk('signupuser', async (userData, { rejectWithValue }) => {
    try {
        // Send a POST request to the registration API
        const response = await axios.post(`${BASE_URL}/api/auth/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Return the response data if the request was successful
        return response.data;
    } catch (error) {
        // Handle errors and return a rejected action with the error message
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const loginUser = createAsyncThunk('loginuser', async (userData, { rejectWithValue }) => {
    try {
        // Send a POST request to the registration API
        const response = await axios.post(`${BASE_URL}/api/auth/login`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { token, role } = response.data;

        // Store token in localStorage or wherever necessary
        localStorage.setItem('token', token);

        return { token, role };
    } catch (error) {
        // Handle errors and return a rejected action with the error message
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToken: (state, action) => {
            state.token = action.payload
        },
        addUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.token = null;  // Clear token in state
            state.user = null;   // Clear user in state
            state.role = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user; // Successful registration response         
                // state.token = action.payload.token; // Store token
                // localStorage.setItem('token', action.payload.token);
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Error response
            });
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user; // Store user data
                state.token = action.payload.token; // Store token
                state.role = action.payload.role;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error message on failure
            });
    },
});
export const {
    addToken,
    logout
} = authSlice.actions
export default authSlice.reducer;
