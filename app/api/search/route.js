import { MongoClient, ServerApiVersion } from "mongodb"; // Add ServerApiVersion import here
import { NextResponse } from "next/server";
import { config } from "dotenv";

config(); 
 
export async function GET(request) {
  const query= request.nextUrl.searchParams.get("query")
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("stock");
      const inventory = database.collection('inventory');
      const products = await inventory.aggregate([{
        $match: {  
        $or: [
            { SKU: { $regex: query, $options: "i" } },     // Case-insensitive partial or full match for SKU
          ]
        }
        }
        ]).toArray()

      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return NextResponse.json({products});
    } 
    finally {
      await client.close();
    }
  }

