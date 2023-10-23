import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile_User } from "@/graphql/generated/types";

type AuthState = {
    isLogin: boolean;
    userData?: Profile_User | null; // temporary
};

const initialState = {
    isLogin: false,
    userData: null,
} as AuthState;

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: () => initialState,
        setUserData: (state, action: PayloadAction<Profile_User>) => {
            state.userData = action.payload;
        },
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
    },
});

export const { reset, setIsLogin, setUserData } = authSlice.actions;

export default authSlice.reducer;
