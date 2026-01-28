import { Database } from 'sheetsql';
import path from 'node:path';
import qs from 'qs';
import { NextRequest } from 'next/server';

type Params = {
    doc_id: string;
    sheet_name: string[];
};

interface Document {
    [key: string]: unknown;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
};

function createResponse(data: unknown, status: number = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}

function getServiceAccountPath() {
    return path.join(process.cwd(), 'secrets/gsheet-sql.json');
}

const getCommonDbConfig = () => ({
    keyFile: getServiceAccountPath(),
});

function createDatabase(doc_id: string, sheet_name?: string[]) {
    const commonDbConfig = getCommonDbConfig();
    return new Database({
        ...commonDbConfig,
        db: doc_id,
        table: sheet_name?.[0],
    });
}

function handleError(error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response: { data: { error: unknown }; status: number } };
        return createResponse(err.response.data.error, err.response.status);
    }
    return createResponse({ message: 'Internal Server Error' }, 500);
}

function isEmptyRow(obj: Document): boolean {
    return Object.values(obj).every(
        (v) => v === undefined || v === null || v === ''
    );
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { doc_id, sheet_name } = await params;
    const db = createDatabase(doc_id, sheet_name);

    try {
        const body = await request.json();
        await db.load();

        const docs: Document[] = Array.isArray(body) ? body : [body];
        const insertedDocs = await db.insert(docs);

        return createResponse(insertedDocs, 201);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { doc_id, sheet_name } = await params;
    const searchParams = request.nextUrl.searchParams.toString();
    const query = qs.parse(searchParams);
    const db = createDatabase(doc_id, sheet_name);

    try {
        await db.load();
        const removedDocs = await db.remove(query);

        return createResponse(removedDocs);
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { doc_id, sheet_name } = await params;
    const searchParams = request.nextUrl.searchParams.toString();
    const query = qs.parse(searchParams);
    const db = createDatabase(doc_id, sheet_name);
    try {
        const body = await request.json();
        await db.load();
        const updatedDocs = await db.update(query, body);

        return createResponse(updatedDocs);
    } catch (error) {
        return handleError(error);
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const searchParams = request.nextUrl.searchParams.toString();
    const query = qs.parse(searchParams);
    const { doc_id, sheet_name } = await params;
    const db = createDatabase(doc_id, sheet_name);

    try {
        await db.load();
        const docs = await db.find(query);
        const filteredDocs = docs.filter((doc: Document) => !isEmptyRow(doc));
        return createResponse(filteredDocs);
    } catch (error) {
        return handleError(error);
    }
}
