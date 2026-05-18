const API_BASE_URL = 'https://digital-harbor.shop/api';

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function getArticles() {
  const json = await fetchJson(`${API_BASE_URL}/articles`);
  return Array.isArray(json.data) ? json.data : [];
}

async function getArticle(id) {
  const json = await fetchJson(`${API_BASE_URL}/articles/${encodeURIComponent(id)}`);
  return json.data;
}

function getArticleImage(article) {
  return article?.img_url || article?.image_url || '';
}
