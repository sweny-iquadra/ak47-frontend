import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Fetch user profile and store in localStorage
      const fetchUser = async () => {
        try {
          const user = await userAPI.getProfile();
          console.log('✅ Google login: fetched user profile:', user);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error('❌ Google login: failed to fetch user profile:', e);
          // fallback: clear user if fetch fails
          localStorage.removeItem('user');
        }
        navigate('/');
      };
      fetchUser();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Logging you in with Google...</div>
    </div>
  );
};

export default LoginSuccess; 