import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const normalizeArray = (payload) => (Array.isArray(payload) ? payload : []);
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await axios.get('/api/Products', { headers: getAuthHeaders() });
        return normalizeArray(response.data);
    }
);

export const fetchFeaturedProducts = createAsyncThunk(
    'products/fetchFeaturedProducts',
    async () => {
        const response = await axios.get('/api/featured-products', { headers: getAuthHeaders() });
        return normalizeArray(response.data);
    }
);


const productSlice = createSlice({
    name: 'products',

    initialState: {
        products: [],
        featured: [],
        status: 'idle',
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featured = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});


export default productSlice.reducer;