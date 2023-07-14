import { UserData } from "./user.model";


export interface SignIn {
    loginStatus: boolean;
    result: string;
    token: string;
    error?: string;
    user: UserData;
}

export interface GetSession {
    result: string;
    errror?: string;
    user?: UserData;
}