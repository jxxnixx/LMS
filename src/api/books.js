const BASE_URL = 'http://localhost:3000';

export const getBooks = async () => {
  const response = await fetch(`${BASE_URL}/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
};

export const getBookById = async (id) => {
  const response = await fetch(`${BASE_URL}/books/${id}`);
  if (!response.ok) throw new Error('Failed to fetch book');
  return response.json();
};

export const createBook = async (bookData) => {
  const response = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...bookData,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error('Failed to create book');
  return response.json();
};

export const updateBook = async (id, bookData) => {
  const response = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...bookData,
      updatedAt: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error('Failed to update book');
  return response.json();
};

export const deleteBook = async (id) => {
  const response = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete book');
  return response.json();
};

export const toggleLike = async (id, currentIsLiked) => {
  const response = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isLiked: !currentIsLiked }),
  });
  if (!response.ok) throw new Error('Failed to toggle like');
  return response.json();
};

/**
 * gpt-image-2를 사용하여 도서 표지 이미지를 생성합니다.
 */
export const generateBookCover = async (title, content) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API Key가 설정되지 않았습니다.');

  const sys_msg = "너는 글로벌 최고 수준의 도서 표지 디자인 전문가이다. 사용자가 제공하는 도서의 제목과 소개 내용을 깊이 있게 해석하여, 독자의 시선을 사로잡는 고품질의 실사 도서 표지 이미지를 생성해라.";

  const prompt = `
${sys_msg}

[도서 정보]
- 도서 제목: ${title}
- 도서 소개 내용: ${content}

[디자인 지시사항]
1. 위 도서 소개 내용의 핵심 주제와 분위기를 시각화하여 표지 배경과 오브제를 구성할 것.
2. 도서 제목인 "${title}" 문구를 이미지의 적절한 위치에 미적으로 아름답고 자연스럽게 한글 타이포그래피로 포함할 것.
3. 전반적으로 세련되고 감각적인 실사풍의 고품질 디자인을 적용할 것.
`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt: prompt,
      size: "1024x1536",
      quality: "low",
      n: 1
    })
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error.message);

  // b64_json이 있으면 그것을 사용하고, 없으면 url을 사용합니다.
  const imageData = result.data[0].b64_json || result.data[0].url;
  
  // 만약 b64_json인 경우 data:image 형식으로 만들어 반환
  if (result.data[0].b64_json) {
    return `data:image/png;base64,${imageData}`;
  }
  
  return imageData; // URL인 경우 그대로 반환
};
