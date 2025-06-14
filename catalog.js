// VastraKalā Catalog JavaScript
// Interactive catalog functionality

// Global variables
let catalogData = null;
let currentCategory = null;
let currentSubcategory = null;

// DOM elements
const catalogMain = document.getElementById('catalogMain');
const catalogSubcategories = document.getElementById('catalogSubcategories');
const productDetail = document.getElementById('productDetail');
const breadcrumb = document.getElementById('breadcrumb');

// Initialize catalog when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadCatalogData();
  initializeEventListeners();
});

// Load catalog data from JSON
async function loadCatalogData() {
  try {
    const response = await fetch('catalog_data.json');
    catalogData = await response.json();
    renderCategories();
  } catch (error) {
    console.error('Error loading catalog data:', error);
    // Fallback: use embedded data if JSON file is not available
    catalogData = getCatalogDataFallback();
    renderCategories();
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Back to categories button
  const backToCategories = document.getElementById('backToCategories');
  if (backToCategories) {
    backToCategories.addEventListener('click', showCategories);
  }

  // Back to subcategories button
  const backToSubcategories = document.getElementById('backToSubcategories');
  if (backToSubcategories) {
    backToSubcategories.addEventListener('click', showSubcategories);
  }
}

// Render main categories
function renderCategories() {
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (!categoriesGrid || !catalogData) return;

  categoriesGrid.innerHTML = '';

  catalogData.categories.forEach(category => {
    const categoryCard = createCategoryCard(category);
    categoriesGrid.appendChild(categoryCard);
  });

  // Add animation
  setTimeout(() => {
    categoriesGrid.classList.add('fade-in');
  }, 100);
}

// Create category card element
function createCategoryCard(category) {
  const card = document.createElement("div");
  card.className = "category-card";
  card.innerHTML = `
    <div class="category-image-wrapper">
      <img src="${category.image}" alt="${category.name}" loading="lazy">
    </div>
    <div class="category-info">
      <h3>${category.name}</h3>
      <p>${category.subcategories.length} styles available</p>
    </div>
  `;

  card.addEventListener("click", () => {
    showSubcategories(category);
  });

  return card;
}

// Show subcategories for selected category
function showSubcategories(category = currentCategory) {
  if (!category) return;

  currentCategory = category;
  
  // Hide main categories and show subcategories
  catalogMain.style.display = 'none';
  catalogSubcategories.style.display = 'block';
  productDetail.style.display = 'none';

  // Update breadcrumb
  updateBreadcrumb(['Home', 'Catalog', category.name]);

  // Render category tabs
  renderCategoryTabs();

  // Update subcategory title
  const subcategoryTitle = document.getElementById('subcategoryTitle');
  if (subcategoryTitle) {
    subcategoryTitle.textContent = `${category.name} Collection`;
  }

  // Render subcategories
  renderSubcategories(category.subcategories, currentCategory);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render category tabs
function renderCategoryTabs() {
  const categoryTabs = document.getElementById('categoryTabs');
  if (!categoryTabs || !catalogData) return;

  categoryTabs.innerHTML = '';

  catalogData.categories.forEach(category => {
    const tab = document.createElement('button');
    tab.className = `category-tab ${category.name === currentCategory.name ? 'active' : ''}`;
    tab.textContent = category.name;
    
    tab.addEventListener('click', () => {
      showSubcategories(category);
    });

    categoryTabs.appendChild(tab);
  });
}

// Render subcategories grid
function renderSubcategories(subcategories, category) {
  const subcategoriesGrid = document.getElementById('subcategoriesGrid');
  if (!subcategoriesGrid) return;

  subcategoriesGrid.innerHTML = '';

  // Add customization message card first
  const customizationCard = createCustomizationCard(category);
  subcategoriesGrid.appendChild(customizationCard);

  subcategories.forEach(subcategory => {
    const subcategoryCard = createSubcategoryCard(subcategory);
    subcategoriesGrid.appendChild(subcategoryCard);
  });

  // Add animation
  setTimeout(() => {
    subcategoriesGrid.classList.add('fade-in');
  }, 100);
}

// Create customization message card
function createCustomizationCard(category) {
  const card = document.createElement('div');
  card.className = 'customization-card';
  
  card.innerHTML = `
    <div class="customization-content">
      <div class="customization-icon">
        <i class="fas fa-magic"></i>
      </div>
      <h3>Custom ${category.name}</h3>
      <p>Explore our custom ${category.name} designs. All products are 100% customizable according to your needs.</p>
      <a href="https://wa.me/919712400146?text=Hi%20I%20would%20like%20to%20discuss%20custom%20design%20options" 
         class="btn-customize" target="_blank">
        <i class="fab fa-whatsapp"></i> Discuss Custom Design
      </a>
    </div>
  `;

  return card;
}

// Create subcategory card element
function createSubcategoryCard(subcategory) {
  const card = document.createElement('div');
  card.className = 'subcategory-card';
  
  const stars = generateStars(subcategory.rating);
  
  card.innerHTML = `
    <div class="subcategory-image">
      <img src="${subcategory.image}" alt="${subcategory.name}" loading="lazy">
    </div>
    <div class="subcategory-info">
      <h3>${subcategory.name}</h3>
      <div class="subcategory-rating">
        ${stars}
      </div>
      <p>${subcategory.description.substring(0, 100)}...</p>
    </div>
  `;

  card.addEventListener('click', () => {
    showProductDetail(subcategory);
  });

  return card;
}

// Show product detail page
function showProductDetail(subcategory) {
  currentSubcategory = subcategory;

  // Hide other sections and show product detail
  catalogMain.style.display = 'none';
  catalogSubcategories.style.display = 'none';
  productDetail.style.display = 'block';

  // Update breadcrumb
  updateBreadcrumb(['Home', 'Catalog', currentCategory.name, subcategory.name]);

  // Populate product details
  populateProductDetail(subcategory);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Populate product detail section
function populateProductDetail(subcategory) {
  // Product carousel
  renderProductCarousel(subcategory.images);

  // Product name
  const productName = document.getElementById('productName');
  if (productName) {
    productName.textContent = subcategory.name;
  }

  // Product rating
  const productStars = document.getElementById('productStars');
  const productRating = document.getElementById('productRating');
  if (productStars && productRating) {
    productStars.innerHTML = generateStars(subcategory.rating);
    productRating.textContent = subcategory.rating.toFixed(1);
  }

  // Product description
  const productDescription = document.getElementById('productDescription');
  if (productDescription) {
    productDescription.textContent = subcategory.description;
  }

  // Materials
  renderMaterials(subcategory.materials);

  // Update WhatsApp link
  updateWhatsAppLink(subcategory);
}

// Render materials selector
function renderMaterials(materials) {
  const materialsGrid = document.getElementById('materialsGrid');
  if (!materialsGrid) return;

  materialsGrid.innerHTML = '';

  materials.forEach(material => {
    const materialOption = document.createElement('div');
    materialOption.className = 'material-option';
    materialOption.textContent = material;

    materialOption.addEventListener('click', () => {
      // Remove selected class from all materials
      materialsGrid.querySelectorAll('.material-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Add selected class to clicked material
      materialOption.classList.add('selected');
    });

    materialsGrid.appendChild(materialOption);
  });
}

// Update WhatsApp link with product information
function updateWhatsAppLink(subcategory) {
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (!whatsappBtn) return;

  const selectedMaterial = document.querySelector('.material-option.selected');
  const materialText = selectedMaterial ? selectedMaterial.textContent : 'your preferred fabric';
  
  const message = `Hi! I would like to custom stitch a ${subcategory.name} in ${materialText}. Please share more details about sizing and pricing.`;
  const encodedMessage = encodeURIComponent(message);
  
  whatsappBtn.href = `https://wa.me/919712400146?text=${encodedMessage}`;
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

// Show main categories
function showCategories() {
  catalogMain.style.display = 'block';
  catalogSubcategories.style.display = 'none';
  productDetail.style.display = 'none';

  // Update breadcrumb
  updateBreadcrumb(['Home', 'Catalog']);

  // Reset current selections
  currentCategory = null;
  currentSubcategory = null;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update breadcrumb navigation
function updateBreadcrumb(items) {
  const breadcrumbNav = document.querySelector('.breadcrumb-nav');
  if (!breadcrumbNav) return;

  breadcrumbNav.innerHTML = '';

  items.forEach((item, index) => {
    if (index > 0) {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.textContent = '/';
      breadcrumbNav.appendChild(separator);
    }

    if (index === items.length - 1) {
      // Current page
      const current = document.createElement('span');
      current.className = 'breadcrumb-current';
      current.textContent = item;
      breadcrumbNav.appendChild(current);
    } else {
      // Clickable link
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = item;
      
      if (item === 'Home') {
        link.href = 'index.html';
      } else if (item === 'Catalog') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          showCategories();
        });
      } else if (currentCategory && item === currentCategory.name) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          showSubcategories();
        });
      }
      
      breadcrumbNav.appendChild(link);
    }
  });
}

