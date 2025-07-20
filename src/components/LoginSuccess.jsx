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

      // Fetch user data after storing token
      const fetchUserData = async () => {
        try {
          const userData = await userAPI.getProfile();
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('✅ User data stored after Google login:', userData);
          navigate('/');
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          // Still navigate to home even if user data fetch fails
          navigate('/');
        }
      };

      fetchUserData();
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