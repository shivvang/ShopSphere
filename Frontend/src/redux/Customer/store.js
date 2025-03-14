import { configureStore } from "@reduxjs/toolkit";
import customerAuthReducer from "./features/customerAuthSliceReducer"; 

const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem("customerState");
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error("Could not load state from sessionStorage", error);
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem("customerState", serializedState);
    } catch (error) {
        console.error("Could not save state to sessionStorage", error);
    }
};

const preloadedState = loadState();

export const CustomerStore = configureStore({
    reducer: {
        customer: customerAuthReducer, 
    },
    preloadedState
});

CustomerStore.subscribe(() => {
    saveState(CustomerStore.getState());
});


