// Glowing S Background Animation
function initGlowingS() {
  const glowingS = document.getElementById('glowing-s');
  const sLetter = glowingS?.querySelector('.s-letter');
  if (!glowingS || !sLetter) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let isScrolled = false;

  // Initial position - center of screen
  function updatePosition() {
    if (!isScrolled) {
      // Smooth follow cursor
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (currentX - centerX) * 0.3;
      const offsetY = (currentY - centerY) * 0.3;
      
      sLetter.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    requestAnimationFrame(updatePosition);
  }

  // Mouse move - follow cursor
  document.addEventListener('mousemove', (e) => {
    if (!isScrolled) {
      targetX = e.clientX;
      targetY = e.clientY;
    }
  });

  // Scroll - zoom out and move to navbar with smooth animation
  let scrollY = 0;
  let targetScrollState = false;
  let currentScrollState = false;
  let navLogo = null;
  let navX = 0;
  let navY = 0;
  
  function updateScrollAnimation() {
    const scrollThreshold = 100;
    targetScrollState = scrollY > scrollThreshold;
    
    if (targetScrollState !== currentScrollState) {
      currentScrollState = targetScrollState;
      isScrolled = targetScrollState;
      
      if (targetScrollState) {
        glowingS.classList.add('scrolled');
        // Get navbar logo position
        navLogo = document.querySelector('.logo-3d');
        if (navLogo) {
          const rect = navLogo.getBoundingClientRect();
          navX = rect.left + rect.width / 2;
          navY = rect.top + rect.height / 2;
        }
      } else {
        glowingS.classList.remove('scrolled');
        navX = window.innerWidth / 2;
        navY = window.innerHeight / 2;
        targetX = window.innerWidth / 2;
        targetY = window.innerHeight / 2;
      }
    }
    
    // Smooth interpolation for position
    if (isScrolled && navLogo) {
      const rect = navLogo.getBoundingClientRect();
      const targetNavX = rect.left + rect.width / 2;
      const targetNavY = rect.top + rect.height / 2;
      
      navX += (targetNavX - navX) * 0.1;
      navY += (targetNavY - navY) * 0.1;
      
      glowingS.style.left = `${navX - 30}px`;
      glowingS.style.top = `${navY - 30}px`;
    } else if (!isScrolled) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      navX += (centerX - navX) * 0.1;
      navY += (centerY - navY) * 0.1;
      
      if (Math.abs(navX - centerX) < 1 && Math.abs(navY - centerY) < 1) {
        glowingS.style.left = '';
        glowingS.style.top = '';
      }
    }
    
    requestAnimationFrame(updateScrollAnimation);
  }
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });
  
  updateScrollAnimation();

  updatePosition();
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const html = document.documentElement;

  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme === 'dark');

  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme === 'dark');
  });

  function updateThemeIcons(isDark) {
    if (isDark) {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    } else {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    }
  }
}

// Mobile Menu
function setMobile(open) {
  const menu = document.getElementById('mobileMenu');
  const panel = document.getElementById('mobilePanel');
  const backdrop = document.getElementById('mobileBackdrop');
  
  if (!menu || !panel || !backdrop) return;
  
  menu.setAttribute('aria-hidden', String(!open));
  
  if (open) {
    panel.style.transform = 'translateX(0)';
    backdrop.style.opacity = '1';
    backdrop.style.pointerEvents = 'auto';
    document.documentElement.style.overflow = 'hidden';
  } else {
    panel.style.transform = 'translateX(-110%)';
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    document.documentElement.style.overflow = '';
  }
}

function setupMobileMenu() {
  const openBtn = document.getElementById('hamburger');
  const closeBtn = document.getElementById('closeMobile');
  const backdrop = document.getElementById('mobileBackdrop');
  
  openBtn?.addEventListener('click', () => setMobile(true));
  closeBtn?.addEventListener('click', () => setMobile(false));
  backdrop?.addEventListener('click', () => setMobile(false));
  
  document.querySelectorAll('[data-close]').forEach(a => {
    a.addEventListener('click', () => setMobile(false));
  });
}

// Scroll reveal animations
function initAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.will-reveal').forEach(el => {
    obs.observe(el);
  });
}

