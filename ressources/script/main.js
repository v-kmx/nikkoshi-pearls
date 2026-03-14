/* ============================================
   NIKKOSHI PEARLS — Main JavaScript
   Handles: burger menu, hero slider, scroll
   animations, header shrink, temple page content
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initHeroSlider();
  initScrollReveal();
  initHeaderShrink();
  initSmoothScroll();
  initArticleSearch();
  initTempleContent();
  initItineraryTabs();
});

/* ===================== BURGER MENU ===================== */
function initBurgerMenu() {
  const btn = document.getElementById('burger-btn');
  const overlay = document.getElementById('overlay-menu');
  const scrim = document.getElementById('overlay-scrim');
  if (!btn || !overlay) return;

  function closeMenu() {
    btn.classList.remove('active');
    overlay.classList.remove('active');
    if (scrim) scrim.classList.remove('active');
  }

  function toggleMenu() {
    const isOpen = overlay.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      btn.classList.add('active');
      overlay.classList.add('active');
      if (scrim) scrim.classList.add('active');
    }
  }

  btn.addEventListener('click', toggleMenu);

  // Close menu when clicking the scrim (background)
  if (scrim) {
    scrim.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ===================== HERO SLIDER ===================== */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  const dotsContainer = document.getElementById('hero-dots');
  if (!slider || !dotsContainer) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = dotsContainer.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let currentSlide = 0;
  let interval;
  let isPaused = false;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startAutoPlay() {
    interval = setInterval(() => {
      if (!isPaused) nextSlide();
    }, 5000);
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide);
      goToSlide(slideIndex);
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => { isPaused = true; });
  slider.addEventListener('mouseleave', () => { isPaused = false; });

  startAutoPlay();
}

