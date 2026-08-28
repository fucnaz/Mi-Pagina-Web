document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i') || navToggle;
      // Simple toggle text/content or icon state
      if (navMenu.classList.contains('open')) {
        navToggle.innerHTML = '&#x2715;'; // Close symbol
      } else {
        navToggle.innerHTML = '&#9776;'; // Menu symbol
      }
    });

    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.innerHTML = '&#9776;';
      });
    });
  }

  // Header scroll class
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Active navigation link on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Catalog Portfolio Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Simple animation trigger
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    for (let i = 0; i < revealElements.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = revealElements[i].getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add('active');
      }
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once on load
  revealOnScroll();

  // Contact Form Submission (Mock)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'Enviando...';
      submitBtn.disabled = true;

      // Mock request
      setTimeout(() => {
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Course Purchase Checkout Handler
  const buyButtons = document.querySelectorAll('.buy-btn');
  buyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const courseTitle = button.getAttribute('data-course-title');
      const coursePrice = button.getAttribute('data-course-price');
      const originalText = button.innerHTML;

      try {
        button.innerHTML = '<span>Procesando pago...</span>';
        button.disabled = true;

        const response = await fetch('/api/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: courseTitle,
            price: coursePrice
          })
        });

        if (!response.ok) {
          throw new Error('Error al generar la preferencia de Mercado Pago');
        }

        const data = await response.json();
        if (data.initPoint) {
          // Redirect the user to Mercado Pago checkout
          window.location.href = data.initPoint;
        } else {
          throw new Error('No se recibió la URL de pago.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Hubo un problema al iniciar el pago. Por favor intenta de nuevo.');
        button.innerHTML = originalText;
        button.disabled = false;
      }
    });
  });
});

