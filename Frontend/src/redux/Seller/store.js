import {configureStore} from "@reduxjs/toolkit";
import sellerAuthReducer from "./Features/sellerAuthSliceReducer"


const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem("sellerState");
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error("Could not load state from sessionStorage", error);
        return undefined;
    }
};


const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem("sellerState", serializedState);
    } catch (error) {
        console.error("Could not save state to sessionStorage", error);
    }
};


const preloadedState = loadState();

export const sellerStore = configureStore({
    reducer:{
        seller:sellerAuthReducer,
    },
    preloadedState
})

sellerStore.subscribe(() => {
    saveState(sellerStore.getState());
});