/* ===================== SCROLL REVEAL ===================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ===================== HEADER SHRINK ===================== */
function initHeaderShrink() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      header.classList.add('compact');
    } else {
      header.classList.remove('compact');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ===================== SMOOTH SCROLL ===================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ===================== ARTICLE SEARCH ===================== */
function initArticleSearch() {
  const input = document.getElementById('search-input');
  const articlesList = document.getElementById('articles-list');
  if (!input || !articlesList) return;

  const cards = articlesList.querySelectorAll('.article-list-card');

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/* ===================== TEMPLE PAGE CONTENT ===================== */
function initTempleContent() {
  const contentEl = document.getElementById('temple-content');
  if (!contentEl) return;

  const params = new URLSearchParams(window.location.search);
  const templeId = params.get('id');

  if (!templeId || !templeData[templeId]) {
    contentEl.innerHTML = `
      <div style="text-align: center; padding: 4rem 0;">
        <h2>Temple Not Found</h2>
        <p>The requested temple article could not be found.</p>
        <a href="articles.html" class="btn btn-outline" style="margin-top: 1.5rem;">Browse Articles</a>
      </div>
    `;
    return;
  }

  const temple = templeData[templeId];

  // Update page title and hero
  document.getElementById('page-title').textContent = `${temple.name} — Nikkoshi Pearls`;
  document.getElementById('temple-name').textContent = temple.name;
  document.getElementById('temple-subtitle').textContent = temple.subtitle;

  // Build article content
  let html = '';

  temple.sections.forEach(section => {
    html += `<h2 class="reveal">${section.title}</h2>`;
    section.paragraphs.forEach(p => {
      html += `<p class="reveal">${p}</p>`;
    });
    if (section.image) {
      html += `
        <div class="temple-article-img reveal-scale">
          <img src="ressources/static/img/placeholder_img.jpg" alt="${section.title}">
        </div>
      `;
    }
  });

  // Build timeline
  if (temple.timeline && temple.timeline.length > 0) {
    html += `<h2 class="reveal">Historical Timeline</h2>`;
    html += `<div class="timeline reveal">`;
    temple.timeline.forEach(item => {
      html += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">${item.year}</div>
          <p class="timeline-text">${item.text}</p>
        </div>
      `;
    });
    html += `</div>`;
  }

  contentEl.innerHTML = html;

  // Re-init scroll reveal for dynamically added elements
  setTimeout(initScrollReveal, 100);
}

/* ===================== TEMPLE DATA ===================== */
const templeData = {
  toshogu: {
    name: 'Nikko Tosho-gu Shrine',
    subtitle: 'The Lavish Mausoleum of Tokugawa Ieyasu',
    sections: [
      {
        title: 'A Monument to Power and Beauty',
        paragraphs: [
          'Nikko Tosho-gu is the most lavishly decorated shrine in Japan, built as the mausoleum of Tokugawa Ieyasu, the founder of the Tokugawa shogunate that ruled Japan for over 250 years. The shrine complex consists of more than a dozen buildings set among ancient cedar trees.',
          'Originally built in 1617, the shrine was enlarged and rebuilt in its present form in 1636 by Ieyasu\'s grandson, Tokugawa Iemitsu. Over 15,000 artisans were brought from across Japan to create the ornate carvings, gold leaf decorations, and vibrant paintings that adorn every surface.'
        ],
        image: true
      },
      {
        title: 'The Sacred Carvings',
        paragraphs: [
          'The shrine is renowned for its intricate wood carvings, numbering over 5,000 individual pieces. Among the most famous are the "Three Wise Monkeys" (see no evil, hear no evil, speak no evil) and the "Sleeping Cat" (Nemuri-neko), both of which carry deep philosophical meanings.',
          'The Yomeimon Gate, the shrine\'s most iconic structure, is covered with over 500 carvings of dragons, sages, flowers, and mythical creatures. It is sometimes called the "Twilight Gate" because visitors could gaze at it until sunset and still discover new details.'
        ],
        image: true
      },
      {
        title: 'Spiritual Significance',
        paragraphs: [
          'Tosho-gu enshrines Tokugawa Ieyasu as a deity under the name "Tosho Daigongen" — the Great Deity of the East Shining Light. The shrine represents the convergence of Shinto and Buddhist traditions, a harmony that characterized religious practice in Japan for centuries.',
          'Each year, the Grand Festival in spring recreates the procession that brought Ieyasu\'s remains to Nikko, with over 1,000 participants dressed in samurai armor marching through the cedar-lined avenues.'
        ]
      }
    ],
    timeline: [
      { year: '1542', text: 'Birth of Tokugawa Ieyasu in Okazaki, Mikawa Province.' },
      { year: '1600', text: 'Victory at the Battle of Sekigahara, establishing Tokugawa dominance.' },
      { year: '1603', text: 'Ieyasu becomes Shogun, founding the Tokugawa shogunate.' },
      { year: '1616', text: 'Death of Tokugawa Ieyasu. His remains are later moved to Nikko.' },
      { year: '1617', text: 'Original Tosho-gu shrine constructed in Nikko.' },
      { year: '1636', text: 'Grand reconstruction by Tokugawa Iemitsu, creating the shrine seen today.' },
      { year: '1999', text: 'Designated as a UNESCO World Heritage Site.' }
    ]
  },

  rinnoji: {
    name: 'Rinno-ji Temple',
    subtitle: 'Ancient Buddhist Temple of the Tendai Sect',
    sections: [
      {
        title: 'The Heart of Mountain Buddhism',
        paragraphs: [
          'Rinno-ji is the most important temple in the Nikko area and the headquarters of the Tendai sect in the Kanto region. Founded in 766 by the monk Shodo Shonin, it predates the Tosho-gu shrine by over 850 years.',
          'The temple\'s main hall, Sanbutsudo (Three Buddha Hall), is the largest wooden building in the Nikko area. It houses three gilded statues, each standing over 8 meters tall, representing Amida Buddha, Senju Kannon (Thousand-Armed Kannon), and Bato Kannon (Horse-Headed Kannon).'
        ],
        image: true
      },
      {
        title: 'Shoyo-en Garden',
        paragraphs: [
          'Adjacent to the temple is the Shoyo-en, a beautiful Japanese strolling garden created during the Edo period. The garden features a central pond surrounded by carefully arranged trees, stones, and traditional tea houses.',
          'The garden is particularly stunning during autumn when the maple trees transform the landscape into a tapestry of red, orange, and gold. It is considered one of the most beautiful gardens in the northern Kanto region.'
        ],
        image: true
      },
      {
        title: 'The Legacy of Shodo Shonin',
        paragraphs: [
          'Shodo Shonin, the monk who founded Rinno-ji, is revered as the pioneer who opened the sacred mountains of Nikko for religious practice. According to legend, he crossed the rapids of the Daiya River on the backs of two serpents — an event commemorated by the Shinkyo Sacred Bridge.',
          'His legacy established Nikko as one of Japan\'s most important centers of mountain worship, blending Shinto reverence for nature with Buddhist spiritual practices in a tradition known as Shugendo.'
        ]
      }
    ],
    timeline: [
      { year: '766', text: 'Shodo Shonin founds Rinno-ji, establishing Nikko as a sacred site.' },
      { year: '808', text: 'The temple receives patronage from Emperor Saga.' },
      { year: '1617', text: 'The temple becomes closely linked with the newly built Tosho-gu shrine.' },
      { year: '1636', text: 'Major expansion under Tokugawa Iemitsu\'s patronage.' },
      { year: '1653', text: 'Taiyuin Mausoleum added to the temple complex.' },
      { year: '1999', text: 'Designated as part of the UNESCO World Heritage Site.' }
    ]
  },

  futarasan: {
    name: 'Futarasan Shrine',
    subtitle: 'Guardian Shrine of the Sacred Mountains',
    sections: [
      {
        title: 'Protector of Nikko\'s Mountains',
        paragraphs: [
          'Futarasan Shrine is dedicated to the deities of Nikko\'s three most sacred mountains: Mount Nantai, Mount Nyoho, and Mount Taro. It is the oldest shrine in the Nikko area, founded by Shodo Shonin in 782.',
          'The shrine serves as the spiritual guardian of the natural landscape that makes Nikko so magical. Its main hall sits quietly among towering cedars, offering a more contemplative experience compared to the ornate Tosho-gu nearby.'
        ],
        image: true
      },
      {
        title: 'Three Shrines, One Spirit',
        paragraphs: [
          'Futarasan actually comprises three shrine sites: the main shrine (Honsha) near Tosho-gu, the Chugushi shrine on the shores of Lake Chuzenji, and the Okumiya summit shrine atop Mount Nantai at 2,486 meters.',
          'Together, these three shrines protect the entire mountain landscape that surrounds Nikko, from the valleys and waterfalls to the volcanic peaks. The annual mountain-opening festival in August draws thousands of pilgrims who climb Mount Nantai in a spiritual journey.'
        ],
        image: true
      },
      {
        title: 'Natural Wonders',
        paragraphs: [
          'The shrine\'s domain includes some of Nikko\'s most spectacular natural features: the Kegon Waterfall, one of Japan\'s three most beautiful falls at 97 meters high, and Lake Chuzenji, a volcanic lake formed by ancient eruptions of Mount Nantai.',
          'The surrounding forests of ancient cedar and cypress trees are themselves considered sacred, forming a natural cathedral that amplifies the spiritual atmosphere of the entire Nikko complex.'
        ]
      }
    ],
    timeline: [
      { year: '782', text: 'Shodo Shonin founds Futarasan Shrine at the foot of Mount Nantai.' },
      { year: '784', text: 'Shodo Shonin achieves the first recorded ascent of Mount Nantai.' },
      { year: '1619', text: 'The current main hall is constructed during the early Edo period.' },
      { year: '1636', text: 'Additional structures built as part of the Tosho-gu expansion.' },
      { year: '1999', text: 'Designated as part of the UNESCO World Heritage Site.' }
    ]
  },

  taiyuin: {
    name: 'Taiyuin Mausoleum',
    subtitle: 'The Refined Resting Place of the Third Shogun',
    sections: [
      {
        title: 'Elegance in Restraint',
        paragraphs: [
          'Taiyuin is the mausoleum of Tokugawa Iemitsu, the third Tokugawa shogun and grandson of Ieyasu. Built in 1653, it was intentionally designed to be less ornate than Tosho-gu out of respect for Iemitsu\'s grandfather.',
          'Despite this restraint, Taiyuin is still magnificently decorated with intricate carvings, gold leaf, and vibrant colors. Many visitors actually prefer it to Tosho-gu for its more harmonious balance of grandeur and subtlety.'
        ],
        image: true
      },
      {
        title: 'Ascending to the Divine',
        paragraphs: [
          'The mausoleum is arranged on a hillside with a series of gates, halls, and corridors that ascend toward Iemitsu\'s tomb. Each gate features unique guardian deities and architectural styles, creating a spiritual journey upward.',
          'The approach is designed so that each gate faces toward Tosho-gu, ensuring that Iemitsu eternally pays homage to his grandfather Ieyasu — a touching architectural gesture of filial devotion.'
        ]
      }
    ],
    timeline: [
      { year: '1604', text: 'Birth of Tokugawa Iemitsu, third son of the second shogun.' },
      { year: '1623', text: 'Iemitsu becomes the third Tokugawa shogun.' },
      { year: '1636', text: 'Iemitsu orders the grand reconstruction of Tosho-gu for his grandfather.' },
      { year: '1651', text: 'Death of Tokugawa Iemitsu.' },
      { year: '1653', text: 'Taiyuin mausoleum completed in Nikko.' },
      { year: '1999', text: 'Designated as part of the UNESCO World Heritage Site.' }
    ]
  },

  shinkyo: {
    name: 'Shinkyo Sacred Bridge',
    subtitle: 'The Symbolic Gateway to Sacred Nikko',
    sections: [
      {
        title: 'The Bridge of Legend',
        paragraphs: [
          'The vermillion Shinkyo bridge spans the Daiya River at the entrance to Nikko\'s sacred area. According to legend, when Shodo Shonin attempted to cross the river in 766, two serpents appeared and formed a bridge with their bodies, allowing him to pass.',
          'The current bridge, rebuilt in 1636, is one of Japan\'s three finest bridges. Its striking vermillion lacquer stands out against the deep green forests and dark river gorge, creating one of Nikko\'s most iconic and photographed scenes.'
        ],
        image: true
      },
      {
        title: 'A Living Symbol',
        paragraphs: [
          'For centuries, the Shinkyo bridge marked the boundary between the mundane world and the sacred realm of Nikko. Only the shogun and imperial messengers were allowed to cross it — ordinary visitors had to use a nearby wooden bridge.',
          'Today the bridge is open to all visitors, offering a moment to pause and reflect before entering the temple district. Walking across its arched span, with the rushing river below and ancient cedars above, one can feel the weight of centuries of spiritual significance.'
        ]
      }
    ],
    timeline: [
      { year: '766', text: 'Shodo Shonin crosses the Daiya River according to legend.' },
      { year: '1636', text: 'Current bridge constructed during the Tosho-gu expansion.' },
      { year: '1902', text: 'Bridge damaged by flooding and subsequently rebuilt.' },
      { year: '1999', text: 'Designated as part of the UNESCO World Heritage Site.' }
    ]
  },

  kanmangafuchi: {
    name: 'Kanmangafuchi Abyss',
    subtitle: 'The Mysterious Gorge of the Counting Statues',
    sections: [
      {
        title: 'Nature\'s Sanctuary',
        paragraphs: [
          'Kanmangafuchi is a stunningly beautiful gorge created by an ancient eruption of Mount Nantai. The Daiya River carved through the volcanic rock, creating a dramatic landscape of cliffs, rapids, and dense forest.',
          'A peaceful walking path follows the river through the gorge, offering a serene escape from the more crowded temple complex. The sound of rushing water and birdsong creates a natural meditation that has drawn visitors for centuries.'
        ],
        image: true
      },
      {
        title: 'The Bake Jizo — Ghost Statues',
        paragraphs: [
          'Along the path stand the famous Narabi Jizo — roughly 70 stone statues of the Buddhist deity Jizo, lined up along the riverbank. These moss-covered statues are known as the "Bake Jizo" or "Ghost Jizo" because, according to local legend, their number changes with each counting.',
          'The statues were placed here during the Edo period to comfort the souls of the deceased. Their weathered, moss-covered appearance and the mysterious forest setting create an atmosphere that is both peaceful and slightly eerie.'
        ]
      }
    ],
    timeline: [
      { year: 'Ancient', text: 'Eruption of Mount Nantai creates the gorge.' },
      { year: 'Edo Period', text: 'Jizo statues placed along the river path.' },
      { year: 'Modern', text: 'Becomes a popular walking destination for Nikko visitors.' }
    ]
  }
};

/* ===================== ITINERARY TABS ===================== */
function initItineraryTabs() {
  const tabs = document.querySelectorAll('.itinerary-tab');
  const panels = document.querySelectorAll('.itinerary-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const route = tab.dataset.route;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding panel
      panels.forEach(p => p.classList.remove('active'));
      const target = document.getElementById('route-' + route);
      if (target) target.classList.add('active');
    });
  });
}
