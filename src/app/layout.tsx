// src/app/layout.tsx
import React from 'react';
import Header from './_components/Header';
import '../styles/globals.css';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* <title>Ecommerce</title> */}
        <meta name="description" content="Ecommerce site" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
