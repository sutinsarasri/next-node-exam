import { UserData } from "@/models/user.model";
import * as serverService from "@/services/serverService"
import httpClient from "@/utils/httpClient";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_KEY

interface UserDataState {
    users: UserData[]
}


interface UserAction {
    name: string;
    address: string;
    email: string;
    phone: string;
    birthdate: string;
}

const initialState: UserDataState = {
    users: [],
}


export const getUserDatas = createAsyncThunk(
    "users/get",
    async (keyword?: string) => {
        return await serverService.getUsers(keyword);
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserDatas.fulfilled, (state, action) => {
            state.users = action.payload;
        })
    }
})

export const userSelector = (store: RootState): UserData[] | undefined => store.users.users;
// export reducer
export default usersSlice.reducer;