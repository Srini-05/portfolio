export function initUI() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    
    // 3D Card Tilt
    const tiltSelector = ['.project-card', '.hobby-card', '.skill-category', '.about-highlight', '.college-block', '.tl-card', '.edu-card', '.contact-link'].join(', ');
    document.querySelectorAll(tiltSelector).forEach(card => {
      if (isTouch) return;
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', e => {
        const r   = card.getBoundingClientRect();
        const x   = e.clientX - r.left;
        const y   = e.clientY - r.top;
        const cx  = r.width  / 2;
        const cy  = r.height / 2;
        const rotY =  ((x - cx) / cx) * 4;
        const rotX = -((y - cy) / cy) *  3;
        card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
        card.style.transition = 'box-shadow 0.08s, border-color 0.08s';
        card.style.boxShadow  = `${-rotY * 0.6}px ${rotX * 0.6}px 20px rgba(0,212,255,0.06)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s';
        card.style.boxShadow  = '';
      });
    });

    // Magnetic Buttons
    const magnetSelector = ['.btn-primary', '.btn-secondary', '.btn-outline', '.btn-submit', '.nav-cta', '.nav-links a'].join(', ');
    document.querySelectorAll(magnetSelector).forEach(btn => {
      if (isTouch) return;
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width  / 2)) * 0.3;
        const y = (e.clientY - (r.top  + r.height / 2)) * 0.3;
        btn.style.transform  = `translate(${x}px, ${y}px)`;
        btn.style.transition = 'transform 0.12s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      });
    });

    // Scroll Progress
    const prog = document.getElementById('scroll-progress');
    if (prog) {
        window.addEventListener('scroll', () => {
        const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
        prog.style.width = pct + '%';
        });
    }

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', scrollY > 50);
        });
    }

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    function highlightNav() {
      let activeSectionId = '';
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.45 && rect.bottom > 120) {
          activeSectionId = s.id;
        }
      });
      if (activeSectionId) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + activeSectionId);
        });
      }
    }
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // Hamburger
    const ham = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (ham && mobileNav) {
      ham.addEventListener('click', () => {
        const isExpanded = ham.getAttribute('aria-expanded') === 'true';
        ham.setAttribute('aria-expanded', !isExpanded);
        ham.classList.toggle('open');
        mobileNav.classList.toggle('open');
      });
      document.querySelectorAll('.mn-link').forEach(a => {
        a.addEventListener('click', () => {
          ham.setAttribute('aria-expanded', 'false');
          ham.classList.remove('open');
          mobileNav.classList.remove('open');
        });
      });
    }

    // Typing Effect
    const phrases = ['scalable backends.', 'responsive UIs.', 'microservices.', 'clean APIs.', 'cloud solutions.', 'full stack apps.', 'CI/CD pipelines.', 'React components.', 'Spring Boot services.', 'database solutions.', 'test-driven code.', 'enterprise systems.', 'GCP integrations.'];
    let pIdx = 0, cIdx = 0, deleting = false;
    const typedEl = document.getElementById('typed-text');
    function type() {
      if (!typedEl) return;
      const phrase = phrases[pIdx];
      if (!deleting) {
        cIdx++;
        typedEl.textContent = phrase.slice(0, cIdx);
        if (cIdx === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 65);
      } else {
        cIdx--;
        typedEl.textContent = phrase.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      }
    }
    setTimeout(type, 1200);

    // Scroll Reveal
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // Skill Bars
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
          barObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    const barContainer = document.getElementById('skillBarsContainer');
    if (barContainer) barObserver.observe(barContainer);

    // Smooth nav scroll offset
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // Dynamic Experience Updates
    const careerStartDate = new Date('2023-01-23'); // Total experience start
    const fullTimeStartDate = new Date('2023-07-17'); // Started Full-time @ Ford
    const now = new Date();

    // Calculate Total Experience (Dynamic)
    const diffTotal = Math.abs(now - careerStartDate);
    const totalYears = (diffTotal / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

    // Calculate Ford Pro Experience (Dynamic)
    const diffFord = Math.abs(now - fullTimeStartDate);
    const fordYears = (diffFord / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

    // Update total experience elements
    document.querySelectorAll('.dynamic-exp').forEach(el => {
      el.textContent = totalYears;
    });

    // Update Ford Pro specific experience elements
    document.querySelectorAll('.ford-pro-exp').forEach(el => {
      el.textContent = fordYears;
    });

    const metaTags = ['description', 'og:description', 'twitter:description'];
    metaTags.forEach(name => {
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (meta && meta.content) {
        meta.content = meta.content.replace(/[\d\.]+\+/, `${totalYears}+`);
      }
    });

    // Live Ticker Logic
    function updateTicker() {
      const careerStart = new Date('2023-01-23T00:00:00');
      const now = new Date();
      let diff = now - careerStart;

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      diff %= (1000 * 60 * 60 * 24 * 365.25);
      
      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
      diff %= (1000 * 60 * 60 * 24 * 30.44);
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff %= (1000 * 60 * 60 * 24);

      const yEl = document.getElementById('live-years');
      const mEl = document.getElementById('live-months');
      const dEl = document.getElementById('live-days');

      if (yEl) yEl.textContent = years;
      if (mEl) mEl.textContent = months;
      if (dEl) dEl.textContent = days;
    }
    updateTicker();
    setInterval(updateTicker, 60000);
}
