// 기존: 전체 도서 목록 가져오기
export const getBooks = async () => {
  const response = await fetch('http://localhost:3000/books');
  if (!response.ok) throw new Error('도서 목록을 불러오는데 실패했습니다.');
  return await response.json();
};

// 🌟 추가: 특정 도서 상세 정보 가져오기 (GET /books/:id)
export const getBookById = async (id) => {
  const response = await fetch(`http://localhost:3000/books/${id}`);
  if (!response.ok) throw new Error('도서 상세 정보를 불러오는데 실패했습니다.');
  return await response.json();
};