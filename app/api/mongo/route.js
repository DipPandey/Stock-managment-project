import { MongoClient } from 'mongodb'; // Import MongoClient
import { NextResponse } from 'next/server';
import { config } from 'dotenv';
config(); // Load environment variables

const uri = process.env.MONGODB_URI; // Define URI globally to avoid repeated calls

// Handler for GET requests
export async function GET(request) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1, // Set server API version
    });

    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const allproducts = await inventory.find({}).toArray(); // Fetch all products
        console.log("Successfully connected to MongoDB and retrieved products.");
        return NextResponse.json({ allproducts });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
    } finally {
        await client.close();
    }
}

// Handler for POST requests
export async function POST(request) {
    const body = await request.json(); // Read JSON body
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1, // Set server API version
    });

    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body); // Insert new product
        console.log("Successfully connected to MongoDB and inserted product.");
        return NextResponse.json({ product, ok: true });
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "Error inserting product" }, { status: 500 });
    } finally {
        await client.close();
    }
}