// Parallax effect for hero card
function initHeroParallax() {
  const heroCard = document.querySelector('.hero-card-3d');
  if (!heroCard) return;

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    
    heroCard.style.transform = `translateY(-10px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'translateY(-10px) rotateX(0) rotateY(0)';
  });
}

// Testimonials are now static cards, no slider needed

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Contact form handler with validation
function initContactForm() {
  const sendBtn = document.getElementById('sendBtn');
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  const closeSuccessBtn = document.getElementById('closeSuccess');
  
  if (!sendBtn || !form) return;

  // Close success message and show form again
  if (closeSuccessBtn && successMessage) {
    closeSuccessBtn.addEventListener('click', () => {
      successMessage.classList.add('hidden');
      form.classList.remove('hidden');
      form.reset();
    });
  }

  // Clear error messages on input
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const errorMsg = input.parentElement.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.classList.add('hidden');
        input.classList.remove('border-red-500');
      }
    });
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    
    // Clear previous errors
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.classList.add('hidden'));
    inputs.forEach(input => input.classList.remove('border-red-500'));

    // Get form values
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    // Validation
    let isValid = true;

    if (!name || name.length < 2) {
      showError(form.querySelector('input[name="name"]'), 'Name must be at least 2 characters');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(form.querySelector('input[name="email"]'), 'Please enter a valid email address');
      isValid = false;
    }

    if (!message || message.length < 10) {
      showError(form.querySelector('textarea[name="message"]'), 'Message must be at least 10 characters');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // If validation passes, submit the form
    sendBtn.disabled = true;
    const originalText = sendBtn.querySelector('span').textContent;
    sendBtn.querySelector('span').textContent = 'Sending...';
    
    try {
      // Submit to FormSubmit using fetch
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);
      formData.append('_captcha', 'false');
      formData.append('_subject', 'New Contact Form Submission from Portfolio');

      const response = await fetch('https://formsubmit.co/ajax/samyamrajb@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success message
        form.classList.add('hidden');
        if (successMessage) {
          successMessage.classList.remove('hidden');
          // Scroll to success message
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      // Show error message
      console.error('Form submission error:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
      sendBtn.disabled = false;
      sendBtn.querySelector('span').textContent = originalText;
    }
  });

  function showError(input, message) {
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.remove('hidden');
      input.classList.add('border-red-500');
    }
  }
}

// Navbar scroll effect and active link highlighting
function initNavbarScroll() {
  const nav = document.querySelector('header nav');
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.querySelector('div').style.boxShadow = '0 25px 70px rgba(167, 139, 250, 0.2)';
    } else {
      nav.querySelector('div').style.boxShadow = '';
    }
    
    lastScroll = currentScroll;
  });

  // Active link highlighting based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initial check
}

// Scroll Progress Indicator
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    const progress = (scrollTop / scrollableHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress(); // Initial update
}

// Visit Timer
function initVisitTimer() {
  const timerDisplay = document.getElementById('timerDisplay');
  const visitTimer = document.getElementById('visitTimer');
  if (!timerDisplay || !visitTimer) return;

  let startTime = localStorage.getItem('visitStartTime');
  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem('visitStartTime', startTime);
  } else {
    startTime = parseInt(startTime);
  }

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / 1000 / 60) % 60);
    const hours = Math.floor((elapsed / 1000 / 60 / 60));

    let timeString;
    if (hours > 0) {
      timeString = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      timeString = `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    timerDisplay.textContent = timeString;
  }

  // Update every second
  setInterval(updateTimer, 1000);
  updateTimer(); // Initial update

  // Optional: Hide timer on mobile or add toggle
  if (window.innerWidth < 768) {
    visitTimer.style.display = 'none';
  }
}

// Particle Cursor Effect
function initParticleCursor() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 30;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = `rgba(${Math.random() > 0.5 ? '167, 139, 250' : '196, 181, 253'}, ${Math.random() * 0.5 + 0.3})`;
    }

    update() {
      // Move towards mouse with some randomness
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        this.x += (dx / distance) * 0.5;
        this.y += (dy / distance) * 0.5;
      } else {
        this.x += this.speedX;
        this.y += this.speedY;
      }

      // Boundary check
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animate();
}

