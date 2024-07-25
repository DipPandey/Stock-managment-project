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
    const { SKU, QTY, orderURL } = body;
    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const updateFields = {};
        if (QTY !== undefined) updateFields.QTY = QTY;
        if (orderURL !== undefined) updateFields.orderURL = orderURL;
        const result = await inventory.updateOne({ SKU }, { $set: updateFields });
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

export async function ORDER(request) {
    const body = await request.json();
    const { SKU, orderDetails } = body;
    try {
        await client.connect();
        const database = client.db("stock");
        const orders = database.collection('orders');
        const order = await orders.insertOne({ SKU, orderDetails, status: 'ordered' });

        const inventory = database.collection('inventory');
        const product = await inventory.findOne({ SKU });

        return NextResponse.json({ order, orderURL: product.orderURL, ok: true });
    } finally {
        await client.close();
    }
}

export async function TRACK(request) {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    try {
        await client.connect();
        const database = client.db("stock");
        const orders = database.collection('orders');
        const order = await orders.findOne({ _id: new MongoClient.ObjectId(orderId) });
        return NextResponse.json({ order });
    } finally {
        await client.close();
    }
}
