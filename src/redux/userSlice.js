import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        getUserStart: (state, action) => {
            state.users.isFetching = true;
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload
        },
        getUserError: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
    }
})

export const {getUserStart, getUserSuccess, getUserError} = userSlice.actions;
export default userSlice.reducer;