// Language Support
const translations = {
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', tools: 'Tools', testimonials: 'Testimonials', socials: 'Socials', connect: 'Connect', contact: 'Contact' },
    hero: { 
      greeting: "Hello — I'm Samyam",
      title: "I design interfaces with motion, clarity and accessibility.",
      description: "Product-focused front-end engineer building fast, accessible UI systems with delightful micro-interactions. I combine design + code to ship polished experiences.",
      seeWork: "See Work",
      hireMe: "Hire Me",
      resume: "Résumé",
      available: "Available",
      remote: "Remote"
    },
    work: { title: "Featured Work", subtitle: "Crafting experiences that matter" },
    projects: { title: "Projects", subtitle: "Exploring creativity through code" },
    testimonials: { title: "What clients say", subtitle: "Trusted by teams worldwide" },
    contact: { title: "Let's Connect", subtitle: "Let's build something useful. Send a brief message and I'll respond within a few days.", name: "Your name", email: "Your email", message: "Your message", send: "Send Message" },
    social: { title: "Connect", subtitle: "Follow my journey and latest updates" }
  },
  es: {
    nav: { home: 'Inicio', about: 'Acerca de', projects: 'Proyectos', tools: 'Herramientas', testimonials: 'Testimonios', socials: 'Sociales', connect: 'Conectar', contact: 'Contacto' },
    hero: { 
      greeting: "Hola — Soy Samyam",
      title: "Diseño interfaces con movimiento, claridad y accesibilidad.",
      description: "Ingeniero front-end enfocado en productos que construye sistemas de UI rápidos y accesibles con microinteracciones encantadoras. Combino diseño + código para crear experiencias pulidas.",
      seeWork: "Ver Trabajo",
      hireMe: "Contrátame",
      resume: "Currículum",
      available: "Disponible",
      remote: "Remoto"
    },
    work: { title: "Trabajo Destacado", subtitle: "Creando experiencias que importan" },
    projects: { title: "Proyectos", subtitle: "Explorando la creatividad a través del código" },
    testimonials: { title: "Lo que dicen los clientes", subtitle: "Confiado por equipos de todo el mundo" },
    contact: { title: "Conectemos", subtitle: "Construyamos algo útil. Envía un mensaje breve y responderé en unos días.", name: "Tu nombre", email: "Tu correo", message: "Tu mensaje", send: "Enviar Mensaje" },
    social: { title: "Conectar", subtitle: "Sigue mi viaje y últimas actualizaciones" }
  },
  fr: {
    nav: { home: 'Accueil', about: 'À propos', projects: 'Projets', tools: 'Outils', testimonials: 'Témoignages', socials: 'Réseaux', connect: 'Se connecter', contact: 'Contact' },
    hero: { 
      greeting: "Bonjour — Je suis Samyam",
      title: "Je conçois des interfaces avec mouvement, clarté et accessibilité.",
      description: "Ingénieur front-end axé sur les produits qui construit des systèmes d'interface utilisateur rapides et accessibles avec des micro-interactions délicieuses. Je combine design + code pour livrer des expériences polies.",
      seeWork: "Voir le travail",
      hireMe: "M'embaucher",
      resume: "CV",
      available: "Disponible",
      remote: "À distance"
    },
    work: { title: "Travail en vedette", subtitle: "Créer des expériences qui comptent" },
    projects: { title: "Projets", subtitle: "Explorer la créativité grâce au code" },
    testimonials: { title: "Ce que disent les clients", subtitle: "Fait confiance par des équipes du monde entier" },
    contact: { title: "Connectons-nous", subtitle: "Construisons quelque chose d'utile. Envoyez un bref message et je répondrai dans quelques jours.", name: "Votre nom", email: "Votre email", message: "Votre message", send: "Envoyer le message" },
    social: { title: "Se connecter", subtitle: "Suivez mon parcours et dernières mises à jour" }
  },
  de: {
    nav: { home: 'Startseite', about: 'Über mich', projects: 'Projekte', tools: 'Werkzeuge', testimonials: 'Referenzen', socials: 'Soziale', connect: 'Verbinden', contact: 'Kontakt' },
    hero: { 
      greeting: "Hallo — Ich bin Samyam",
      title: "Ich gestalte Benutzeroberflächen mit Bewegung, Klarheit und Barrierefreiheit.",
      description: "Produktorientierter Frontend-Ingenieur, der schnelle, zugängliche UI-Systeme mit ansprechenden Mikrointeraktionen entwickelt. Ich kombiniere Design + Code, um polierte Erfahrungen zu liefern.",
      seeWork: "Arbeit ansehen",
      hireMe: "Mich einstellen",
      resume: "Lebenslauf",
      available: "Verfügbar",
      remote: "Remote"
    },
    work: { title: "Ausgewählte Arbeiten", subtitle: "Erfahrungen schaffen, die zählen" },
    projects: { title: "Projekte", subtitle: "Kreativität durch Code erkunden" },
    testimonials: { title: "Was Kunden sagen", subtitle: "Vertraut von Teams weltweit" },
    contact: { title: "Lass uns verbinden", subtitle: "Lass uns etwas Nützliches bauen. Sende eine kurze Nachricht und ich werde innerhalb weniger Tage antworten.", name: "Ihr Name", email: "Ihre E-Mail", message: "Ihre Nachricht", send: "Nachricht senden" },
    social: { title: "Verbinden", subtitle: "Folgen Sie meiner Reise und neuesten Updates" }
  },
  ja: {
    nav: { home: 'ホーム', about: 'について', projects: 'プロジェクト', tools: 'ツール', testimonials: 'お客様の声', socials: 'ソーシャル', connect: '接続', contact: 'お問い合わせ' },
    hero: { 
      greeting: "こんにちは — サミャムです",
      title: "動き、明確さ、アクセシビリティを備えたインターフェースをデザインします。",
      description: "製品重視のフロントエンドエンジニアで、楽しいマイクロインタラクションを備えた高速でアクセシブルなUIシステムを構築しています。デザインとコードを組み合わせて、洗練された体験を提供します。",
      seeWork: "作品を見る",
      hireMe: "採用する",
      resume: "履歴書",
      available: "利用可能",
      remote: "リモート"
    },
    work: { title: "注目の作品", subtitle: "重要な体験を作り出す" },
    projects: { title: "プロジェクト", subtitle: "コードを通じて創造性を探る" },
    testimonials: { title: "お客様の声", subtitle: "世界中のチームから信頼されています" },
    contact: { title: "つながりましょう", subtitle: "何か役立つものを一緒に作りましょう。簡単なメッセージを送ってください。数日以内に返信いたします。", name: "お名前", email: "メールアドレス", message: "メッセージ", send: "メッセージを送信" },
    social: { title: "接続", subtitle: "私の旅と最新の更新をフォロー" }
  },
  zh: {
    nav: { home: '首页', about: '关于', projects: '项目', tools: '工具', testimonials: '客户评价', socials: '社交', connect: '连接', contact: '联系' },
    hero: { 
      greeting: "你好 — 我是 Samyam",
      title: "我设计具有动感、清晰度和可访问性的界面。",
      description: "专注于产品的全栈工程师，构建快速、可访问的UI系统，具有令人愉悦的微交互。我结合设计+代码来交付精美的体验。",
      seeWork: "查看作品",
      hireMe: "雇用我",
      resume: "简历",
      available: "可用",
      remote: "远程"
    },
    work: { title: "精选作品", subtitle: "创造重要的体验" },
    projects: { title: "项目", subtitle: "通过代码探索创造力" },
    testimonials: { title: "客户评价", subtitle: "受到全球团队的信任" },
    contact: { title: "让我们联系", subtitle: "让我们构建一些有用的东西。发送简短消息，我会在几天内回复。", name: "您的姓名", email: "您的邮箱", message: "您的消息", send: "发送消息" },
    social: { title: "连接", subtitle: "关注我的旅程和最新更新" }
  },
  ne: {
    nav: { home: 'घर', about: 'बारेमा', projects: 'प्रोजेक्टहरू', tools: 'उपकरणहरू', testimonials: 'ग्राहक समीक्षा', socials: 'सामाजिक', connect: 'जडान', contact: 'सम्पर्क' },
    hero: { 
      greeting: "नमस्ते — म सम्यम हुँ",
      title: "म गति, स्पष्टता र पहुँचको साथ इन्टरफेस डिजाइन गर्छु।",
      description: "उत्पाद-केन्द्रित फ्रन्ट-एन्ड इन्जिनियर जसले रोमाञ्चक माइक्रो-इन्टर्याक्सनहरूको साथ तीव्र, सुलभ UI प्रणालीहरू निर्माण गर्छ। म पोलिस अनुभवहरू वितरण गर्न डिजाइन + कोड जोड्छु।",
      seeWork: "काम हेर्नुहोस्",
      hireMe: "मलाई भाडामा लिनुहोस्",
      resume: "रिज्युमे",
      available: "उपलब्ध",
      remote: "दूरस्थ"
    },
    work: { title: "फिचर्ड वर्क", subtitle: "महत्वपूर्ण अनुभवहरू सिर्जना गर्दै" },
    projects: { title: "प्रोजेक्टहरू", subtitle: "कोड मार्फत रचनात्मकता अन्वेषण गर्दै" },
    testimonials: { title: "ग्राहकहरूले के भन्छन्", subtitle: "विश्वव्यापी टोलीहरूद्वारा विश्वास गरिएको" },
    contact: { title: "जडान गरौं", subtitle: "केही उपयोगी निर्माण गरौं। संक्षिप्त सन्देश पठाउनुहोस् र म केही दिनमा जवाफ दिनेछु।", name: "तपाईंको नाम", email: "तपाईंको इमेल", message: "तपाईंको सन्देश", send: "सन्देश पठाउनुहोस्" },
    social: { title: "जडान", subtitle: "मेरो यात्रा र नवीनतम अपडेटहरू पछ्याउनुहोस्" }
  }
};

