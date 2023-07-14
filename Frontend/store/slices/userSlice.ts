import { UserData } from "@/models/user.model";
import * as serverService from "@/services/serverService"
import httpClient from "@/utils/httpClient";
import { setCookie } from "@/utils/cookiesUtil";
import { ACCESS_TOKEN_KEY, HTTP_METHOD_GET, HTTP_METHOD_POST } from "@/utils/constant";

// import jwt from "@/utils/jwt";
// import jwt from 'jsonwebtoken'
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_KEY

interface UserState {
    username: string;
    accessToken: string;
    error?: string;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    user?: UserData;
}

interface SingleProp {
    data: string;
}

const initialState: UserState = {
    username: '',
    accessToken: '',
    isAuthenticated: false,
    isAuthenticating: true,
    user: undefined,
}

interface SingAction {
    username: string;
    password: string;
}

export const signIn = createAsyncThunk(
    'user/signin',
    async (credential: SingAction) => {
        const response = await serverService.signIn(credential);
        if (response.loginStatus === false) {
            throw new Error(JSON.stringify(response?.message))
        }
        httpClient.interceptors.request.use((config) => {
            if (config && config.headers) {
                config.headers['Authorization'] = `Bearer ${response.token}`
            }
            return config
        })
        return response;
    }
)

export const getUsers = createAsyncThunk(
    "user/get",
    async (keyword?: string) => {
        return await serverService.getUsers(keyword);
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        resetUserName: (state, action: PayloadAction<SingleProp>) => {
            state.username = action.payload.data
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.accessToken = action.payload.token;
            state.isAuthenticated = true;
            state.isAuthenticating = false;
            state.user = action.payload.user;
            // jwt.verify(action.payload.token, SECRET_KEY)
            // const result = jwt(action.payload.token)
            // console.log('result',result);
        })

        builder.addCase(signIn.rejected, (state, action) => {
            state.accessToken = "";
            state.isAuthenticated = false;
            state.isAuthenticating = false;
            state.user = undefined;
        });
    }
})

export const { resetUserName } = userSlice.actions;

export const userSelector = (store: RootState) => store.user;
export const isAuthenticatedSelector = (store: RootState): boolean => store.user.isAuthenticated;
export const accessTokenSelector = (store: RootState): string => store.user.accessToken;
export const isAuthenticatingSelector = (store: RootState): boolean =>
    store.user.isAuthenticating;
export default userSlice.reducer;