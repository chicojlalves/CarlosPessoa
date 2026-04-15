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
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
const animateEls = document.querySelectorAll(
  '.service-card, .diff-card, .testimonial-card, .about__content, .about__image, .info-item'
);

animateEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => observer.observe(el));

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