function initLanguageSupport() {
  const langToggle = document.getElementById('langToggle');
  const langDropdown = document.getElementById('langDropdown');
  const currentLang = document.getElementById('currentLang');
  const langOptions = document.querySelectorAll('.lang-option');

  // Get saved language or default to English
  let currentLanguage = localStorage.getItem('language') || 'en';
  updateLanguage(currentLanguage);

  // Toggle dropdown
  langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown?.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!langToggle?.contains(e.target) && !langDropdown?.contains(e.target)) {
      langDropdown?.classList.add('hidden');
    }
  });

  // Language selection
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.getAttribute('data-lang');
      currentLanguage = lang;
      localStorage.setItem('language', lang);
      updateLanguage(lang);
      langDropdown?.classList.add('hidden');
    });
  });

  function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update document language
    document.documentElement.lang = lang;

    // Update navigation
    document.querySelectorAll('.nav-link').forEach((link, index) => {
      const keys = ['home', 'about', 'projects', 'tools', 'testimonials', 'socials'];
      if (keys[index] && t.nav[keys[index]]) {
        link.textContent = t.nav[keys[index]];
      }
    });
    
    // Update Connect button (nav-cta)
    const connectBtn = document.querySelector('.nav-cta');
    if (connectBtn && t.nav.connect) {
      connectBtn.textContent = t.nav.connect;
    }

    // Update hero section
    const heroBadge = document.querySelector('.hero-badge');
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('section#home p');
    const seeWorkBtn = document.querySelector('a[href="#projects"] span');
    const hireMeBtn = document.querySelector('a[href="#contact"]:not(.nav-cta)');
    const resumeBtn = document.querySelector('a[onclick*="Download"]');
    const statusBadges = document.querySelectorAll('.status-badge');

    if (heroBadge) heroBadge.textContent = t.hero.greeting;
    if (heroTitle) heroTitle.textContent = t.hero.title;
    if (heroDesc) heroDesc.textContent = t.hero.description;
    if (seeWorkBtn) seeWorkBtn.textContent = t.hero.seeWork;
    if (hireMeBtn) hireMeBtn.textContent = t.hero.hireMe;
    if (resumeBtn) resumeBtn.textContent = t.hero.resume;
    if (statusBadges[0]) statusBadges[0].textContent = t.hero.available;
    if (statusBadges[1]) statusBadges[1].textContent = t.hero.remote;

    // Update section headings
    const workTitle = document.querySelector('#work h2');
    const workSubtitle = document.querySelector('#work p');
    if (workTitle) workTitle.textContent = t.work.title;
    if (workSubtitle) workSubtitle.textContent = t.work.subtitle;

    const projectsTitle = document.querySelector('#projects h2');
    const projectsSubtitle = document.querySelector('#projects p');
    if (projectsTitle) projectsTitle.textContent = t.projects.title;
    if (projectsSubtitle) projectsSubtitle.textContent = t.projects.subtitle;

    const testimonialsTitle = document.querySelector('#testimonials h2');
    const testimonialsSubtitle = document.querySelector('#testimonials p');
    if (testimonialsTitle) testimonialsTitle.textContent = t.testimonials.title;
    if (testimonialsSubtitle) testimonialsSubtitle.textContent = t.testimonials.subtitle;

    const contactTitle = document.querySelector('#contact h2');
    const contactSubtitle = document.querySelector('#contact p');
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const messageTextarea = document.querySelector('textarea[name="message"]');
    const sendBtn = document.querySelector('#sendBtn span');
    if (contactTitle) contactTitle.textContent = t.contact.title;
    if (contactSubtitle) contactSubtitle.textContent = t.contact.subtitle;
    if (nameInput) nameInput.placeholder = t.contact.name;
    if (emailInput) emailInput.placeholder = t.contact.email;
    if (messageTextarea) messageTextarea.placeholder = t.contact.message;
    if (sendBtn) sendBtn.textContent = t.contact.send;

    const socialTitle = document.querySelector('#social h2');
    const socialSubtitle = document.querySelector('#social p');
    if (socialTitle) {
      // Always show "Socials" in English, or use translation if available
      socialTitle.textContent = lang === 'en' ? 'Socials' : (t.social?.title || 'Socials');
    }
    if (socialSubtitle) socialSubtitle.textContent = t.social.subtitle;

    // Update current language display
    if (currentLang) {
      const langCodes = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE', ja: 'JA', zh: 'ZH', ne: 'NE' };
      currentLang.textContent = langCodes[lang] || 'EN';
    }
  }
}

