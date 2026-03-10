/* ============================================
   CAMLIQOUR STUDIOS — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // =========== CUSTOM CURSOR ===========
  const cursorDot  = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className  = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .port-item, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(2)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
      cursorRing.style.borderColor = 'rgba(201,168,76,.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.borderColor = 'rgba(201,168,76,.4)';
    });
  });

  // =========== SCROLL PROGRESS BAR ===========
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // =========== STICKY NAVBAR ===========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // =========== HAMBURGER MENU ===========
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // =========== SCROLL REVEAL ===========
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  // Force-reveal hero elements (already in view)
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 160);
  });

  // =========== ANIMATED COUNTERS ===========
  const counters = document.querySelectorAll('.counter-num');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObs.observe(c));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (el.closest('.counter-item').querySelector('span:last-child').textContent === 'Years' ? '' : '+');
    }
    requestAnimationFrame(step);
  }

  // =========== PORTFOLIO FILTERS ===========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portItems  = document.querySelectorAll('.port-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portItems.forEach(item => {
        const cat = item.dataset.cat;
        const show = filter === 'all' || cat === filter;
        item.style.transition = 'opacity .3s, transform .3s';

        if (show) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(.95)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(.95)';
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  });

  // =========== LIGHTBOX ===========
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbClose  = document.getElementById('lbClose');

  document.querySelectorAll('.port-open').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const src = btn.dataset.img;
      lbImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // =========== CONTACT FORM ===========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Sending... ⏳';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.innerHTML = `
          <div class="form-success">
            <div style="color:var(--gold);font-size:2.5rem;margin-bottom:1rem;">✦</div>
            <h3>Message Received!</h3>
            <p style="margin-top:.5rem">Thank you for reaching out. We'll be in touch within 24 hours to discuss your project.</p>
          </div>
        `;
      }, 1500);
    });
  }

  // =========== SMOOTH ANCHOR SCROLL ===========
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // =========== PARALLAX HERO ORBS ===========
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.1}px)`;
  }, { passive: true });

  // =========== HERO TITLE LETTER ANIMATION ===========
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.querySelectorAll('span').forEach((span, i) => {
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(40px)';
      span.style.transition = `opacity .9s cubic-bezier(.22,.8,.36,1) ${0.3 + i * 0.2}s, transform .9s cubic-bezier(.22,.8,.36,1) ${0.3 + i * 0.2}s`;
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 100);
    });
  }

  // =========== SERVICE CARD TILT ===========
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =========== ACTIVE NAV LINK (SCROLL SPY) ===========
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => spyObs.observe(s));

  // =========== WHATSAPP FLOAT VISIBILITY ===========
  const waFloat = document.getElementById('whatsappFloat');
  setTimeout(() => {
    if (waFloat) {
      waFloat.style.transition = 'all .4s';
      waFloat.style.opacity = '0';
      waFloat.style.transform = 'scale(0)';
      setTimeout(() => {
        waFloat.style.opacity = '1';
        waFloat.style.transform = 'scale(1)';
      }, 2000);
    }
  }, 0);

  // =========== PAGE LOAD ANIMATION ===========
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

});
