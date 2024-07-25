import React from 'react';

const Sidebar = () => {
    return (
        <div className="fixed h-screen flex flex-col bg-gray-800 text-white w-60">
            <div className="flex items-center justify-center h-20 border-b border-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-3 text-xl">Stock Management Studio</span>
            </div>
            <nav className="flex flex-col mt-10 px-4 space-y-2">
                <a href="/" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    Home
                </a>
                <a href="/product-list" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    Product List
                </a>
                <a href="https://www.google.com/" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    Internet Search
                </a>
                <a href="https://dip-portfolio-website.vercel.app" target="_blank" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    My Portfolio
                </a>
                <a className="mr-10 hover:t ext-gray-100">All rights reserved Dip Pandey 2024</a>
            </nav>
        </div>
    );
}

export default Sidebar;