// Initialize Ribbons
function initRibbonsBackground() {
  const ribbonsContainer = document.getElementById('ribbonsContainer');
  if (!ribbonsContainer || typeof OGL === 'undefined') {
    // Retry after a delay if OGL hasn't loaded
    setTimeout(() => {
      if (typeof OGL !== 'undefined') {
        initRibbonsBackground();
      }
    }, 500);
    return;
  }

  initRibbons(ribbonsContainer, {
    baseThickness: 30,
    colors: ['#ffffff'],
    speedMultiplier: 0.5,
    maxAge: 500,
    enableFade: false,
    enableShaderEffect: true
  });
}


// Disable Inspection/DevTools
function disableInspection() {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
  });
  
  // Disable text selection shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+A, Ctrl+C, Ctrl+X, Ctrl+V
    if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 86)) {
      // Allow in input/textarea fields
      const target = e.target;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }
  });
  
  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });
  
  // Disable image dragging
  document.addEventListener('selectstart', (e) => {
    // Allow selection in input/textarea
    const target = e.target;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });
  
  // Console warning (can't fully disable console, but can make it annoying)
  const noop = () => {};
  const devtools = {
    open: false,
    orientation: null
  };
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
      if (!devtools.open) {
        devtools.open = true;
        document.body.innerHTML = '';
        document.body.style.display = 'none';
        alert('Developer tools detected. Please close them to continue.');
        window.location.reload();
      }
    } else {
      devtools.open = false;
    }
  }, 500);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  disableInspection();
  initGlowingS();
  initThemeToggle();
  setupMobileMenu();
  initAnimations();
  initHeroParallax();
  initSmoothScroll();
  initContactForm();
  initNavbarScroll();
  initVisitTimer();
  initScrollProgress();
  initParticleCursor();
  initLanguageSupport();
  initRibbonsBackground();
  initTools();
});