// Fallback catalog data (embedded)
function getCatalogDataFallback() {
  return {
    "categories": [
      {
        "name": "BLOUSE",
        "icon": "fas fa-shirt",
        "subcategories": [
          {
            "name": "Simple Deep Neck",
            "image": "https://images.pexels.com/photos/1078978/pexels-photo-1078978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "description": "A classic and elegant deep neck design that accentuates the neckline, perfect for both casual and festive occasions.",
            "rating": 4.5,
            "materials": ["Cotton", "Silk", "Georgette", "Crepe"]
          }
          // Add more subcategories as needed
        ]
      }
      // Add more categories as needed
    ]
  };
}

// Handle material selection changes
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('material-option')) {
    // Update WhatsApp link when material is selected
    setTimeout(() => {
      if (currentSubcategory) {
        updateWhatsAppLink(currentSubcategory);
      }
    }, 100);
  }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
  // Add any responsive adjustments if needed
});

// Product Carousel Functionality
let currentCarouselIndex = 0;
let carouselImages = [];
let carouselAutoInterval = null;

// Render product carousel
function renderProductCarousel(images) {
  carouselImages = images;
  currentCarouselIndex = 0;
  
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselIndicators = document.getElementById('carouselIndicators');
  
  if (!carouselTrack || !carouselIndicators) return;
  
  // Clear existing content
  carouselTrack.innerHTML = '';
  carouselIndicators.innerHTML = '';
  
  // Create carousel slides
  images.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `<img src="${image}" alt="Product Image ${index + 1}" loading="lazy">`;
    carouselTrack.appendChild(slide);
    
    // Create indicator
    const indicator = document.createElement('button');
    indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
    indicator.setAttribute('data-slide', index);
    indicator.setAttribute('type', 'button');
    indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      stopCarouselAutoScroll();
      goToSlide(index);
      startCarouselAutoScroll();
    });
    carouselIndicators.appendChild(indicator);
  });
  
  // Initialize carousel controls
  initCarouselControls();
  
  // Start auto-scroll
  startCarouselAutoScroll();
  
  // Add touch support
  addCarouselTouchSupport();
}

