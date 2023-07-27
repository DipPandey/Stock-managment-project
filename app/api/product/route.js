import { MongoClient, ServerApiVersion } from "mongodb"; // Add ServerApiVersion import here
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = "mongodb+srv://rafayj34:rafayjamal1122@stockmanagement.ftxsygi.mongodb.net/";
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
    let body= await request.json();
    const uri = "mongodb+srv://rafayj34:rafayjamal1122@stockmanagement.ftxsygi.mongodb.net/";
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
