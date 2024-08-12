import { MongoClient, ServerApiVersion } from "mongodb";
import { NextResponse } from "next/server";
import { config } from "dotenv";

config();

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection("inventory");

        // Ensure an index exists on SKU for performance
        await inventory.createIndex({ SKU: 1 });

        // Search for products where SKU matches the query (case-insensitive)
        const products = await inventory
            .find({
                SKU: { $regex: new RegExp(query, "i") }
            })
            .toArray();

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Return a structured response
        return NextResponse.json({
            success: true,
            total: products.length,
            products: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch products. Please try again later."
        });
    } finally {
        await client.close();
    }
}
