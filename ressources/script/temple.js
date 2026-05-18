document.addEventListener('DOMContentLoaded', () => {
  initDynamicTemple();
});

function initDynamicTemple() {
  const contentEl = document.getElementById('temple-content');
  const titleEl = document.getElementById('temple-name');
  const subtitleEl = document.getElementById('temple-subtitle');
  const coverEl = document.getElementById('temple-hero-img');
  const pageTitleEl = document.getElementById('page-title');
  if (!contentEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  function renderError(message) {
    contentEl.innerHTML = `
      <div class="temple-state temple-state-error">
        <h2>${escapeHtml(message)}</h2>
        <p>Please return to the articles page and choose an article.</p>
        <a href="articles.html" class="btn btn-outline">Browse Articles</a>
      </div>
    `;
  }

  if (!id) {
    if (titleEl) titleEl.textContent = 'Article id is missing';
    if (subtitleEl) subtitleEl.textContent = 'Choose an article from the articles page.';
    if (pageTitleEl) pageTitleEl.textContent = 'Article id is missing - Nikkoshi Pearls';
    renderError('Article id is missing.');
    return;
  }

  contentEl.innerHTML = '<p class="temple-state">Loading article...</p>';

  getArticle(id)
    .then(article => {
      if (!article) {
        renderError('Unable to load this article.');
        return;
      }

      renderArticle(article);
    })
    .catch(error => {
      console.error(error);
      renderError('Unable to load this article.');
    });

  function renderArticle(article) {
    const imageUrl = getArticleImage(article);
    const title = article.title || 'Untitled article';
    const subtitle = article.subtitle || '';
    const paragraphs = [...(article.paragraphs || [])].sort(
      (a, b) => Number(a.order || 0) - Number(b.order || 0)
    );
    const timelines = [...(article.timelines || [])].sort(
      (a, b) => Number(a.year || 0) - Number(b.year || 0)
    );

    if (pageTitleEl) pageTitleEl.textContent = `${title} - Nikkoshi Pearls`;
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;

    if (coverEl) {
      coverEl.alt = title;
      if (imageUrl) coverEl.src = imageUrl;
      coverEl.addEventListener('error', () => {
        coverEl.src = 'ressources/static/img/articles_page_banner.jpg';
      }, { once: true });
    }

    const coverSection = imageUrl ? `
      <div class="temple-article-img reveal-scale">
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(title)}" loading="lazy">
      </div>
    ` : '';

    const paragraphSections = paragraphs.length > 0
      ? paragraphs.map(paragraph => `
          <section class="temple-section">
            <h2 class="reveal">${escapeHtml(paragraph.title || 'Article section')}</h2>
            <p class="reveal">${escapeHtml(paragraph.text || '')}</p>
          </section>
        `).join('')
      : '<p class="temple-state temple-state-empty">No paragraphs are available for this article yet.</p>';

    const timelineSection = timelines.length > 0 ? `
      <h2 class="reveal">Historical Timeline</h2>
      <div class="timeline reveal">
        ${timelines.map(item => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-year">${escapeHtml(item.year || 'Unknown')}</div>
            <p class="timeline-text">${escapeHtml(item.event || '')}</p>
          </div>
        `).join('')}
      </div>
    ` : '<p class="temple-state temple-state-empty">No timeline events are available for this article yet.</p>';

    contentEl.innerHTML = `
      <div class="temple-article-meta reveal">
        <span class="tag">${escapeHtml(article.type || 'Article')}</span>
        <span>${escapeHtml(formatArticleYear(article.year))}</span>
      </div>
      ${coverSection}
      ${paragraphSections}
      ${timelineSection}
    `;

    contentEl.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.closest('.temple-article-img')?.remove();
      }, { once: true });
    });

    if (typeof initScrollReveal === 'function') {
      setTimeout(initScrollReveal, 100);
    }
  }
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
