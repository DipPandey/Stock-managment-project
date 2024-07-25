import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { config } from 'dotenv';
config();

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET(request) {
    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const products = await inventory.find({}).toArray();
        return NextResponse.json({ products });
    } finally {
        await client.close();
    }
}

export async function POST(request) {
    const body = await request.json();
    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body);
        return NextResponse.json({ product, ok: true });
    } finally {
        await client.close();
    }
}

export async function PUT(request) {
    const body = await request.json();
    const { SKU, QTY } = body;
    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const result = await inventory.updateOne({ SKU }, { $set: { QTY } });
        return NextResponse.json({ result, ok: true });
    } finally {
        await client.close();
    }
}

export async function DELETE(request) {
    const url = new URL(request.url);
    const sku = url.searchParams.get('sku');
    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const result = await inventory.deleteOne({ SKU: sku });
        return NextResponse.json({ result, ok: true });
    } finally {
        await client.close();
    }
}
