import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faSearch, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    return (
        <div className="fixed h-screen flex flex-col bg-gray-800 text-white w-60">
            <div className="flex items-center justify-center h-20 border-b border-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>

                <span className="ml-5 text-xl">Stock Management Studio</span>
            </div>
            <nav className="flex flex-col mt-10 px-4 space-y-2">
                <a href="/" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    <FontAwesomeIcon icon={faHome} className="mr-3 w-5 h-5" />
                    Home
                </a>
                <a href="/product-list" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    <FontAwesomeIcon icon={faList} className="mr-3 w-5 h-5" />
                    Product List
                </a>
                <a href="https://www.google.com/" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    <FontAwesomeIcon icon={faSearch} className="mr-3 w-5 h-5" />
                    Internet Search
                </a>
                <a href="https://dip-portfolio-website.vercel.app" target="_blank" className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-3 w-5 h-5" />
                    My Portfolio
                </a>
                <a className="mr-10 text-gray-100 hover:text-gray-200">All rights reserved Dip Pandey 2024</a>
            </nav>
        </div>
    );
}

export default Sidebar;
