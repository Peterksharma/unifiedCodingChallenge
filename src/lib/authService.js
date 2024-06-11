import axios from 'axios';

export const getToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      `grant_type=password&username=${encodeURIComponent(process.env.NEXT_PUBLIC_USERNAME)}&password=${encodeURIComponent(process.env.NEXT_PUBLIC_PASSWORD)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;  
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};
