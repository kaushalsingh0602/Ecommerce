// src/app/_components/Header.tsx
import Link from 'next/link';
import React from 'react';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <>
    <header className="bg-white shadow-md">
        <div className="flex justify-end space-x-4 px-4">
          <a href="/" className="text-gray-700 hover:text-black">Help</a>
          <a href="/" className="text-gray-700 hover:text-black">Orders & Returns</a>
          <a href="/profile" className="text-gray-700 hover:text-black">Hi, John</a>
        </div>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      
        <div className="text-2xl  text-black font-bold">ECOMMERCE</div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/categories" className="text-gray-700 hover:text-black">Categories</Link></li>
            <li><Link href="/" className="text-gray-700 hover:text-black">Sale</Link></li>
            <li><Link href="/" className="text-gray-700 hover:text-black">Clearance</Link></li>
            <li><Link href="/" className="text-gray-700 hover:text-black">New stock</Link></li>
            <li><Link href="/" className="text-gray-700 hover:text-black">Trending</Link></li>
          </ul>
        </nav>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-700 hover:text-black"><FaSearch className="text-xl" /></Link>
          <Link href="/" className="text-gray-700 hover:text-black"><FaShoppingCart className="text-xl" /></Link>
        </div>
      </div>
    </header>
    <div  className="bg-gray-300 flex justify-center space-x-4">
  
        <span>&#60;</span>
        <h3>Get 10%  off on business sign up </h3>
         <span>&#62;</span>
    </div>
    </>
  );
};

export default Header;
