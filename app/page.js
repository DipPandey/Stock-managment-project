'use client';
import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  const [alert, setalert] = useState('')
  const [productForm, setproductForm] = useState({})
  const [products, setproducts] = useState([])
  const [dropdown, setdropdown] = useState([])
  const [query, setquery] = useState('')
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const fetchProducts= async () => {
      const response = await fetch('/api/product');
      let rjson = await response.json()
      // console.log(rjson)
      setproducts(rjson.products)
    }
    fetchProducts()
  }, [])
  const addProduct = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        setalert("Your product has been added");
        setproductForm({})
      }

      
      
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
const onDropdownEdit = async (e) => {
  setdropdown([])
  setquery(e.target.value)
  if(!loading) {
  setloading(true)
    const response = await fetch('/api/search?query='+ query);
    let rjson = await response.json()
    // console.log(rjson)
    setdropdown(rjson.products)
    setloading(false)
  }}

  return (
    <>
      <Header />
      {/* Search a Product */}
      <div className="container my-5 mx-auto p-4">
        <div className='text-green-800 bg-green-200 rounded-full font-semibold text-center'>{alert}</div>
        <h1 className="text-4xl font-semibold mb-6">Search a product</h1>
        <form className="flex">
          <input
            type="text"
            className="flex-grow border rounded-l-lg px-4 py-2"
            placeholder="Enter product SKU..."
            onChange={onDropdownEdit}
    
          />

          {/* <select className="border rounded-r-lg bg-white text-gray-800 px-4 py-2">
            <option value="SKU">SKU</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select> */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
          >
            Search
          </button>
        </form>
       {loading && <svg
  xmlns="http://www.w3.org/2000/svg"
  width="50"
  height="50"
  viewBox="0 0 50 50"
  fill="none"
>
  <circle
    cx="25"
    cy="25"
    r="20"
    stroke="black"
    strokeWidth="5"
    fill="transparent"
    strokeDasharray="80 60"
    transform="rotate(0)"
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      repeatCount="indefinite"
      dur="1s"
      keyTimes="0;1"
      values="0 25 25;360 25 25"
    />
  </circle>
</svg>}
<div className="dropcontainer absolute w-[72vw] bg-white border-1 rounded-md">
        {dropdown.map(item => {
            return <div key={item.SKU} className=" my-1 p-2 container flex justify-between bg-gray-50  border-b-2 ">
            <span className="px-4 py-3">{item.SKU} available for Rs.{item.Price}</span>
             <div className='mx-5'>
             <span className= "p-2 rounded-xl bg-green-100 cursor-pointer">+</span>
             <span className= "px-4 py-3">Quantity: {item.QTY}</span>
             <span className= "p-2 rounded-xl bg-red-100  cursor-pointer">-</span>
             </div>
             </div>
          })}
          </div> 
      </div>

      {/* Add to Current Stock */}
      <div className="container my-5 mx-auto p-4">
        <h1 className="text-4xl font-semibold mb-6">Add a product</h1>
        <form className="mb-6">
          <div className="flex mb-4">
            <label className="mr-2 w-24">Product SKU:</label>
            <input value={productForm?.SKU || ''} name='SKU' onChange={handleChange} type="text" className="flex-grow border rounded-lg px-4 py-2" />
          </div>
          <div className="flex mb-4">
            <label className="mr-2 w-24">Quantity:</label>
            <input value={productForm?.QTY || ''} name='QTY' onChange={handleChange} type="number" className="flex-grow border rounded-lg px-4 py-2" />
          </div>
          <div className="flex mb-4">
            <label className="mr-2 w-24">Price:</label>
            <input value={productForm?.Price || ''} name='Price' onChange={handleChange} type="number" step="0.01" className="flex-grow border rounded-lg px-4 py-2" />
          </div>
          <button onClick={addProduct} type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2">
            Add Stock
          </button>
        </form>
      </div>
      <div className="container my-5 mx-auto p-4">
        {/* Table to display stock */}
        <h1 className="text-4xl font-semibold mb-6">Products</h1>
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
            {products.map(product => {
              return <tr key={product.SKU}>
              <td className="px-4 py-2">{product.SKU}</td>
              <td className="px-4 py-2">{product.QTY}</td>
              <td className="px-5 py-2">Rs.{product.Price}</td>
            </tr>
          })}
          </tbody>
        </table>
      </div>
    </>
  );
}
