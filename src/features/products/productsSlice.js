import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProduct, fetchProducts, postProduct } from "./productsAPI";

const initialState = {
    products: [],
    isLoading: false,
    postSuccess: false,
    deleteSuccess: false,
    isError: false,
    error: " "
};

export const getProducts = createAsyncThunk("products/getProduct", async () => {
    const products = fetchProducts()
    return products
})

export const addProducts = createAsyncThunk("products/addProduct", async (data) => {
    const products = postProduct(data)
    return products
})

export const removeProducts = createAsyncThunk(
    "products/removeProduct",
    async (id, thunkAPI) => {
        const products = deleteProduct(id);
        thunkAPI.dispatch(removeFromList(id))
        return products
    })

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        togglePostSuccess: (state) => {
            state.postSuccess = false
        },
        toggleDeleteSuccess: (state) => {
            state.deleteSuccess = false
        },
        removeFromList: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.products = [];
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            })


            .addCase(addProducts.pending, (state, action) => {
                state.isLoading = true;
                state.postSuccess = false;
                state.isError = false;
            })
            .addCase(addProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postSuccess = true;
            })
            .addCase(addProducts.rejected, (state, action) => {
                state.products = [];
                state.isLoading = false;
                state.postSuccess = false;
                state.isError = true;
                state.error = action.error.message;
            })


            .addCase(removeProducts.pending, (state, action) => {
                state.isLoading = true;
                state.deleteSuccess = false;
                state.isError = false;
            })
            .addCase(removeProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.deleteSuccess = true;
            })
            .addCase(removeProducts.rejected, (state, action) => {
                state.products = [];
                state.isLoading = false;
                state.deleteSuccess = false;
                state.isError = true;
                state.error = action.error.message;
            })
    },
})

export const { togglePostSuccess, toggleDeleteSuccess, removeFromList } = productSlice.actions
export default productSlice.reducer