// Initialize carousel controls
function initCarouselControls() {
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  
  // Remove existing event listeners to prevent duplicates
  if (prevBtn) {
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    const newPrevBtn = document.getElementById('carouselPrev');
    newPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      stopCarouselAutoScroll();
      previousSlide();
      startCarouselAutoScroll();
    });
  }
  
  if (nextBtn) {
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    const newNextBtn = document.getElementById('carouselNext');
    newNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      stopCarouselAutoScroll();
      nextSlide();
      startCarouselAutoScroll();
    });
  }
}

// Go to specific slide
function goToSlide(index) {
  if (index < 0 || index >= carouselImages.length) return;
  
  currentCarouselIndex = index;
  updateCarouselDisplay();
}

// Go to next slide
function nextSlide() {
  currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
  updateCarouselDisplay();
}

// Go to previous slide
function previousSlide() {
  currentCarouselIndex = currentCarouselIndex === 0 ? carouselImages.length - 1 : currentCarouselIndex - 1;
  updateCarouselDisplay();
}

// Update carousel display
function updateCarouselDisplay() {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  // Update slides
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentCarouselIndex);
  });
  
  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentCarouselIndex);
  });
  
  // Update track position
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const translateX = -currentCarouselIndex * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
  }
}

// Start auto-scroll
function startCarouselAutoScroll() {
  if (carouselImages.length <= 1) return;
  
  stopCarouselAutoScroll();
  carouselAutoInterval = setInterval(() => {
    nextSlide();
  }, 4000); // Auto-scroll every 4 seconds
}

// Stop auto-scroll
function stopCarouselAutoScroll() {
  if (carouselAutoInterval) {
    clearInterval(carouselAutoInterval);
    carouselAutoInterval = null;
  }
}

// Add touch support for carousel
function addCarouselTouchSupport() {
  const carousel = document.getElementById('productCarousel');
  if (!carousel) return;
  
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  
  // Touch start
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    stopCarouselAutoScroll();
  }, { passive: true });
  
  // Touch move
  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    // Prevent vertical scrolling if horizontal swipe is detected
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Touch end
  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide(); // Swipe left - next slide
      } else {
        previousSlide(); // Swipe right - previous slide
      }
    }
    
    isDragging = false;
    startCarouselAutoScroll();
  }, { passive: true });
  
  // Mouse support for desktop
  let isMouseDown = false;
  let mouseStartX = 0;
  
  carousel.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isMouseDown = true;
    stopCarouselAutoScroll();
    e.preventDefault();
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
  });
  
  carousel.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    
    const diffX = mouseStartX - e.clientX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }
    
    isMouseDown = false;
    startCarouselAutoScroll();
  });
  
  carousel.addEventListener('mouseleave', () => {
    isMouseDown = false;
    startCarouselAutoScroll();
  });
  
  // Pause auto-scroll on hover
  carousel.addEventListener('mouseenter', () => {
    stopCarouselAutoScroll();
  });
  
  carousel.addEventListener('mouseleave', () => {
    startCarouselAutoScroll();
  });
}

// Update subcategory card to use first image from images array
function createSubcategoryCard(subcategory) {
  const card = document.createElement('div');
  card.className = 'subcategory-card';
  
  const stars = generateStars(subcategory.rating);
  const firstImage = subcategory.images ? subcategory.images[0] : subcategory.image;
  
  card.innerHTML = `
    <div class="subcategory-image">
      <img src="${firstImage}" alt="${subcategory.name}" loading="lazy">
    </div>
    <div class="subcategory-info">
      <h3>${subcategory.name}</h3>
      <div class="subcategory-rating">
        ${stars}
      </div>
      <p>${subcategory.description.substring(0, 100)}...</p>
    </div>
  `;

  card.addEventListener('click', () => {
    showProductDetail(subcategory);
  });

  return card;
}

// Export functions for potential external use
window.VastraKalaCatalog = {
  showCategories,
  showSubcategories,
  showProductDetail,
  loadCatalogData
};

