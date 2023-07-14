import { ACCESS_TOKEN_KEY, HTTP_METHOD_GET, HTTP_METHOD_POST } from "@/utils/constant";
import { setCookie } from "@/utils/cookiesUtil";

import httpClient from "@/utils/httpClient";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { NextResponse } from "next/server";

// Notice the function definition:
// export async function POST(request: Request) {
//     const { body } = request
//     console.log('query', body);
//     return NextResponse.json({ message: "Hello World", body: body });
// }


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log('inin');

//     const { nextAuth } = req.query;
//     let action = Array.isArray(nextAuth) ? nextAuth[0] : nextAuth;
//     if (req.method === HTTP_METHOD_POST && action === "signin") {
//         return signin(req, res);
//     } else if (req.method === HTTP_METHOD_GET && action === "session") {
//         return getSession(req, res);
//     } else {
//         return res
//             .status(405)
//             .end(`Error: HTTP ${req.method} is not supported for ${req.url}`);
//     }
// }

export async function POST(req: Request, res: NextApiResponse) {
    const data = await req.json();
    // return NextResponse.json({ message: request })
    try {
        const response = await httpClient.post('/auth/login', data, { responseType: 'json' });
        const { token } = response.data;
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ statue: false, message: error });
    }
}

// async function signin(req: NextApiRequest, res: NextApiResponse) {
//     console.log('signin');
//     try {
//         const response = await httpClient.post('/auth/login', req.body);
//         const { token } = response.data;
//         setCookie(res, ACCESS_TOKEN_KEY, token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV !== 'development',
//             sameSite: 'strict',
//             path: '/'
//         });

//         res.json(response.data)
//     } catch (error) {
//         res.status(400).end();
//     }
// }

async function getSession(req: NextApiRequest, res: NextApiResponse<any>) {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const accessToken = cookies[ACCESS_TOKEN_KEY];
        if (accessToken) {
            const response = await httpClient.get(`/authen/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            res.json(response.data);
        } else {
            res.json({ result: "nok" });
        }
    } catch (error: any) {
        res.json({ result: "nok" });
    }
}
