// VastraKalā - Custom Stitched Elegance
// Main JavaScript File

document.addEventListener("DOMContentLoaded", function() {
  // Initialize the website
  initWebsite();
});



// Main initialization function
function initWebsite() {
  // Add fade-in animation to body
  document.body.classList.add("fade-in");
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize testimonial slider
  initTestimonialSlider();
  
  // Initialize product filter
  initProductFilter();
  
  // Initialize contact form
  initContactForm();
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
      
      // Change icon based on menu state
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
}

// Scroll animations
function initScrollAnimations() {
  // Intersection Observer for sections
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Intersection Observer for product cards with staggered animation
  const productObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on index
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all product cards
  document.querySelectorAll('.product-card').forEach(card => {
    productObserver.observe(card);
  });
}

// Testimonial slider functionality
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  
  if (!slides.length || !dots.length) return;
  
  let currentSlide = 0;
  const maxSlide = slides.length - 1;
  
  // Function to update slide display
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    // Show current slide
    slides[index].classList.add('active');
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    
    // Update current slide index
    currentSlide = index;
  }
  
  // Next slide function
  function nextSlide() {
    if (currentSlide >= maxSlide) {
      showSlide(0);
    } else {
      showSlide(currentSlide + 1);
    }
  }
  
  // Previous slide function
  function prevSlide() {
    if (currentSlide <= 0) {
      showSlide(maxSlide);
    } else {
      showSlide(currentSlide - 1);
    }
  }
  
  // Event listeners for controls
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });
  
  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000);
}

// Product filter functionality
function initProductFilter() {
  const filterSelect = document.getElementById('productFilter');
  const productCards = document.querySelectorAll('.product-card');
  
  if (!filterSelect || !productCards.length) return;
  
  filterSelect.addEventListener('change', function() {
    const selectedCategory = this.value;
    
    productCards.forEach(card => {
      // For demo purposes, we're just adding a simple animation
      // In a real implementation, you would filter based on data attributes
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 300);
    });
  });
  
  // View options (grid/list)
  const viewButtons = document.querySelectorAll('.view-btn');
  const productGrid = document.querySelector('.product-grid');
  
  if (viewButtons.length && productGrid) {
    viewButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        viewButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Toggle grid/list view
        if (this.querySelector('i').classList.contains('fa-list')) {
          productGrid.classList.add('list-view');
        } else {
          productGrid.classList.remove('list-view');
        }
      });
    });
  }
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !phone || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // In a real implementation, you would send this data to a server
    // For demo purposes, we'll just show a success message
    alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for fixed header
        behavior: 'smooth'
      });
    }
  });
});

