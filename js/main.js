/**
 * Sameen Gul Tribute Website
 * Core JavaScript Logic
 * Developed with premium interactive animations and design polish
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initCanvasEnvironment();
  initThemeManager();
  initTypewriter();
  initNavbarAndDrawer();
  initScrollReveals();
  initInteractiveGridAndCards();
  initGalleryLightbox();
  initQuoteCarousel();
  initMemoryWall();
  initSurpriseInteraction();
  initContactForm();
});

/* ==========================================
   1. Interactive Custom Cursor
   ========================================== */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const aura = document.getElementById('cursor-aura');
  if (!dot || !aura) return;

  let mouseX = -100;
  let mouseY = -100;
  let dotX = -100;
  let dotY = -100;
  let auraX = -100;
  let auraY = -100;

  // Follow mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate cursor using lerp (Linear Interpolation) for buttery smooth motion
  function animate() {
    // Lerp dot
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

    // Lerp trailing aura (slower speed = wider trailing distance)
    auraX += (mouseX - auraX) * 0.09;
    auraY += (mouseY - auraY) * 0.09;
    aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Hover states on interactive elements
  const interactives = document.querySelectorAll('.interactive-element, a, button, input, textarea, select, [role="button"]');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Magnetic button hover effect
  const magneticButtons = document.querySelectorAll('.btn-pill');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Translate the button slightly in direction of cursor
      btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
    
    // Simple ripple wave effect on click
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================
   2. Canvas Environment (Fireflies, Petals, Confetti)
   ========================================== */
let globalExplodeSurprise = null; // callback handle for launching confetti

function initCanvasEnvironment() {
  const canvas = document.getElementById('env-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particles config
  const fireflies = [];
  const petals = [];
  let confetti = [];
  
  const fireflyCount = 15;
  const petalCount = 8;

  // Theme-aware particle colors
  function isDarkTheme() {
    return document.documentElement.classList.contains('dark');
  }

  // Helper to generate floating fireflies
  class Firefly {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // scatter vertically initially
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.radius = Math.random() * 2 + 1.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = -(Math.random() * 0.4 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.2;
      this.alphaDir = Math.random() > 0.5 ? 0.01 : -0.01;
      this.glow = Math.random() * 6 + 4;
      this.hue = Math.random() > 0.5 ? 330 : 270; // pinks and purples
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // alpha breathing
      this.alpha += this.alphaDir;
      if (this.alpha > 0.8 || this.alpha < 0.2) {
        this.alphaDir = -this.alphaDir;
      }

      // boundary check
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = this.glow;
      // Adjust glowing color depending on theme
      const colorString = isDarkTheme() 
        ? `hsla(${this.hue}, 90%, 75%, ${this.alpha})`
        : `hsla(${this.hue}, 85%, 65%, ${this.alpha})`;
      
      ctx.shadowColor = colorString;
      ctx.fillStyle = colorString;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Helper to generate falling sakura petals
  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // scatter vertically initially
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.8 + 0.6;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.angle = Math.random() * Math.PI;
      this.spin = Math.random() * 0.02 - 0.01;
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationIndex = Math.random() * 100;
      this.alpha = Math.random() * 0.4 + 0.5;
    }

    update() {
      this.y += this.speedY;
      this.oscillationIndex += this.oscillationSpeed;
      this.x += this.speedX + Math.sin(this.oscillationIndex) * 0.5;
      this.angle += this.spin;

      if (this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      
      // Delicate rose/blush petal style
      ctx.fillStyle = isDarkTheme() ? '#FF6B81' : '#FF8FA3';
      
      ctx.beginPath();
      // Draw an organic petal path
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, -this.size / 3, this.size / 2, this.size / 2);
      ctx.bezierCurveTo(0, this.size / 2, -this.size / 2, this.size / 4, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  // Surprise Confetti Blast Particles
  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 6;
      
      // Radial explosion velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2; // slight bias upwards
      
      this.gravity = 0.12;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
      this.spin = Math.random() * 0.3 - 0.15;
      this.angle = Math.random() * Math.PI * 2;
      
      // Lush palette selection
      const colors = ['#FF4F87', '#FF6B81', '#B57CFF', '#67D5FF', '#6DECB9', '#FFE2D1'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.vy += this.gravity;
      this.y += this.vy;
      this.angle += this.spin;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  // Instantiate particles
  for (let i = 0; i < fireflyCount; i++) {
    fireflies.push(new Firefly());
  }
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  // Surprise action hook
  globalExplodeSurprise = () => {
    // Spawn 100 confetti pieces in a radial spray from the middle screen
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 90; i++) {
      confetti.push(new Confetti(centerX, centerY));
    }
    
    // Create an extra surge of falling petals
    for (let i = 0; i < 15; i++) {
      const p = new Petal();
      p.y = -Math.random() * 200; // start high up
      p.speedY = Math.random() * 1.5 + 1.2; // fall faster
      petals.push(p);
    }
    
    // Cap petals array to avoid leaks
    setTimeout(() => {
      if (petals.length > petalCount) {
        petals.splice(petalCount);
      }
    }, 8000);
  };

  // Main Loop
  function tick() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw fireflies
    fireflies.forEach((ff) => {
      ff.update();
      ff.draw();
    });

    // Update & draw petals
    petals.forEach((p) => {
      p.update();
      p.draw();
    });

    // Update, filter & draw confetti
    confetti = confetti.filter((c) => c.alpha > 0);
    confetti.forEach((c) => {
      c.update();
      c.draw();
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ==========================================
   3. Theme Manager (Light / Dark)
   ========================================== */
function initThemeManager() {
  const themeBtn = document.getElementById('theme-btn');
  const loadingScreen = document.getElementById('loading-screen');
  if (!themeBtn) return;

  // Retrieve saved theme or default to system preference
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Remove Loader once document fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      // Slide navbar down
      document.getElementById('navbar').classList.add('visible');
    }, 1200);
  });

  // Toggle Action
  themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const currentlyDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
  });
}

/* ==========================================
   4. Typing Effect (Hero Header)
   ========================================== */
function initTypewriter() {
  const textElem = document.getElementById('typewriter-pre');
  if (!textElem) return;

  const phrase = "Hello, Sameen 🌸";
  let index = 0;

  // Add blinker cursor wrapper
  const textSpan = document.createElement('span');
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  cursorSpan.textContent = '|';
  textElem.appendChild(textSpan);
  textElem.appendChild(cursorSpan);

  function type() {
    if (index < phrase.length) {
      textSpan.textContent += phrase.charAt(index);
      index++;
      setTimeout(type, 130 + Math.random() * 50); // organic typing speed
    } else {
      // Keep cursor blinking but stop typing
      setTimeout(() => {
        cursorSpan.style.display = 'none';
      }, 5000);
    }
  }

  // Delay typing slightly for loading screen transition
  setTimeout(type, 1800);
}

/* ==========================================
   5. Sticky Navigation & Responsive Drawer
   ========================================== */
function initNavbarAndDrawer() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Watch Scroll to trigger frosted-glass header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Drawer toggles
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !expanded);
      mobileToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close menu drawer upon link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }
}

