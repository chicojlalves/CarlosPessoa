/* ============================================
   HEADER — sticky scroll
   ============================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================
   MOBILE MENU
   ============================================ */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  const isOpen = nav.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate bars
  const bars = hamburger.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    bars[0].style.transform = '';
    bars[1].style.opacity   = '';
    bars[2].style.transform = '';
  }
});

// Close menu on nav link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    const bars = hamburger.querySelectorAll('span');
    bars[0].style.transform = '';
    bars[1].style.opacity   = '';
    bars[2].style.transform = '';
  });
});

/* ============================================
   PORTFOLIO — FILTER
   ============================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

/* ============================================
   LIGHTBOX
   ============================================ */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxPlaceh  = document.getElementById('lightboxPlaceholder');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

let currentIndex = 0;
let visibleItems  = [];

function getVisibleItems() {
  return [...portfolioItems].filter(el => !el.classList.contains('hidden'));
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentIndex = index;
  showItem(currentIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showItem(index) {
  const item  = visibleItems[index];
  const img   = item.querySelector('img');
  const title = item.dataset.title || '';
  const local = item.dataset.local || '';
  const icon  = item.querySelector('.portfolio-item__placeholder')?.firstChild?.textContent || '🏗';

  lightboxImg.style.display = 'none';
  lightboxPlaceh.classList.remove('show');

  if (img && img.naturalWidth > 0) {
    lightboxImg.src = img.src;
    lightboxImg.alt = title;
    lightboxImg.style.display = 'block';
  } else {
    lightboxPlaceh.textContent = icon;
    lightboxPlaceh.classList.add('show');
  }

  lightboxCaption.innerHTML = `<strong>${title}</strong>${local}`;
  lightboxPrev.style.visibility = index > 0 ? 'visible' : 'hidden';
  lightboxNext.style.visibility = index < visibleItems.length - 1 ? 'visible' : 'hidden';
}

// Open on item click
portfolioItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visible = getVisibleItems();
    const idx = visible.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
lightboxPrev.addEventListener('click', () => { if (currentIndex > 0) showItem(--currentIndex); });
lightboxNext.addEventListener('click', () => { if (currentIndex < visibleItems.length - 1) showItem(++currentIndex); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft'  && currentIndex > 0)                      showItem(--currentIndex);
  if (e.key === 'ArrowRight' && currentIndex < visibleItems.length - 1) showItem(++currentIndex);
});

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
const animateEls = document.querySelectorAll(
  '.service-card, .diff-card, .testimonial-card, .about__content, .about__image, .info-item, .portfolio-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

requestAnimationFrame(() => {
  animateEls.forEach(el => el.classList.add('fade-in'));

  /* Stagger cards */
  document.querySelectorAll('.services__grid .service-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
  });
  document.querySelectorAll('.diff__grid .diff-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
  });
  document.querySelectorAll('.testimonials__grid .testimonial-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });
  document.querySelectorAll('.portfolio__grid .portfolio-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 50}ms`;
  });

  animateEls.forEach(el => observer.observe(el));
});

/* ============================================
   SMOOTH SCROLL for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
