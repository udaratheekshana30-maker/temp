// ===== DOM References =====
const navbar = document.getElementById('navbar');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const toast = document.getElementById('toast');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Modal elements
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalFooter = document.getElementById('modal-footer');
const submitBtn = document.getElementById('submit-btn');
const toggleModeLink = document.getElementById('toggle-mode');
const nameGroup = document.getElementById('name-group');
const formExtras = document.getElementById('form-extras');

// Buttons that open modals
const btnOpenLogin = document.getElementById('btn-open-login');
const btnOpenSignup = document.getElementById('btn-open-signup');
const heroCtaStart = document.getElementById('hero-cta-start');
const ctaGetStarted = document.getElementById('cta-get-started');
const modalClose = document.getElementById('modal-close');

// ===== State =====
let isSignUpMode = false;

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
  
  // Animate hamburger to X
  const spans = menuToggle.querySelectorAll('span');
  menuToggle.classList.toggle('active');
  
  if (menuToggle.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Add mobile nav styles dynamically
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(10, 14, 26, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 24px;
      gap: 16px;
      border-bottom: 1px solid var(--clr-border);
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
`;
document.head.appendChild(mobileStyles);

// ===== Modal Functions =====
function openModal(signUp = false) {
  isSignUpMode = signUp;
  updateModalMode();
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus first input after animation
  setTimeout(() => {
    if (signUp) {
      document.getElementById('full-name').focus();
    } else {
      document.getElementById('email').focus();
    }
  }, 400);
}

function closeModal() {
  loginModal.classList.remove('active');
  document.body.style.overflow = '';
  loginForm.reset();
  clearFormErrors();
}

function updateModalMode() {
  if (isSignUpMode) {
    modalTitle.textContent = 'Create Account';
    modalSubtitle.textContent = 'Sign up to get started with your journey';
    submitBtn.textContent = 'Create Account';
    nameGroup.style.display = 'block';
    formExtras.style.display = 'none';
    toggleModeLink.textContent = 'Sign in';
    modalFooter.innerHTML = 'Already have an account? <a href="#" id="toggle-mode">Sign in</a>';
  } else {
    modalTitle.textContent = 'Welcome Back';
    modalSubtitle.textContent = 'Sign in to continue to your dashboard';
    submitBtn.textContent = 'Sign In';
    nameGroup.style.display = 'none';
    formExtras.style.display = 'flex';
    modalFooter.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-mode">Sign up</a>';
  }
  
  // Re-bind toggle link
  document.getElementById('toggle-mode').addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    updateModalMode();
  });
}

// ===== Event Listeners for Opening Modal =====
btnOpenLogin.addEventListener('click', () => openModal(false));
btnOpenSignup.addEventListener('click', () => openModal(true));
heroCtaStart.addEventListener('click', () => openModal(true));
ctaGetStarted.addEventListener('click', () => openModal(true));
modalClose.addEventListener('click', closeModal);

// Close on overlay click
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loginModal.classList.contains('active')) {
    closeModal();
  }
});

// ===== Form Validation =====
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(input, message) {
  input.style.borderColor = '#fb7185';
  input.style.boxShadow = '0 0 0 3px rgba(251, 113, 133, 0.12)';
  
  // Remove existing error
  const existingError = input.parentElement.querySelector('.field-error');
  if (existingError) existingError.remove();
  
  const errorEl = document.createElement('span');
  errorEl.className = 'field-error';
  errorEl.style.cssText = 'color: #fb7185; font-size: 0.78rem; margin-top: 4px; display: block;';
  errorEl.textContent = message;
  input.parentElement.appendChild(errorEl);
}

function clearFieldError(input) {
  input.style.borderColor = '';
  input.style.boxShadow = '';
  const error = input.parentElement.querySelector('.field-error');
  if (error) error.remove();
}

function clearFormErrors() {
  document.querySelectorAll('.form-input').forEach(input => clearFieldError(input));
}

// Clear errors on input
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => clearFieldError(input));
});

// ===== Form Submission =====
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  let isValid = true;
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const nameInput = document.getElementById('full-name');
  
  // Validate name (sign up mode)
  if (isSignUpMode && !nameInput.value.trim()) {
    showFieldError(nameInput, 'Please enter your name');
    isValid = false;
  }
  
  // Validate email
  if (!emailInput.value.trim()) {
    showFieldError(emailInput, 'Email is required');
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    showFieldError(emailInput, 'Please enter a valid email');
    isValid = false;
  }
  
  // Validate password
  if (!passwordInput.value) {
    showFieldError(passwordInput, 'Password is required');
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    showFieldError(passwordInput, 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Simulate loading
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '⏳ Please wait...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    
    closeModal();
    
    if (isSignUpMode) {
      showToast('🎉 Account created successfully! Welcome aboard.', 'success');
    } else {
      showToast('✅ Signed in successfully! Welcome back.', 'success');
    }
  }, 1500);
});

// ===== Social Login Buttons =====
document.getElementById('btn-google').addEventListener('click', () => {
  showToast('🔗 Redirecting to Google...', 'success');
  setTimeout(() => closeModal(), 600);
});

document.getElementById('btn-github').addEventListener('click', () => {
  showToast('🔗 Redirecting to GitHub...', 'success');
  setTimeout(() => closeModal(), 600);
});

// ===== Toast Notification =====
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  // Force reflow for re-trigger
  void toast.offsetWidth;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animations
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// ===== Counter Animation for Stats =====
function animateCounters() {
  const stats = document.querySelectorAll('.stat-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;
        
        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], '');
        let current = 0;
        const increment = Math.ceil(target / 60);
        const duration = 1500;
        const stepTime = duration / (target / increment);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          el.textContent = current + suffix;
        }, stepTime);
        
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observer.observe(stat));
}

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close mobile menu if open
      navLinks.classList.remove('mobile-open');
      menuToggle.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
});

// ===== Parallax Effect on Hero =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroCard = document.querySelector('.hero-card');
  if (heroCard && scrolled < window.innerHeight) {
    heroCard.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  animateCounters();
});
