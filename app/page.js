'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/router';
export default function Home() {
    const [alert, setAlert] = useState('');
    const [productForm, setProductForm] = useState({});
    const [products, setProducts] = useState([]);
    const [dropdown, setDropdown] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/api/product');
            if (!response.ok) {
                console.error('Failed to fetch products');
                return;
            }
            try {
                let rjson = await response.json();
                setProducts(rjson.products);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        fetchProducts();
    }, []);

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
                setAlert('Your product has been added');
                setProductForm({});
                setShowSuccessPopup(true);

                setTimeout(() => {
                    setShowSuccessPopup(false);
                }, 3000);

                const fetchProducts = async () => {
                    const response = await fetch('/api/product');
                    let rjson = await response.json();
                    setProducts(rjson.products);
                };
                fetchProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error.message);
            alert('Failed to add product. Please try again later.');
        }
    };

    const handleChange = (e) => {
        setProductForm({ ...productForm, [e.target.name]: e.target.value });
    };

    const handleProductClick = (sku) => {
        window.location.href = `/product/${sku}`;
    };

    const debounce = (func, delay) => {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const onDropdownEdit = debounce(async (e) => {
        setDropdown([]);
        setQuery(e.target.value);
        if (!loading) {
            setLoading(true);
            const response = await fetch('/api/search?query=' + query);
            if (response.ok) {
                let rjson = await response.json();
                setDropdown(rjson.products || []);
            } else {
                console.error('Failed to fetch search results');
                setDropdown([]); // Handle errors gracefully
            }
            setLoading(false);
        }
    }, 300);

    return (
        <>
            <Header />
            <div className="relative min-h-screen flex">
                
                <div className={`flex-1 p-4 sm:p-2 transition-all duration-300 ${sidebarOpen ? 'ml-60' : ''}`}>
                    {alert && <div className="text-green-800 bg-green-200 rounded-full font-semibold text-center mb-4">{alert}</div>}
                    <h1 className="text-4xl font-semibold mb-6 text-center">Product Management</h1>

                    {showSuccessPopup && (
                        <div className="fixed top-10 right-10 bg-green-200 text-green-800 rounded-lg p-4 shadow-lg sm:right-2 sm:left-2 sm:text-center">
                            Product added successfully!
                        </div>
                    )}

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 sm:p-4">
                        <h2 className="text-2xl font-bold mb-4">Search a Product</h2>
                        <form className="flex mb-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                className="flex-grow border rounded-l-lg px-4 py-2 sm:px-2"
                                placeholder="Enter product SKU..."
                                onChange={onDropdownEdit}
                            />
                        </form>
                        {loading && (
                            <div className="flex justify-center mb-4">
                                <svg
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
                                </svg>
                            </div>
                        )}
                        <div className="dropcontainer absolute w-full bg-white border-1 rounded-md shadow-lg z-10 sm:w-11/12">
                            {dropdown.map((item) => (
                                <div
                                    key={item.SKU}
                                    className="my-1 p-2 container flex justify-between bg-gray-50 border-b-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleProductClick(item.SKU)}
                                >
                                    <span className="px-4 py-3 sm:px-2">{item.SKU} available for AUD${item.Price}</span>
                                    <div className="flex items-center">
                                        <span className="px-4 py-3 sm:px-2">Quantity: {item.QTY}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 sm:p-4">
                        <h2 className="text-2xl font-bold mb-4">Add a Product</h2>
                        <form onSubmit={addProduct}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product SKU:</label>
                                <input
                                    value={productForm?.SKU || ''}
                                    name="SKU"
                                    onChange={handleChange}
                                    type="text"
                                    className="border rounded-lg px-4 py-2 w-full sm:px-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                                <input
                                    value={productForm?.QTY || ''}
                                    name="QTY"
                                    onChange={handleChange}
                                    type="number"
                                    className="border rounded-lg px-4 py-2 w-full sm:px-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price:</label>
                                <input
                                    value={productForm?.Price || ''}
                                    name="Price"
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    className="border rounded-lg px-4 py-2 w-full sm:px-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order URL:</label>
                                <input
                                    value={productForm?.orderURL || ''}
                                    name="orderURL"
                                    onChange={handleChange}
                                    type="url"
                                    className="border rounded-lg px-4 py-2 w-full sm:px-2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 w-full"
                                onClick={async (event) => {
                                    event.preventDefault();
                                    await addProduct(event); // Add the product first
                                    window.location.href = '/product-list'; // Redirect to product list page
                                }}
                            >
                                Add Stock
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
