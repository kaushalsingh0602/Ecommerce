"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

interface OtpResponse {
  status: boolean;
  msg: string;
}

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(8).fill(''));
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    setOtp(prevOtp => [...prevOtp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLElement).focus();
    }
  };

  const handleKeyDown = (element: HTMLInputElement, index: number) => {
    if (element.value === '' && element.previousSibling) {
      (element.previousSibling as HTMLElement).focus();
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post<OtpResponse>("http://localhost:3000/api/otp", { email, otp });
      const responseData = response.data;
      if (responseData.status) {
        console.log('Verifying OTP for email', email, 'with OTP', otp.join(''));
        alert(responseData.msg);
        router.push('/login');
      } else {
        alert("Please enter valid details");
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert("Verification failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Verify your email</h1>
        <p className="text-center mb-6">
          {email ? (
            `Enter the 8-digit code you have received on ${email.replace(/(.{2}).*?(@.*)/, '$1***$2')}`
          ) : (
            'No email provided'
          )}
        </p>
        <div className="flex justify-center mb-6 space-x-2">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength={1}
              value={data}
              onChange={e => handleChange(e.target as HTMLInputElement, index)}
              onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e.target as HTMLInputElement, index)}
              onFocus={e => e.target.select()}
              className="w-12 h-12 text-center text-xl border rounded-lg"
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
