'use client';
import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  const [productForm, setproductForm] = useState({})

  const addProduct = async (event) => {
    event.preventDefault();
    // const productData = {
    //   productName,
    //   quantity,
    //   price,
    // };
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (!response.ok) {
        throw new Error('Failed to add product.');
      }

      // // Clear form fields after successful addition
      // setProductName('');
      // setQuantity(0);
      // setPrice(0);

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error.message);
      alert('Failed to add product. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setproductForm({ ...productForm, [e.target.name]: e.target.value });
  }


  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission and update the table here
  };

  return (
    <>
      <Header />
      {/* Search a Product */}
      <div className="container bg-red-50 mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Search a product</h1>
        <form className="mb-6 flex">
          <input
            type="text"
            className="flex-grow border rounded-l-lg px-4 py-2"
            placeholder="Enter product SKU..."
          />
          <select className="border rounded-r-lg bg-white text-gray-800 px-4 py-2">
            <option value="SKU">SKU</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
          >
            Search
          </button>
        </form>
      </div>
      {/* Add to Current Stock */}
      <div className="container bg-red-50 mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Add a product</h1>
        <form className="mb-6">
          <div className="flex mb-4">
            <label className="mr-2 w-24">Product SKU:</label>
            <input name='SKU' onChange={handleChange} type="text" className="flex-grow border rounded-lg px-4 py-2" />
          </div>
          <div className="flex mb-4">
            <label className="mr-2 w-24">Quantity:</label>
            <input name='QTY' onChange={handleChange} type="number" className="flex-grow border rounded-lg px-4 py-2" />
          </div>
          <div className="flex mb-4">
            <label className="mr-2 w-24">Price:</label>
            <input name='Price' onChange={handleChange} type="number" step="0.01" className="flex-grow border rounded-lg px-4 py-2" />
          </div>
          <button onClick={addProduct} type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2">
            Add Stock
          </button>
        </form>
      </div>
      <div className="container bg-red-50 mx-auto p-4">
        {/* Table to display stock */}
        <h1 className="text-4xl font-bold mb-6">Products</h1>
        <table className="table w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product SKU</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Product A</td>
              <td className="px-4 py-2">100</td>
              <td className="px-4 py-2">$10.99</td>
              {/* Add more table rows for each product */}
            </tr>
            <tr>
              <td className="px-4 py-2">Product B</td>
              <td className="px-4 py-2">50</td>
              <td className="px-4 py-2">$7.99</td>
            </tr>
            {/* Add more table rows for each product */}
          </tbody>
        </table>
      </div>
    </>
  );
}
