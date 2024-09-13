import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Import the local image
import cuteDogImg from '../assets/Frankie-Photo.jpg';

const Login = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/auth/login',
        {
          name,
          email,
        },
        { withCredentials: true }
      );

      // Redirect to the search page on successful login
      if (response.status === 200) {
        navigate('/search');
      }
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={cuteDogImg} alt="Cute dog" className="cute-dog-img" />
        <h2>Adopt-a-Paw Rescue</h2>
        <p className="subheading">Find your new furry friend!</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
