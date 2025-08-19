import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import UserContext from './context/UserContext';
import ProductContextProvider from './context/ProductContext';

const root = ReactDOM.createRoot(document.getElementById('root'));




root.render(
  <React.StrictMode>
    <UserContext>
      <ProductContextProvider>
        <Toaster></Toaster>
        <App />
      </ProductContextProvider>
    </UserContext>
  </React.StrictMode>
);


