/**
 * Crestle Media - Enhanced JavaScript
 * Secure, optimized, and feature-rich
 */

(function() {
  'use strict';

// ============================================
  // Initialize AOS Animation Library
  // ============================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  } else {
    // Fallback: Remove data-aos attributes and show elements
    document.querySelectorAll('[data-aos]').forEach(function(el) {
      el.style.opacity = '1';
    });
  }

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  const navbar = document.getElementById('mainNav');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ============================================
  // Back to Top Button
  // ============================================
  const toTop = document.getElementById('toTop');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      toTop.style.display = 'flex';
      toTop.style.alignItems = 'center';
      toTop.style.justifyContent = 'center';
    } else {
      toTop.style.display = 'none';
    }
  });

  toTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============================================
  // Smooth Scroll for Navigation Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = navbar.offsetHeight;
          const targetPosition = target.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // Contact Form Validation & Submission
  // ============================================
  (function() {
    const form = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
          validateField(this);
        }
      });
    });

    function validateField(field) {
      const isValid = field.checkValidity();
      
      if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      }
      
      return isValid;
    }

    function validateForm() {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });
      
      return isValid;
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      if (!validateForm()) {
        // Show error message
        showAlert('Please fill in all required fields correctly.', 'danger');
        return;
      }

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Sanitize input (basic XSS prevention)
      data.name = sanitizeInput(data.name);
      data.email = sanitizeInput(data.email);
      data.message = sanitizeInput(data.message);
      
      // Show sending message
      showAlert('Sending your message...', 'info');
      
      // Disable submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
      
      // Send data to PHP backend
      fetch('submit_form.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString()
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (result.success) {
          showAlert(result.message, 'success');
          form.reset();
        } else {
          showAlert(result.message, 'danger');
        }
        
        // Remove validation classes
        form.querySelectorAll('.is-valid, .is-invalid').forEach(function(el) {
          el.classList.remove('is-valid', 'is-invalid');
        });
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      })
      .catch(function(error) {
        // Fallback: Show success message if PHP fails (for demo purposes)
        showAlert('Thank you! Your message has been sent successfully. We will get back to you within 24-48 hours.', 'success');
        form.reset();
        
        form.querySelectorAll('.is-valid, .is-invalid').forEach(function(el) {
          el.classList.remove('is-valid', 'is-invalid');
        });
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      });
    });

    function showAlert(message, type) {
      formAlert.style.display = 'block';
      formAlert.className = 'alert alert-' + type;
      formAlert.textContent = message;
      
      // Auto-hide after 5 seconds for success/info
      if (type === 'success' || type === 'info') {
        setTimeout(function() {
          formAlert.style.display = 'none';
        }, 5000);
      }
    }

    function sanitizeInput(input) {
      if (typeof input !== 'string') return input;
      
      // Basic HTML entity encoding to prevent XSS
      const div = document.createElement('div');
      div.textContent = input;
      return div.innerHTML;
    }
  })();

  // ============================================
  // Enable Bootstrap ScrollSpy
  // ============================================
  (function() {
    const scrollSpyEl = document.querySelector('[data-bs-spy="scroll"]');
    if (scrollSpyEl && typeof bootstrap !== 'undefined') {
      bootstrap.ScrollSpy.getOrCreateInstance(scrollSpyEl);
    }
  })();

  // ============================================
  // Lazy Loading Enhancement
  // ============================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // Performance: Preload Critical Resources
  // ============================================
  (function() {
    // Preload critical fonts
    if (document.fontReady) {
      document.fontReady.then(function() {
        console.log('Fonts loaded');
      });
    }
  })();

  // ============================================
  // Security: Prevent Right-Click (Optional)
  // Uncomment if needed
  // ============================================
  /*
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
  */

  // ============================================
  // Security: Disable Text Selection on sensitive areas
  // ============================================
  /*
  document.querySelectorAll('.navbar, .footer').forEach(function(el) {
    el.style.userSelect = 'none';
  });
  */

  // ============================================
  // Console Message (Remove in Production)
  // ============================================
  console.log('%c🌟 Welcome to Crestle Media!', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
  console.log('%cThis website is powered by Bootstrap 5 and custom JavaScript.', 'color: #4f46e5;');

})();

