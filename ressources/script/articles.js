document.addEventListener('DOMContentLoaded', () => {
  initDynamicArticles();
});

function initDynamicArticles() {
  const articlesList = document.getElementById('articles-list');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-btn');
  if (!articlesList) return;

  let articles = [];

  function renderState(message, type = 'info') {
    articlesList.innerHTML = `<p class="articles-state articles-state-${type}">${escapeHtml(message)}</p>`;
  }

  function articleMatchesQuery(article, query) {
    if (!query) return true;

    const searchableText = [
      article.title,
      article.subtitle,
      article.year,
      article.type,
      article.author?.name,
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(query);
  }

  function renderArticles() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const filteredArticles = articles.filter(article => articleMatchesQuery(article, query));

    if (filteredArticles.length === 0) {
      renderState(query ? 'No articles match your search.' : 'No articles are available yet.', 'empty');
      return;
    }

    articlesList.innerHTML = filteredArticles.map((article, index) => {
      const imageUrl = getArticleImage(article);
      const delayClass = `delay-${(index % 4) + 1}`;

      return `
        <a href="temple.html?id=${encodeURIComponent(article.id)}" class="article-list-card reveal ${delayClass}">
          <div class="article-list-card-img${imageUrl ? '' : ' article-list-card-img-empty'}">
            ${imageUrl ? `<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(article.title || 'Article cover')}" loading="lazy">` : ''}
          </div>
          <div class="article-list-card-body">
            <div class="article-list-card-meta">
              <span class="tag">${escapeHtml(article.type || 'Article')}</span>
              <span>${escapeHtml(formatArticleYear(article.year))}</span>
            </div>
            <h3>${escapeHtml(article.title || 'Untitled article')}</h3>
            <p>${escapeHtml(article.subtitle || '')}</p>
          </div>
        </a>
      `;
    }).join('');

    articlesList.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        const imageWrapper = img.closest('.article-list-card-img');
        img.remove();
        if (imageWrapper) imageWrapper.classList.add('article-list-card-img-empty');
      }, { once: true });
    });

    if (typeof initScrollReveal === 'function') {
      setTimeout(initScrollReveal, 100);
    }
  }

  renderState('Loading articles...');

  getArticles()
    .then(data => {
      articles = data;
      renderArticles();
    })
    .catch(error => {
      console.error(error);
      renderState('Unable to load articles. Please try again later.', 'error');
    });

  searchInput?.addEventListener('input', renderArticles);
  searchButton?.addEventListener('click', renderArticles);
}

function formatArticleYear(year) {
  return year ? `Est. ${year}` : 'Year unknown';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}
