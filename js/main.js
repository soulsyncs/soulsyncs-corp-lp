/* ============================================
   SOULSYNCS — JavaScript
   "Humanity in Logic"
   ============================================ */

'use strict';

// ---- Utility ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// ============================================
// LOADER
// ============================================
const initLoader = () => {
  const loader = $('#loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // ロード後にヒーローのアニメーション開始
      triggerHeroAnimations();
    }, 1800);
  });

  // フォールバック
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    triggerHeroAnimations();
  }, 3000);
};

// ============================================
// CUSTOM CURSOR
// ============================================
const initCursor = () => {
  const dot = $('#cursorDot');
  const outline = $('#cursorOutline');
  if (!dot || !outline) return;

  // pointer: coarse (タッチデバイス) は非表示
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let outX = 0, outY = 0;
  let animFrame;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  const animateCursor = () => {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    animFrame = requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // ホバー時の拡張
  const hoverTargets = 'a, button, .value-card, .service-card, .case-card, .recruit-card, .step-content';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      outline.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      outline.classList.remove('hovered');
    }
  });
};

// ============================================
// NAVIGATION
// ============================================
const initNav = () => {
  const nav = $('#mainNav');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-link');
  if (!nav) return;

  // スクロールで背景変化
  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ハンバーガーメニュー
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ナビリンクのアクティブ状態
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.5) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
};

// ============================================
// FLOATING CTA
// ============================================
const initFloatingCta = () => {
  const cta = $('#floatingCta');
  if (!cta) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  }, { passive: true });
};

// ============================================
// SCROLL REVEAL
// ============================================
const initScrollReveal = () => {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0) * 1000;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
};

// ============================================
// HERO ANIMATIONS
// ============================================
const triggerHeroAnimations = () => {
  const heroElements = $$('.hero .reveal-up, .hero .reveal-left, .hero .reveal-right');
  heroElements.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0) * 1000;
    setTimeout(() => {
      el.classList.add('visible');
    }, delay + 200);
  });
};

