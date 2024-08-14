import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import '../app/globals.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(''); // State for managing alert messages
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/product');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [router.asPath]); // Re-fetch data whenever the route changes

    const updateQuantity = (sku, delta) => {
        const updatedProduct = products.find(product => product.SKU === sku);
        if (!updatedProduct) return;

        const newQuantity = parseInt(updatedProduct.QTY) + delta;
        if (newQuantity < 0) return;

        // Immediately update the UI for a faster user experience
        setProducts(prevProducts => prevProducts.map(product =>
            product.SKU === sku ? { ...product, QTY: newQuantity } : product
        ));

        // Asynchronously update the backend
        fetch('/api/product', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ SKU: sku, QTY: newQuantity }),
        }).catch(error => console.error('Error updating quantity:', error));
    };

    const deleteProduct = async (sku) => {
        // Immediately update the UI for a faster user experience
        setProducts(prevProducts => prevProducts.filter(product => product.SKU !== sku));

        try {
            const response = await fetch(`/api/product?sku=${sku}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAlert('Product successfully deleted!');
                setTimeout(() => setAlert(''), 3000); // Clear the alert after 3 seconds
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const orderProduct = (sku) => {
        const product = products.find(p => p.SKU === sku);
        if (!product || !product.orderURL) {
            console.error('Order URL not set for this product');
            return;
        }
        window.open(product.orderURL, '_blank');
    };

    const updateOrderURL = async (sku, orderURL) => {
        const updatedProduct = products.find(product => product.SKU === sku);
        if (!updatedProduct) return;

        setProducts(products.map(product =>
            product.SKU === sku ? { ...product, orderURL } : product
        ));

        try {
            const response = await fetch('/api/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SKU: sku, orderURL }),
            });

            if (response.ok) {
                setAlert('Order URL updated successfully!');
                setTimeout(() => setAlert(''), 3000); // Clear the alert after 3 seconds
            } else {
                console.error('Failed to update order URL');
            }
        } catch (error) {
            console.error('Error updating order URL:', error);
        }
    };

    const navigateToProductDetail = (sku) => {
        router.push(`/product/${sku}`);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar className="fixed left-0 top-0 h-full w-64" />
            <div className="flex-1 ml-64 p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
                        {alert && (
                            <div className="text-green-800 bg-green-200 rounded-full font-semibold text-center mb-4 p-2">
                                {alert}
                            </div>
                        )}
                        <h1 className="text-4xl font-bold mb-6 text-center">Products List In-house</h1>
                        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Product SKU</th>
                                    <th className="px-4 py-3 text-left">Quantity</th>
                                    <th className="px-4 py-3 text-left">Price/item</th>
                                    <th className="px-4 py-3 text-left">Total Price</th>
                                    <th className="px-4 py-3 text-left">Order URL</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr
                                        key={product.SKU}
                                        className="hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => navigateToProductDetail(product.SKU)}
                                    >
                                        <td className="px-4 py-2">{product.SKU}</td>
                                        <td className="px-4 py-2">{product.QTY}</td>
                                        <td className="px-4 py-2">AUD$ {product.Price}</td>
                                        <td className="px-4 py-2">AUD$ {(product.QTY * product.Price).toFixed(2)}</td>
                                        <td className="px-4 py-2 flex items-center">
                                            <input
                                                type="text"
                                                value={product.orderURL || ''}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => updateOrderURL(product.SKU, e.target.value)}
                                                className="border rounded-lg px-2 py-1 flex-grow text-gray-700"
                                                placeholder="Order URL"
                                            />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateOrderURL(product.SKU, product.orderURL); }}
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                            >
                                                <FontAwesomeIcon icon={faUpload} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 flex space-x-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateQuantity(product.SKU, 1); }}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateQuantity(product.SKU, -1); }}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteProduct(product.SKU); }}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); orderProduct(product.SKU); }}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Order
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
