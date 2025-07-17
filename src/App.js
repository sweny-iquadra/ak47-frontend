import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import { Chatbot, Login, Signup, ProductDetails, Profile } from './components';
import LoginSuccess from './components/LoginSuccess';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login-success" element={<LoginSuccess />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;