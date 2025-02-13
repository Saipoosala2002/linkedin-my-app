// src/LinkedInLogin.js
import React from 'react';
import LinkedIn from 'react-linkedin-login-oauth2';

const LinkedInLogin = () => {
  const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID; // Use environment variable for Client ID

  const handleSuccess = (response) => {
    console.log('Login Success:', response);
    exchangeCodeForToken(response.code);
  };

  const handleFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000', // Must match the redirect URI in your LinkedIn app
          client_id: clientId,
          // client_secret: clientSecret, // Ensure this line is removed
        }),
      });

      const data = await response.json();
      console.log('Access Token:', data.access_token);
      fetchUser (data.access_token); // Call fetchUser  with the access token
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const fetchUser  = async (accessToken) => {
    try {
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();
      console.log('User  Data:', userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div>
      <h1>Login with LinkedIn</h1>
      <LinkedIn
        clientId={clientId}
        redirectUri="http://localhost:3000" // Must match the redirect URI in your LinkedIn app
        onSuccess={handleSuccess}
        onFailure={handleFailure}
      >
        <img
          src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg"
          alt="Login with LinkedIn"
          style={{ width: '200px', cursor: 'pointer' }}
        />
      </LinkedIn>
    </div>
  );
};

export default LinkedInLogin;