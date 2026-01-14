import { Database } from 'sheetsql';
import path from 'node:path';
import qs from 'qs';
import { NextRequest } from 'next/server';
import fs from 'fs/promises';

type Params = {
    doc_id: string;
    sheet_name: string[];
};

interface Document {
    [key: string]: unknown;
}

async function getServiceAccountPath() {
    if (process.env.NODE_ENV === 'development') {
        return path.join(process.cwd(), 'google-serviceaccount.json');
    }

    const tempDir = path.join('/tmp', '.temp');
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

async function createDatabase(doc_id: string, sheet_name?: string[]) {
    const commonDbConfig = await getCommonDbConfig();
    return new Database({
        ...commonDbConfig,
        db: doc_id,
        table: sheet_name?.[0],
    });
}

function handleError(error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response: { data: { error: unknown }; status: number } };
        return new Response(
            JSON.stringify(err.response.data.error),
            { 
                status: err.response.status,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    return new Response(
        JSON.stringify({ message: 'Internal Server Error' }),
        { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { doc_id, sheet_name } = await params;
    const db = await createDatabase(doc_id, sheet_name);
    
    try {
        const body = await request.json();
        await db.load();
        
        const docs: Document[] = Array.isArray(body) ? body : [body];
        const insertedDocs = await db.insert(docs);
        
        return new Response(JSON.stringify(insertedDocs), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
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
    const db = await createDatabase(doc_id, sheet_name);
    
    try {
        await db.load();
        const removedDocs = await db.remove(query);
        
        return new Response(JSON.stringify(removedDocs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
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
    const db = await createDatabase(doc_id, sheet_name);
    
    try {
        const body = await request.json();
        await db.load();
        const updatedDocs = await db.update(query, body);
        
        return new Response(JSON.stringify(updatedDocs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { doc_id, sheet_name } = await params;
    const searchParams = request.nextUrl.searchParams.toString();
    const query = qs.parse(searchParams);
    const db = await createDatabase(doc_id, sheet_name);
    
    try {
        const body = await request.json();
        await db.load();
        const updatedDoc = await db.updateOne(query, body);
        
        if (!updatedDoc) {
            return new Response(JSON.stringify({ message: 'Document not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify(updatedDoc), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
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
    const db = await createDatabase(doc_id, sheet_name);
    
    try {
        await db.load();
        const docs = await db.find(query);
        return new Response(JSON.stringify(docs), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleError(error);
    }
}
