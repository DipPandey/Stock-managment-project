import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import '../app/globals.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/api/product');
            const data = await response.json();
            setProducts(data.products);
        };

        fetchProducts();
    }, []);

    const updateQuantity = async (sku, delta) => {
        const updatedProduct = products.find(product => product.SKU === sku);
        if (!updatedProduct) return;

        const newQuantity = parseInt(updatedProduct.QTY) + delta;
        if (newQuantity < 0) return;

        const response = await fetch('/api/product', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ SKU: sku, QTY: newQuantity }),
        });

        if (response.ok) {
            setProducts(products.map(product =>
                product.SKU === sku ? { ...product, QTY: newQuantity } : product
            ));
        } else {
            console.error('Failed to update quantity');
        }
    };

    const deleteProduct = async (sku) => {
        const response = await fetch(`/api/product?sku=${sku}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setProducts(products.filter(product => product.SKU !== sku));
        } else {
            console.error('Failed to delete product');
        }
    };

    const orderProduct = async (sku) => {
        // Logic for ordering a product
    };

    const trackOrder = async (sku) => {
        // Logic for tracking an order
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
                <div className="container mx-auto p-4 bg-white shadow rounded-lg">
                    <h1 className="text-4xl font-semibold mb-6">Products List</h1>
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Product SKU</th>
                                <th className="px-4 py-2 border-b">Quantity</th>
                                <th className="px-4 py-2 border-b">Price/item</th>
                                <th className="px-4 py-2 border-b">Total Price</th>
                                <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.SKU} className="border-b">
                                    <td className="px-4 py-2">{product.SKU}</td>
                                    <td className="px-4 py-2">{product.QTY}</td>
                                    <td className="px-4 py-2">AUD$ {product.Price}</td>
                                    <td className="px-4 py-2">AUD$ {product.QTY * product.Price}</td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => updateQuantity(product.SKU, 1)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => updateQuantity(product.SKU, -1)}
                                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                        >
                                            -
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.SKU)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => orderProduct(product.SKU)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Order
                                        </button>
                                        <button
                                            onClick={() => trackOrder(product.SKU)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Track
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
