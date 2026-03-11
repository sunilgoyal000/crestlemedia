/**
 * Crestle Media - Enhanced JavaScript
 */

(function() {
  'use strict';

  // Initialize AOS Animation
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('mainNav');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Back to Top Button
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function() {
      toTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    toTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target && navbar) {
          const offset = navbar.offsetHeight + 20;
          window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();
      
      // Basic validation
      if (!name || name.length < 2) {
        alert('Please enter your name (at least 2 characters)');
        return;
      }
      
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      
      if (!message || message.length < 10) {
        alert('Please enter a message (at least 10 characters)');
        return;
      }
      
      // Build mailto link
      const subject = encodeURIComponent('New Inquiry from Website - ' + name);
      let body = 'Name: ' + name + '\n';
      body += 'Email: ' + email + '\n';
      if (phone) body += 'Phone: ' + phone + '\n';
      if (service) body += 'Service Interested In: ' + service + '\n';
      body += '\nMessage:\n' + message;
      
      // Open email client
      window.location.href = 'mailto:crestlemedia@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(body);
    });
  }

  // Console welcome message
  console.log('%c🌟 Welcome to Crestle Media!', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
})();
