import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";


export async function GET(request: Request) {
    console.log('request', request);

    return NextResponse.json({ message: 'asdfasdfasdf' })
}

export async function HEAD(request: Request) { }

export async function POST(request: NextApiRequest) {
    console.log('request',request.body );
    return NextResponse.json({ message: 'asdfasdfasdf' })
}

export async function PUT(request: Request) { }

export async function DELETE(request: Request) { }

export async function PATCH(request: Request) { }

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) { }