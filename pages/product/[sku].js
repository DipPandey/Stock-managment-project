import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2">{product.SKU}</td>
                                <td className="px-4 py-2">{product.QTY}</td>
                                <td className="px-4 py-2">AUD$ {product.Price}</td>
                                <td className="px-4 py-2">AUD$ {(product.QTY * product.Price).toFixed(2)}</td>
                                <td className="px-4 py-2">{product.orderURL}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
