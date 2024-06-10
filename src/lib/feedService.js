import axios from 'axios';

const API_BASE_URL = 'https://api.dev.unified.community/v1';

export const fetchFeed = async (token, cursor = '') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feed?limit=10&cursor=${cursor}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    return { posts: [], pagination: { next_cursor: '' } };
  }
};

export const fetchPost = async (token, postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};