// Tools Functions
function initTools() {
  // Initialize tools if they exist on the page
  if (document.getElementById('colorPalette')) {
    generatePalette();
    updateHexCodes();
  }
  if (document.getElementById('gradientPreview')) {
    updateGradient();
  }
  if (document.getElementById('shadowPreview')) {
    updateShadow();
  }
  if (document.getElementById('qrInput')) {
    generateQR();
  }
}

// Color Palette Generator
function generatePalette() {
  const palette = document.getElementById('colorPalette');
  if (!palette) return;
  
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];
  
  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + (i * 30)) % 360;
    const saturation = 60 + Math.random() * 20;
    const lightness = 70 + (i * 5);
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(color);
    
    const div = palette.children[i];
    if (div) {
      div.style.background = color;
      div.setAttribute('data-color', color);
      // Update onclick to use the new color
      div.setAttribute('onclick', 'copyColor(this)');
    }
  }
  
  updateHexCodes();
}

function updateHexCodes() {
  const palette = document.getElementById('colorPalette');
  const hexCodes = document.getElementById('hexCodes');
  if (!palette || !hexCodes) return;
  
  let html = '';
  for (let i = 0; i < palette.children.length; i++) {
    const color = palette.children[i].getAttribute('data-color');
    const hex = rgbToHex(color);
    html += `<div>${hex}</div>`;
  }
  hexCodes.innerHTML = html;
}

