import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import { Chatbot, Login, Signup, ProductDetails, Profile } from './components';
import LoginSuccess from './components/LoginSuccess';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSuccess from './components/PaymentSuccess';
import ResetPassword from './components/ResetPassword';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Router>
      </Elements>
    </div>
  );
}

export default App;