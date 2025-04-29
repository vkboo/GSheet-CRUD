import { Database } from 'sheetsql';
import path from 'node:path';
import qs from 'qs';
import { NextRequest } from 'next/server';
import fs from 'fs/promises';

type Params = {
    doc_id: string;
    sheet_name: string[];
};

async function getServiceAccountPath() {
    const tempDir = path.join(process.cwd(), '.temp');
    const tempFilePath = path.join(tempDir, 'google-serviceaccount.json');

    try {
        await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
        console.error('Failed to create temp directory:', error);
    }

    if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        await fs.writeFile(tempFilePath, process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
        return tempFilePath;
    }

    const localPath = path.join(process.cwd(), 'google-serviceaccount.json');
    return localPath;
}

const getCommonDbConfig = async () => ({
    keyFile: await getServiceAccountPath(),
});

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
    const commonDbConfig = await getCommonDbConfig();
    const db = new Database({
        ...commonDbConfig,
        db: doc_id,
        table: sheet_name?.[0],
    });
    try {
        await db.load()
        const docs = await db.find(query);
        return new Response(JSON.stringify(docs));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new Response(
            JSON.stringify(error.response.data.error),
            { status: error.response.status }
        );
    }
}
