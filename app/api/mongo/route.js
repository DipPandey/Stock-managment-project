import { MongoClient, ServerApiVersion } from "mongodb"; // Add ServerApiVersion import here
import { NextResponse } from "next/server";
import { config } from "dotenv";
config(); // This will read the environment variables from the .env file


export async function GET(request) {
  const uri = process.env.MONGODB_URI;;
  const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("stock");
      const inventory = database.collection('inventory');
      const query = { };
      const allproducts = await inventory.find(query).toArray();
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return NextResponse.json({allproducts});
    } 
    finally {
      await client.close();
    }
  }

  export async function POST(request) {
    let body= request.body;
    const uri = process.env.MONGODB_URI;;
    const client = new MongoClient(uri);
      try {
        await client.connect();
        const database = client.db("stock");
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return NextResponse.json({product, ok:true});
      } 
      finally {
        await client.close();
      }
    }
