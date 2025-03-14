import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentCustomer: null, 
    error: null,
    loading: false,
};

export const customerAuthSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        signInRequest: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentCustomer = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; 
        },
        signOutRequest: (state) => {
            state.loading = true;
        },
        signOutSuccess: (state) => {
            state.currentCustomer = null;
            state.error = null;
            state.loading = false;
        },
        signOutFailure: (state, action) => {
            state.error = action.payload; 
            state.loading = false;
        },
    },
});

export const {
    signInRequest,
    signInSuccess,
    signInFailure,
    signOutRequest,
    signOutSuccess,
    signOutFailure,
} = customerAuthSlice.actions;

export default customerAuthSlice.reducer;
