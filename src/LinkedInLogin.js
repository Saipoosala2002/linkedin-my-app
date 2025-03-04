// src/LinkedInLogin.js
import React from 'react';
import LinkedIn from 'react-linkedin-login-oauth2';

const LinkedInLogin = () => {
  const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_LINKEDIN_REDIRECT_URI || 'http://localhost:3000';

  const handleSuccess = (response) => {
    if (response.code) {
      console.log('Login Success:', response);
      exchangeCodeForToken(response.code);
    } else {
      console.error('No authorization code received.');
    }
  };

  const handleFailure = (error) => {
    console.error('LinkedIn Login Failed:', error);
    alert('Login failed! Please try again.');
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        console.log('Access Token:', data.access_token);
        fetchUser(data.access_token);
      } else {
        console.error('Error fetching access token:', data);
        alert('Login failed! Please try again.');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const fetchUser = async (accessToken) => {
    try {
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = await response.json();
      console.log('User Data:', userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to retrieve LinkedIn profile!');
    }
  };

  return (
    <div>
      <h1>Login with LinkedIn</h1>
      <LinkedIn
        clientId={clientId}
        redirectUri={redirectUri}
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
