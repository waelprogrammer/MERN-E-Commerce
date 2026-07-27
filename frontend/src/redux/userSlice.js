import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { token: null, loggedIn: false, role: null, username: null },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role || null;
            state.username = action.payload.username || null;
            state.loggedIn = true;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.username = null;
            state.loggedIn = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;