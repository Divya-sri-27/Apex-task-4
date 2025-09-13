/* main.js - interactions for unified site
   - typing effect
   - skills animation
   - projects modal
   - nav active highlight & smooth scroll
   - theme toggle (localStorage)
   - contact form save
*/

document.addEventListener('DOMContentLoaded', () => {
  /* Typing effect in hero */
  const typing = document.getElementById('typing');
  const phrases = ['Frontend Developer', 'JavaScript Enthusiast', 'UI/UX Lover', 'Accessibility Advocate'];
  let tIdx = 0, cIdx = 0, forward = true;
  function type() {
    const full = phrases[tIdx];
    if (forward) {
      cIdx++;
      if (cIdx > full.length) { forward = false; setTimeout(type, 1000); return; }
    } else {
      cIdx--;
      if (cIdx < 0) { forward = true; tIdx = (tIdx + 1) % phrases.length; }
    }
    typing.textContent = full.slice(0, cIdx);
    setTimeout(type, forward ? 80 : 40);
  }
  type();

  /* Skills progress animation */
  document.querySelectorAll('.bar').forEach(b => {
    const v = b.dataset.value || 50;
    setTimeout(() => b.style.width = v + '%', 500);
  });

  /* Projects data - inject cards */
  const projects = [
    { id: 1, title: 'Interactive Portfolio', desc: 'Portfolio with typing, modal details, theme toggle and contact form.', img: 'assets/images/p1.svg', tags: ['portfolio','js','css'] },
    { id: 2, title: 'To-Do App', desc: 'A to-do application with localStorage persistence and edit/delete.', img: 'assets/images/p2.svg', tags: ['app','localStorage'] },
    { id: 3, title: 'Product Listing', desc: 'Filter and sort products UI demo.', img: 'assets/images/p3.svg', tags: ['ui','ecommerce'] }
  ];

  const grid = document.getElementById('projectsGrid');
  projects.forEach(p => {
    const el = document.createElement('div');
    el.className = 'project-card card';
    el.tabIndex = 0;
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="project-overlay">${p.title}</div>
    `;
    el.addEventListener('click', () => openModal(`<h3>${p.title}</h3><p>${p.desc}</p><p class="small">Tags: ${p.tags.join(', ')}</p>`));
    grid.appendChild(el);
  });

  /* Modal logic */
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  function openModal(html) {
    modalBody.innerHTML = html;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* Nav active on scroll and smooth scroll behavior */
  const navLinks = document.querySelectorAll('.nav-link');
  function onScroll() {
    const fromTop = window.scrollY + 140;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const section = document.querySelector(href);
      if (!section) return;
      if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll);

  document.querySelectorAll('.nav a').forEach(a => {
    // Smooth scroll for same-page anchors
    if (a.getAttribute('href').startsWith('#')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  /* Theme toggle */
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light';
  }
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = 'Dark';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = 'Light';
      localStorage.setItem('theme', 'dark');
    }
  });

  /* Contact form: save locally (fallback) */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const saveBtn = document.getElementById('saveMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !subject || !message) {
      formMsg.textContent = 'Please fill all fields.';
      return;
    }
    const messages = JSON.parse(localStorage.getItem('messages_v1') || '[]');
    messages.push({ name, email, subject, message, created: Date.now() });
    localStorage.setItem('messages_v1', JSON.stringify(messages));
    formMsg.textContent = 'Message saved locally. (No backend in demo)';
    form.reset();
  });
  saveBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !subject || !message) { formMsg.textContent = 'Please fill all fields to save.'; return; }
    const messages = JSON.parse(localStorage.getItem('messages_v1') || '[]');
    messages.push({ name, email, subject, message, created: Date.now() });
    localStorage.setItem('messages_v1', JSON.stringify(messages));
    formMsg.textContent = 'Saved locally.';
    form.reset();
  });

  /* Initial reveal animation for cards using IntersectionObserver */
  const cards = document.querySelectorAll('.card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.style.transform = 'translateY(0)';
        ent.target.style.opacity = 1;
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(c => { c.style.transform = 'translateY(12px)'; c.style.opacity = 0; obs.observe(c); });
});
