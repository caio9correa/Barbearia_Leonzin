// ---------- LOADER ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('done'), 500);
});

// ---------- BURGER MENU ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger.classList.remove('open');
}));

// ---------- SCROLL REVEAL ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- ANIMATED COUNTERS ----------
const counters = document.querySelectorAll('.counter');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterIO.observe(el));

// ---------- TESTIMONIAL CAROUSEL ----------
const slides = document.querySelectorAll('.depo-slide');
const dots = document.querySelectorAll('.depo-dot');
let depoIndex = 0;
let depoTimer;
function showDepo(i) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
  depoIndex = i;
}
function nextDepo() { showDepo((depoIndex + 1) % slides.length); }
function prevDepo() { showDepo((depoIndex - 1 + slides.length) % slides.length); }
function restartDepoTimer() {
  clearInterval(depoTimer);
  depoTimer = setInterval(nextDepo, 5000);
}
dots.forEach(d => d.addEventListener('click', () => { showDepo(parseInt(d.dataset.i)); restartDepoTimer(); }));
document.querySelector('.depo-next')?.addEventListener('click', () => { nextDepo(); restartDepoTimer(); });
document.querySelector('.depo-prev')?.addEventListener('click', () => { prevDepo(); restartDepoTimer(); });
restartDepoTimer();

// ---------- CONTACT FORM (static demo) ----------
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('formSuccess').style.display = 'block';
  this.reset();
});

// ---------- HEADER ON SCROLL + PROGRESS BAR + ACTIVE NAV ----------
const header = document.querySelector('header');
const progressBar = document.getElementById('progressBar');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link[data-target]');

function onScroll() {
  header.style.background = window.scrollY > 40 ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.75)';

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';

  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 140;
    if (scrollTop >= top) current = s.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active-link', a.dataset.target === current);
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

// ---------- CURSOR GLOW (desktop only) ----------
const cursorGlow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ---------- HERO POLE PARALLAX ----------
const poleBig = document.getElementById('poleBig');
const heroSection = document.querySelector('.hero');
if (poleBig && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    poleBig.style.transform = `rotate(${x * 6}deg) translateY(${y * 10}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    poleBig.style.transform = 'rotate(0deg) translateY(0)';
  });
}

// ---------- MAGNETIC BUTTONS ----------
document.querySelectorAll('.magnetic').forEach(btn => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

// ---------- SMOOTH ANCHOR OFFSET (fixed header) ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
