import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSeller: null, 
    error: null,
    loading: false,
    loginTime: null, 
};

export const sellerAuthSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        signInRequest: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentSeller = action.payload;
            state.loading = false;
            state.error = null;
            state.loginTime = Date.now();
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; 
        },
        signOutRequest: (state) => {
            state.loading = true;
        },
        signOutSuccess: (state) => {
            state.currentSeller = null;
            state.error = null;
            state.loading = false;
        },
        signOutFailure: (state, action) => {
            state.error = action.payload; 
        },
        updateLoginTime: (state) => {
            state.loginTime = Date.now();
        }
    },
});

export const {
    signInRequest,
    signInSuccess,
    signInFailure,
    signOutRequest,
    signOutSuccess,
    signOutFailure,
    updateLoginTime
} = sellerAuthSlice.actions;

export default sellerAuthSlice.reducer;