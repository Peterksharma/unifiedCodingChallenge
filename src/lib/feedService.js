import axios from 'axios';

const API_BASE_URL = 'https://api.dev.unified.community/v1';

export const fetchFeed = async (token, cursor = '', limit = 10) => {
  try {
    const url = `${API_BASE_URL}/feed?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`;
    const response = await axios.get(url, {
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