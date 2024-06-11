import axios from 'axios';

const API_BASE_URL = 'https://api.dev.unified.community/v1';

export const fetchPost = async (token, postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};