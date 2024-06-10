import axios from 'axios';


export const loginUser = async () => {
  try {
    console.log('API_BASE_URL:', process.env.API_BASE_URL);
    console.log('USERNAME:', process.env.USERNAME);
    console.log('PASSWORD:', process.env.PASSWORD);

    const response = await axios.post(`${process.env.API_BASE_URL}/auth/login`, 
      `grant_type=password&username=${encodeURIComponent(process.env.USERNAME)}&password=${encodeURIComponent(process.env.PASSWORD)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log('Login response:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};