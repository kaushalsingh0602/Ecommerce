// src/pages/login.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import axios  from 'axios';
import { useRouter, } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Register the user
      const response = await axios.post("http://localhost:3000/api/login", { email, password });
      if (response.data.status === true) {
        // Store email in sessionStorage and redirect
        sessionStorage.setItem('token', response.data.token);
        // console.log(response.data)
        alert(response.data.msg);
        router.push('/categories');
      }else{
        alert(response.data.msg);

      }
      
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
   
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Login
          </button>
          <p className="mt-4 text-center">
            Don't have an account? <Link href="/" className="text-blue-500">Register</Link>
          </p>
        </div>
      </div>
   
  );
};

export default Login;
