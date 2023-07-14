import { SignIn } from "@/models/auth.model";
import { UserData } from "@/models/user.model";
import httpClient from "@/utils/httpClient";
import { isAuthenticatedSelector } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";


type SignProps = {
    username: string;
    password: string;
}

export const createUser = async (data: SignProps): Promise<void> => {
    return await httpClient({
        method: "get",
        url: "/users/create",
        data: data,
    });
}

export const signIn = async (user: SignProps): Promise<SignIn> => {
    const { data: response } = await httpClient.post<SignIn>(
        // `/auth/signin`, user, { baseURL: process.env.NEXT_PUBLIC_BASE_URL_API }
        `/auth/signin`, user, { baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API }
    );
    httpClient.defaults.headers.common['Authorization'] = response.token;
    return response;
}

export const getUserByID = async (id: string) => {
    const response = await httpClient.get(`/users/${id}`);
    return response.data;
};

export const addUser = async (data: FormData): Promise<void> => {
    return await httpClient({
        method: "post",
        url: "/auth/register",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const updateUser = async (data: FormData): Promise<void> => {
    return await httpClient({
        method: "PUT",
        url: "/users/edit",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const deleteUser = async (id: string): Promise<void> => {
    return await httpClient({
        method: "DELETE",
        url: "/users/delete/" + id,
    });
}

export const getUsers = async (keyword?: string): Promise<UserData[]> => {
    if (keyword) {
        return (await httpClient.get(`/users/${keyword}`)).data;
    } else {
        return (await httpClient.get(`/users`)).data;
    }
}