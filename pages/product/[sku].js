import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../../app/globals.css';

const ProductDetail = () => {
    const router = useRouter();
    const { sku } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sku) return;

        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product?sku=${sku}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch product with SKU: ${sku}`);
                }
                const data = await response.json();
                setProduct(data.product);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [sku]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const updateQuantity = async (delta) => {
        const newQuantity = parseInt(product.QTY) + delta;
        if (newQuantity < 0) return;

        try {
            const response = await fetch('/api/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SKU: product.SKU, QTY: newQuantity }),
            });

            if (response.ok) {
                setProduct({ ...product, QTY: newQuantity });
            } else {
                console.error('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const deleteProduct = async () => {
        try {
            const response = await fetch(`/api/product?sku=${product.SKU}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/');
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const orderProduct = () => {
        if (!product.orderURL) {
            console.error('Order URL not set for this product');
            return;
        }
        window.open(product.orderURL, '_blank');
    };

    const updateOrderURL = async () => {
        try {
            const response = await fetch('/api/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SKU: product.SKU, orderURL: product.orderURL }),
            });

            if (response.ok) {
                console.log('Order URL updated');
            } else {
                console.error('Failed to update order URL');
            }
        } catch (error) {
            console.error('Error updating order URL:', error);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
                <div className="container mx-auto p-4 bg-white shadow rounded-lg">
                    <h1 className="text-4xl font-semibold mb-6">Product Details</h1>
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Product SKU</th>
                                <th className="px-4 py-2 border-b">Quantity</th>
                                <th className="px-4 py-2 border-b">Price/item</th>
                                <th className="px-4 py-2 border-b">Total Price</th>
                                <th className="px-4 py-2 border-b">Order URL</th>
                                <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2">{product.SKU}</td>
                                <td className="px-4 py-2">{product.QTY}</td>
                                <td className="px-4 py-2">AUD$ {product.Price}</td>
                                <td className="px-4 py-2">AUD$ {(product.QTY * product.Price).toFixed(2)}</td>
                                <td className="px-4 py-2 flex items-center">
                                    <input
                                        type="text"
                                        value={product.orderURL || ''}
                                        onChange={(e) => setProduct({ ...product, orderURL: e.target.value })}
                                        className="border rounded-lg px-2 py-1 flex-grow"
                                        placeholder="Order URL"
                                    />
                                    <button
                                        onClick={updateOrderURL}
                                        className="ml-2 text-blue-300 hover:text-blue-700"
                                    >
                                        <FontAwesomeIcon icon={faUpload} />
                                        Update
                                    </button>
                                </td>
                                <td className="px-4 py-2 flex space-x-2">
                                    <button
                                        onClick={() => updateQuantity(1)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => updateQuantity(-1)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={deleteProduct}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={orderProduct}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Order
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
