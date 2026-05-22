const BASE_URL = 'http://localhost:3000';

export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genres`);
  if (!response.ok) throw new Error('Failed to fetch genres');
  return response.json();
};
