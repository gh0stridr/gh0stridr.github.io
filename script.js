/**
 * Breach Vector LLC - Interactive Elements
 * Modern Cyber-Professional Website
 */

// =====================================================
// Hero Section Particle System
// =====================================================

class ParticleNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Check if canvas context is supported
    if (!this.ctx) {
      console.warn('Canvas 2D context not supported');
      return;
    }

    this.particles = [];
    this.isRunning = false;
    this.animationId = null;

    this.config = {
      particleCount: 50,
      maxDistance: 120,
      particleSpeed: 0.3,
      particleColor: 'rgba(0, 217, 255, 0.4)',
      lineColor: 'rgba(0, 217, 255, 0.15)',
      particleRadius: { min: 1, max: 2 }
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();

    // Handle window resize
    window.addEventListener('resize', () => this.resize());

    // Use Intersection Observer to pause when not visible
    this.setupIntersectionObserver();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Recreate particles on resize
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        radius: Math.random() * (this.config.particleRadius.max - this.config.particleRadius.min) + this.config.particleRadius.min
      });
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isRunning) {
          this.start();
        } else if (!entry.isIntersecting && this.isRunning) {
          this.stop();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.canvas);
  }

  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Keep within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    });
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.fillStyle = this.config.particleColor;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.maxDistance) {
          const opacity = 0.15 * (1 - distance / this.config.maxDistance);
          this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();

    // Continue animation
    if (this.isRunning) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// =====================================================
// Mobile Menu Toggle
// =====================================================

class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector('.mobile-menu-toggle');
    this.navLinks = document.querySelector('.nav-links');
    this.isOpen = false;

    if (this.menuToggle) {
      this.init();
    }
  }

  init() {
    this.menuToggle.addEventListener('click', () => this.toggle());

    // Close menu when clicking nav links
    const links = this.navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) {
          this.toggle();
        }
      });
    });

    // Close menu on resize if window becomes wide
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.toggle();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.menuToggle.classList.toggle('active');
    this.navLinks.classList.toggle('active');

    // Update ARIA attributes for accessibility
    this.menuToggle.setAttribute('aria-expanded', this.isOpen);
  }
}

// =====================================================
// Smooth Scroll Enhancement
// =====================================================

function enhanceSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Don't prevent default for just "#" links
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return; // Guard clause for safety

      e.preventDefault();

      // Get header height for offset
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 80; // Fallback to 80px

      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
}

// =====================================================
// Header Scroll Effect
// =====================================================

function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });
}

// =====================================================
// Performance Check - Detect Reduced Motion Preference
// =====================================================

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// =====================================================
// Update Copyright Year
// =====================================================

function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// =====================================================
// Initialize Everything
// =====================================================

function init() {
  try {
    // Only initialize particle system on desktop and if motion is allowed
    const canvas = document.getElementById('hero-canvas');
    if (canvas && window.innerWidth >= 1024 && !prefersReducedMotion()) {
      const particleNetwork = new ParticleNetwork(canvas);
      if (particleNetwork.ctx) {
        particleNetwork.start();
      }
    }

    // Initialize mobile menu
    new MobileMenu();

    // Enhance smooth scrolling
    enhanceSmoothScroll();

    // Initialize header scroll effect
    initHeaderScroll();

    // Update copyright year
    updateCopyrightYear();

    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
  } catch (error) {
    console.error('Initialization error:', error);
    // Ensure basic functionality even if something fails
    document.body.classList.add('loaded');
  }
}

// =====================================================
// Run on DOM Ready
// =====================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =====================================================
// Performance Monitoring (Development Only)
// =====================================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Log performance metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`%c⚡ Page Load Time: ${pageLoadTime}ms`, 'color: #00d9ff; font-weight: bold;');
    }, 0);
  });
}