function rgbToHex(rgb) {
  if (rgb.startsWith('#')) return rgb.toUpperCase();
  if (rgb.startsWith('hsl')) {
    const hsl = rgb.match(/\d+/g);
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  }
  return rgb;
}

function copyColor(element) {
  const color = element.getAttribute('data-color');
  const hex = rgbToHex(color);
  navigator.clipboard.writeText(hex).then(() => {
    // Visual feedback
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = '';
    }, 200);
  });
}

function copyPalette() {
  const hexCodes = document.getElementById('hexCodes');
  if (!hexCodes) return;
  
  const codes = Array.from(hexCodes.children).map(child => child.textContent).join(', ');
  navigator.clipboard.writeText(codes).then(() => {
    alert('Palette copied to clipboard!');
  });
}

// Gradient Generator
function updateGradient() {
  const color1 = document.getElementById('gradientColor1')?.value || '#A78BFA';
  const color2 = document.getElementById('gradientColor2')?.value || '#C4B5FD';
  const direction = document.getElementById('gradientDirection')?.value || '135deg';
  const preview = document.getElementById('gradientPreview');
  const code = document.getElementById('gradientCode');
  
  if (preview) {
    preview.style.background = `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
  }
  
  if (code) {
    code.textContent = `background: linear-gradient(${direction}, ${color1} 0%, ${color2} 100%);`;
  }
}

function copyGradient() {
  const code = document.getElementById('gradientCode');
  if (!code) return;
  
  navigator.clipboard.writeText(code.textContent).then(() => {
    alert('Gradient CSS copied to clipboard!');
  });
}

// Shadow Generator
function updateShadow() {
  const xOffset = document.getElementById('xOffset')?.value || 10;
  const yOffset = document.getElementById('yOffset')?.value || 10;
  const blur = document.getElementById('blur')?.value || 20;
  const spread = document.getElementById('spread')?.value || 0;
  const opacity = document.getElementById('opacity')?.value || 0.3;
  
  // Update value displays
  document.getElementById('xOffsetValue').textContent = xOffset;
  document.getElementById('yOffsetValue').textContent = yOffset;
  document.getElementById('blurValue').textContent = blur;
  document.getElementById('spreadValue').textContent = spread;
  document.getElementById('opacityValue').textContent = opacity;
  
  const shadowValue = `${xOffset}px ${yOffset}px ${blur}px ${spread}px rgba(167, 139, 250, ${opacity})`;
  const shadowBox = document.getElementById('shadowBox');
  const shadowCode = document.getElementById('shadowCode');
  
  if (shadowBox) {
    shadowBox.style.boxShadow = shadowValue;
  }
  
  if (shadowCode) {
    shadowCode.textContent = `box-shadow: ${shadowValue};`;
  }
}

function copyShadow() {
  const code = document.getElementById('shadowCode');
  if (!code) return;
  
  navigator.clipboard.writeText(code.textContent).then(() => {
    alert('Shadow CSS copied to clipboard!');
  });
}

// QR Code Generator
function generateQR() {
  const input = document.getElementById('qrInput');
  const container = document.getElementById('qrCode');
  if (!input || !container) return;
  
  const text = input.value || 'https://samyam.dev';
  
  // Using a simple QR code API (you can replace with a library)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  
  container.innerHTML = `<img src="${qrUrl}" alt="QR Code" class="w-full h-full object-contain">`;
}

function downloadQR() {
  const input = document.getElementById('qrInput');
  const container = document.getElementById('qrCode');
  if (!input || !container) return;
  
  const text = input.value || 'https://samyam.dev';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
  
  const link = document.createElement('a');
  link.href = qrUrl;
  link.download = 'qrcode.png';
  link.click();
}
