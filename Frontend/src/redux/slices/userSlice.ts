import { createSlice } from "@reduxjs/toolkit";

export interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    role: string;
    interested: string[];
}

interface UserState {
    userInfo: UserData | null
}

const initialState: UserState = {
    userInfo: localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo') as string) 
        : null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload; 
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo')
        },
    }
});

export const { setCredentials, clearCredentials } = userSlice.actions;
export default userSlice.reducer;
