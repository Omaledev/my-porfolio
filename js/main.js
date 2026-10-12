/**
 * OMALE OMALE FAVOUR - PORTFOLIO INTERACTIVITY
 * High-performance Vanilla JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarCanvas();
  initCursorSpotlight();
  initTypewriter();
  initScrollEffects();
  initSectionSpy();
  initStatsCounter();
  initProjectFilters();
  initCopyButtons();
  initContactForm();
  initMobileNav();
  initBackToTop();
});

/* ==========================================================================
   1. STARFIELD / CONSTELLATION CANVAS
   ========================================================================== */
function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 50 : 95;
  const maxDistance = 115;
  let mouse = { x: null, y: null, radius: 100 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // Smooth, natural drift speed (moderate & fluid)
      const speed = Math.random() * 0.35 + 0.35;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      // Dainty, crisp pinpoint stars
      this.radius = Math.random() * 0.9 + 0.6;
      this.baseAlpha = Math.random() * 0.35 + 0.55;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.015;

      const rand = Math.random();
      if (rand < 0.5) {
        this.baseColor = 'rgba(255, 255, 255,'; // Pure white star
      } else if (rand < 0.85) {
        this.baseColor = 'rgba(192, 140, 255,'; // Lavender purple star
      } else {
        this.baseColor = 'rgba(56, 189, 248,'; // Cyan pinpoint
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.twinklePhase += this.twinkleSpeed;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Subtle mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const repelAngle = Math.atan2(dy, dx);
          const force = (1 - dist / mouse.radius) * 1.5;
          this.x -= Math.cos(repelAngle) * force;
          this.y -= Math.sin(repelAngle) * force;
        }
      }
    }

    draw() {
      const currentAlpha = Math.min(1, Math.max(0.25, this.baseAlpha + Math.sin(this.twinklePhase) * 0.25));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor} ${currentAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw delicate, fine connecting web
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(180, 125, 250, ${lineAlpha})`;
          ctx.lineWidth = 0.45;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. CURSOR SPOTLIGHT EFFECT
   ========================================================================== */
function initCursorSpotlight() {
  const spotlight = document.querySelector('.cursor-spotlight');
  if (!spotlight || window.innerWidth < 1024) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    spotlight.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const textEl = document.querySelector('.typewriter-text');
  if (!textEl) return;

  const phrases = [
    'Enterprise REST APIs & Backend Systems',
    'Full Stack Laravel, Livewire & React',
    'Automating Paystack & Monnify Webhooks',
    'Multi-Fleet Transit APIs & Software',
    'Mentoring 90+ Next-Gen Developers'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      textEl.textContent = currentPhrase.substring(0, charIdx);
      typingSpeed = 35;
    } else {
      charIdx++;
      textEl.textContent = currentPhrase.substring(0, charIdx);
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      // Pause at end of phrase
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. SCROLL EFFECTS (Progress Bar & Sticky Nav)
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

/* ==========================================================================
   5. SECTION SCROLL SPY (Side Dot Nav & Header Nav)
   ========================================================================== */
function initSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const dotLinks = document.querySelectorAll('.side-dot-nav a');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Update nav links
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update dot links
        dotLinks.forEach((dot) => {
          if (dot.getAttribute('href') === `#${id}`) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        // Update mobile links
        mobileLinks.forEach((mobLink) => {
          if (mobLink.getAttribute('href') === `#${id}`) {
            mobLink.classList.add('active');
          } else {
            mobLink.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   6. METRICS STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statSection = document.querySelector('.stats-section');
  if (!statSection) return;

  const statItems = [
    { el: document.getElementById('stat-exp'), target: 3, suffix: '+' },
    { el: document.getElementById('stat-projects'), target: 10, suffix: '+' },
    { el: document.getElementById('stat-students'), target: 90, suffix: '+' },
    { el: document.getElementById('stat-uptime'), target: 99.9, suffix: '%', isDecimal: true }
  ];

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;

      statItems.forEach((item) => {
        if (!item.el) return;

        let startTime = null;
        const duration = 2000;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easeOutQuad = 1 - (1 - progress) * (1 - progress);

          if (item.isDecimal) {
            const currentVal = (easeOutQuad * item.target).toFixed(1);
            item.el.textContent = `${currentVal}${item.suffix}`;
          } else {
            const currentVal = Math.floor(easeOutQuad * item.target);
            item.el.textContent = `${currentVal}${item.suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            item.el.textContent = `${item.target}${item.suffix}`;
          }
        }

        requestAnimationFrame(step);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(statSection);
}

/* ==========================================================================
   7. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   8. COPY TO CLIPBOARD WITH TOAST
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  const toast = document.querySelector('.toast-notification');
  const toastText = document.querySelector('.toast-text');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Copied to clipboard!';

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(label);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(label);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   9. INTERACTIVE CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name').value.trim();
    const email = form.querySelector('#form-email').value.trim();
    const message = form.querySelector('#form-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending message...
    `;
    submitBtn.disabled = true;

    // Simulate sending with realistic feedback
    setTimeout(() => {
      submitBtn.innerHTML = `✓ Message Sent Successfully!`;
      submitBtn.style.background = '#10b981';
      submitBtn.style.color = '#ffffff';

      const toast = document.querySelector('.toast-notification');
      const toastText = document.querySelector('.toast-text');
      if (toast && toastText) {
        toastText.textContent = `Thank you ${name}! Your message has been received.`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      }

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   10. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu(isOpen) {
    if (isOpen) {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  if (overlay) {
    overlay.addEventListener('click', () => toggleMenu(false));
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
