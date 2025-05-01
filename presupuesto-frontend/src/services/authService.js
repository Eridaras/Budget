import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

/**  [BACKEND] – login */
export const loginUser = async (username, password) => {
  console.log('[LOGIN] Llamando a', `${API_URL}/auth/login`);
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, { username, password });
    console.log('[LOGIN] Éxito – datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('[LOGIN] Fallo:', error?.response?.data || error.message);
    throw error.response ? error.response.data.detail : 'Error de conexión';
  }
};
