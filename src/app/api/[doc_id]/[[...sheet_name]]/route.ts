import { Database } from 'sheetsql';
import path from 'node:path';
import qs from 'qs';
import { NextRequest } from 'next/server';

type Params = {
    doc_id: string;
    sheet_name: string[];
};

const commonDbConfig = {
    // keyFile: path.join(process.cwd(), 'google-serviceaccount.json'),
    apiKey: 'AIzaSyDh-aJ4R2d1SW7tXsmVDtLALthK7xgTIZw__',
};

export async function POST() {
    return new Response("Hello, world!");
}

export async function DELETE() {
    return new Response("Hello, world!");
}

export async function PUT() {
    return new Response("Hello, world!");
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const searchParams = request.nextUrl.searchParams.toString();
    const query = qs.parse(searchParams);
    const { doc_id, sheet_name } = await params;
    const db = new Database({
        ...commonDbConfig,
        db: doc_id,
        table: sheet_name?.[0],
    });
    try {
        await db.load()
        const docs = await db.find(query);
        return new Response(JSON.stringify(docs));
    } catch (error: any) {
        return new Response(
            JSON.stringify(error.response.data.error),
            { status: error.response.status }
        );
    }
}
