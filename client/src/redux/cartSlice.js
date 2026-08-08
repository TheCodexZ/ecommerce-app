import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalItems: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {

        setCart(state, action) {

            state.items = action.payload;
            state.totalItems = action.payload.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        clearCart(state) {
            state.items = [];
            state.totalItems = 0;
        }
    }
});

export const { setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;