// ============================================
// HERO PARTICLES (Canvas)
// ============================================
const initHeroParticles = () => {
  const canvas = $('#heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let animId;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = this.opacity * (1 - progress * 0.5);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(222, 63, 44, ${alpha})`;
      ctx.fill();
    }
  }

  const createParticles = () => {
    particles = [];
    const count = Math.min(80, Math.floor(W * H / 8000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // 近い粒子同士を線でつなぐ
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(222, 63, 44, ${0.06 * (1 - dist/80)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  };

  resize();
  createParticles();
  animate();

  const resizeObserver = new ResizeObserver(() => {
    resize();
    createParticles();
  });
  resizeObserver.observe(canvas);
};

// ============================================
// COUNTER ANIMATIONS
// ============================================
const initCounters = () => {
  const counterEls = $$('[data-target]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      if (isNaN(target)) return;

      const duration = 1800;
      const start = performance.now();
      const isDecimal = String(target).includes('.');
      const isStars = el.dataset.target === '0' && el.textContent.trim() === '∞';
      if (isStars) return;

      const easeOut = t => 1 - Math.pow(1 - t, 3);

      const update = (now) => {
        const elapsed = now - start;
        const progress = clamp(elapsed / duration, 0, 1);
        const value = target * easeOut(progress);
        el.textContent = isDecimal
          ? value.toFixed(1)
          : Math.round(value).toString();

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
      };

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
};

// ============================================
// STAT BAR ANIMATIONS
// ============================================
const initStatBars = () => {
  const bars = $$('.stat-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const width = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
};

// ============================================
// CRYSTAL JOURNEY — SCROLL PROGRESS
// ============================================
const initJourneyProgress = () => {
  const progressFill = $('#progressFill');
  const journey = $('.crystal-journey');
  if (!progressFill || !journey) return;

  const updateProgress = () => {
    const rect = journey.getBoundingClientRect();
    const windowH = window.innerHeight;
    const total = rect.height - windowH;
    const scrolled = -rect.top;
    const progress = clamp(scrolled / total, 0, 1) * 100;
    progressFill.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
};

// ============================================
// CEO SIGNATURE ANIMATION
// ============================================
const initSignature = () => {
  const sigPath = $('.signature-path');
  if (!sigPath) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sigPath.classList.add('drawn');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(sigPath);
};

// ============================================
// CONTACT FORM
// ============================================
const initContactForm = () => {
  const form = $('#contactForm');
  if (!form) return;

  const submitBtn = $('#submitBtn');
  const successMsg = $('#formSuccess');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const btnArrow = submitBtn?.querySelector('.btn-arrow');

  // フォームのフォーカスエフェクト
  $$('.input-wrap input, .input-wrap textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  // 送信処理
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ローディング状態
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';
    if (btnArrow) btnArrow.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;

    // フォームデータ収集
    const data = {
      company: form.company.value,
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      topics: [...form.querySelectorAll('[name="topic"]:checked')].map(c => c.value)
    };

    // API送信
    try {
      await fetch('tables/contact_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      // エラーでも UI は成功にする（デモ用）
      console.warn('API送信エラー（デモモードで続行）:', err);
    }

    // 成功表示
    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'flex';
    }, 800);
  });
};

// ============================================
// PARALLAX EFFECT (ヒーロー背景)
// ============================================
const initParallax = () => {
  const geos = $$('.hero-geo');
  if (!geos.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
    if (scrollY > heroH) return;

    const progress = scrollY / heroH;

    geos[0]?.style.setProperty('transform', `translate(${progress * 30}px, ${-progress * 60}px)`);
    geos[1]?.style.setProperty('transform', `translate(${-progress * 20}px, ${progress * 40}px)`);
    geos[2]?.style.setProperty('transform', `translate(${progress * 15}px, ${-progress * 25}px)`);
  }, { passive: true });
};

// ============================================
// HEADLINE STAGGER ANIMATION
// ============================================
const initHeadlineStagger = () => {
  const masks = $$('.headline-mask');
  masks.forEach((mask, i) => {
    mask.style.transform = 'translateY(100%)';
    mask.style.display = 'inline-block';
    mask.style.transition = `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12 + 0.3}s`;
  });
};

const triggerHeadlineStagger = () => {
  const masks = $$('.headline-mask');
  masks.forEach(mask => {
    mask.style.transform = 'translateY(0)';
  });
};

// ============================================
// SMOOTH ANCHOR SCROLL
// ============================================
const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
};

// ============================================
// HOVER TILT EFFECT (カード)
// ============================================
const initCardTilt = () => {
  const cards = $$('.service-card, .case-card, .value-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * -8;
      const tiltY = x * 8;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

// ============================================
// NUMBER SCRAMBLE EFFECT
// ============================================
const scrambleNumber = (el, target) => {
  const chars = '0123456789';
  const duration = 1200;
  const start = performance.now();
  const isFloat = String(target).includes('.');

  const update = (now) => {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    if (progress < 0.7) {
      // スクランブルフェーズ
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
    } else {
      // 実際の数値に近づく
      const value = target * ((progress - 0.7) / 0.3);
      el.textContent = isFloat ? Math.min(value, target).toFixed(1) : Math.round(Math.min(value, target));
    }

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  };

  requestAnimationFrame(update);
};

// ============================================
// SECTION LABEL NUMBER REVEAL
// ============================================
const initSectionLabels = () => {
  const labels = $$('.label-num');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  labels.forEach(label => {
    label.style.opacity = '0';
    label.style.transition = 'opacity 0.8s ease';
    observer.observe(label);
  });
};

// ============================================
// HERO TEXT GLITCH EFFECT (サブタイトル)
// ============================================
const initGlitchEffect = () => {
  const headline = $('.hero-headline');
  if (!headline) return;

  setInterval(() => {
    if (Math.random() > 0.9) {
      headline.style.textShadow = '2px 0 #DE3F2C, -2px 0 rgba(232,96,79,0.4)';
      setTimeout(() => {
        headline.style.textShadow = '';
      }, 100);
    }
  }, 3000);
};

// ============================================
// MAGNETIC BUTTONS
// ============================================
const initMagneticButtons = () => {
  const buttons = $$('.btn-primary, .btn-ghost, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
};

// ============================================
// JOURNEY STEPS — SCROLL-TRIGGERED HIGHLIGHT
// ============================================
const initJourneySteps = () => {
  const steps = $$('.journey-step');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const stepNum = parseInt(entry.target.dataset.step);
        // 進捗バーを更新
        const progress = (stepNum / 4) * 100;
        const fill = $('#progressFill');
        if (fill) fill.style.width = progress + '%';
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '0px 0px -100px 0px'
  });

  steps.forEach(step => observer.observe(step));
};

// ============================================
// TABLE SCHEMA SETUP
// ============================================
const initTableSchema = async () => {
  try {
    // お問い合わせテーブル（スキーマが未作成の場合は fetch が gracefully fallback）
    await fetch('tables/contact_requests', { method: 'GET' });
  } catch (e) {
    // スキーマ未作成でも問題なし
  }
};

// ============================================
// HERO TYPING EFFECT (eyebrow text)
// ============================================
const initTypingEffect = () => {
  const el = $('.eyebrow-text');
  if (!el) return;
  
  const text = el.textContent;
  el.textContent = '';
  el.style.opacity = '1';
  
  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 80);
    }
  };
  
  setTimeout(type, 2200); // ローダー後
};

// ============================================
// SCROLL PROGRESS BAR (ページトップ)
// ============================================
const initPageProgress = () => {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #C43525, #E8604F);
    z-index: 2000;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = clamp(progress, 0, 100) + '%';
  }, { passive: true });
};

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initFloatingCta();
  initSmoothScroll();
  initHeadlineStagger();
  initHeroParticles();
  initScrollReveal();
  initCounters();
  initStatBars();
  initJourneyProgress();
  initJourneySteps();
  initSignature();
  initContactForm();
  initParallax();
  initCardTilt();
  initSectionLabels();
  initGlitchEffect();
  initMagneticButtons();
  initTypingEffect();
  initPageProgress();
  initTableSchema();
});

// ローダー後のヘッドライン演出
window.addEventListener('load', () => {
  setTimeout(() => {
    triggerHeadlineStagger();
  }, 2000);
});

// ============================================
// YOUTUBE MOVIE PLAYER
// ============================================
function openYoutube() {
  const thumbnail = document.getElementById('movieThumbnail');
  const iframeWrap = document.getElementById('movieIframe');
  if (!thumbnail || !iframeWrap) return;
  thumbnail.style.display = 'none';
  iframeWrap.style.display = 'block';
}