/* ==========================================
   6. Scroll Reveals (IntersectionObserver)
   ========================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // triggers when 12% is visible
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to keep DOM light after animating
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}

/* ==========================================
   7. Flip Cards Compliments System
   ========================================== */
function initInteractiveGridAndCards() {
  const flipCards = document.querySelectorAll('.flip-card');
  
  // Complimentary remarks for Sameen
  const compliments = [
    "Your presence brings a soft, peaceful warmth wherever you are.",
    "You possess a brilliant mind and illuminate the world with your wisdom.",
    "You carry yourself with a beautiful grace that inspires everyone.",
    "Your creativity is a beautiful spark that brightens up standard days.",
    "You radiate positivity and encourage the best in everyone.",
    "Your deep compassion is a soothing comfort to all who talk to you.",
    "You bring order and serenity to any turbulent moment.",
    "You are a gorgeous harmony of inner goodness and grace."
  ];

  flipCards.forEach((card, idx) => {
    // Populate card text dynamically
    const compTextElem = card.querySelector('.compliment-text');
    if (compTextElem) {
      compTextElem.textContent = compliments[idx % compliments.length];
    }

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    
    // Supports hover toggle for desktop
    card.addEventListener('mouseenter', () => {
      card.classList.add('flipped');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('flipped');
    });
  });
}

/* ==========================================
   8. Memory Gallery & Lightbox Viewer
   ========================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImgHolder = document.getElementById('lightbox-img-holder');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (!lightbox || !lightboxClose || !lightboxImgHolder) return;

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const caption = item.getAttribute('data-caption');
      const meshClass = item.getAttribute('data-mesh');

      // Clear existing mesh configurations
      lightboxImgHolder.className = 'lightbox-img-placeholder';
      // Load current mesh styling class
      lightboxImgHolder.classList.add(meshClass);
      
      lightboxCaption.textContent = caption || '';
      
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  lightboxClose.addEventListener('click', closeLightbox);

  // Close lightbox if clicking overlay backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Support ESC keyboard exit
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================
   9. Auto-Rotating Quotes Carousel
   ========================================== */
function initQuoteCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (slides.length === 0) return;

  let currentIdx = 0;
  let timer = null;

  function setSlide(targetIdx) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[targetIdx].classList.add('active');
    dots[targetIdx].classList.add('active');
    currentIdx = targetIdx;
  }

  function nextSlide() {
    let next = (currentIdx + 1) % slides.length;
    setSlide(next);
  }

  // Interval rotation (every 6 seconds)
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 6000);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIdx = parseInt(dot.getAttribute('data-slide'));
      setSlide(slideIdx);
      startTimer(); // reset rotation schedule
    });
  });

  startTimer();
}

/* ==========================================
   10. Memory Wall (LocalStorage Database)
   ========================================== */
function initMemoryWall() {
  const form = document.getElementById('note-form');
  const input = document.getElementById('note-input');
  const pinboard = document.getElementById('pinboard');
  
  if (!form || !input || !pinboard) return;

  // Retrieve saved notes
  let notes = [];
  try {
    const saved = localStorage.getItem('sameen_tribute_notes');
    if (saved) {
      notes = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Localstorage read failed", e);
  }

  // Helper to append a single post-it note
  function createNoteElement(content, date, index) {
    const note = document.createElement('div');
    note.className = 'pinboard-note glass-panel interactive-element';
    
    // Assign a slight, unique tilt rotation
    const rotation = (index % 2 === 0 ? 1 : -1) * (1.5 + (index % 3));
    note.style.setProperty('--rotation', `${rotation}deg`);

    const noteText = document.createElement('p');
    noteText.className = 'pinboard-note-text';
    noteText.textContent = content;

    const noteDate = document.createElement('div');
    noteDate.className = 'pinboard-note-date';
    noteDate.textContent = date;

    note.appendChild(noteText);
    note.appendChild(noteDate);

    // Dynamic hover bindings for new dynamic elements
    note.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    note.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });

    return note;
  }

  // Render initial list
  function renderNotes() {
    pinboard.innerHTML = '';
    notes.forEach((item, idx) => {
      const noteEl = createNoteElement(item.text, item.date, idx);
      pinboard.appendChild(noteEl);
    });
  }

  // Pre-load default memory wall messages if localstorage is empty
  const defaultNotes = [
    { text: "Your smile makes even the greyest days feel bright and full of hope. Thank you for being in our lives!", date: "Jun 20, 2026" },
    { text: "I've always admired your patience. You listen so deeply and speak with such clear understanding. Truly beautiful.", date: "Jun 21, 2026" },
    { text: "You radiate goodness. Every task you work on gets touched by your magic creativity.", date: "Jun 22, 2026" }
  ];

  if (notes.length === 0) {
    notes = defaultNotes;
    localStorage.setItem('sameen_tribute_notes', JSON.stringify(notes));
  }
  
  renderNotes();

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;

    const optDate = new Date();
    const formattedDate = optDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newNote = { text: txt, date: formattedDate };
    notes.push(newNote);
    
    try {
      localStorage.setItem('sameen_tribute_notes', JSON.stringify(notes));
    } catch (err) {
      console.error("Localstorage write failed", err);
    }

    // Append and clear input
    renderNotes();
    input.value = '';

    // Scroll to the bottom of notes wall
    setTimeout(() => {
      pinboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  });
}

/* ==========================================
   11. Surprise Modal & Explosions
   ========================================== */
function initSurpriseInteraction() {
  const trigger = document.getElementById('surprise-trigger');
  const modal = document.getElementById('surprise-modal');
  const close = document.getElementById('modal-close');

  if (!trigger || !modal || !close) return;

  trigger.addEventListener('click', () => {
    // Launch flower confetti blast
    if (globalExplodeSurprise) {
      globalExplodeSurprise();
    }

    // Open Modal
    setTimeout(() => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }, 300);
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  close.addEventListener('click', closeModal);

  // Close modal on escape or background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================
   12. Contact Form & Scroll To Top
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const scrollTop = document.getElementById('scroll-top-btn');

  // Form mock submission spinner
  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Toggle loading spinner
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate network request delay (EmailJS integration ready)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show simulated success toast
        alert("Thank you! Your heartfelt message has been sent to Sameen Gul 🌸");
        form.reset();
      }, 1500);
    });
  }

  // Scroll to Top action
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    });

    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
