const API_URL = 'http://localhost:5000/gallery';

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const themeToggle = document.getElementById('themeToggle');
const emptyState = document.getElementById('emptyState');
const currentYear = document.getElementById('currentYear');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const closeLightboxBtn = document.getElementById('closeLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxDate = document.getElementById('lightboxDate');

// State
let allImages = [];
let debounceTimeout;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  currentYear.textContent = new Date().getFullYear();
  initTheme();
  fetchGallery();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Theme Toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Search with Debounce
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      handleSearch(e.target.value.trim());
    }, 400);
  });

  // Category Filtering
  categoryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      // Update active class
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      const category = e.target.dataset.category;
      handleFilter(category);
    }
  });

  // Lightbox Close
  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-overlay')) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Fetch Gallery Data from API
async function fetchGallery() {
  showSkeletons(8); // Show 8 skeletons initially
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch data');
    
    allImages = await response.json();
    renderGallery(allImages);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: red;">Error loading gallery. Is the backend running?</div>`;
  }
}

// Search Handler
async function handleSearch(query) {
  if (!query) {
    // If empty, fetch all or apply current filter
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    handleFilter(activeCategory);
    return;
  }

  showSkeletons(4);
  try {
    const response = await fetch(`${API_URL}/search?title=${encodeURIComponent(query)}`);
    const data = await response.json();
    renderGallery(data);
    
    // Reset category filter visual to "All" when searching
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-category="All"]').classList.add('active');
  } catch (error) {
    console.error('Error searching:', error);
  }
}

// Filter Handler
async function handleFilter(category) {
  searchInput.value = ''; // Clear search when filtering
  showSkeletons(4);
  
  try {
    let url = API_URL;
    if (category !== 'All') {
      url = `${API_URL}?category=${encodeURIComponent(category)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    renderGallery(data);
  } catch (error) {
    console.error('Error filtering:', error);
  }
}

// Render Gallery Grid
function renderGallery(images) {
  galleryGrid.innerHTML = '';
  
  if (images.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    
    images.forEach(imgData => {
      const card = createCard(imgData);
      galleryGrid.appendChild(card);
    });
    
    // Setup lazy loading for newly added images
    setupLazyLoading();
  }
}

// Create individual card element
function createCard(data) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = data._id;
  
  // Format date
  const date = new Date(data.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  card.innerHTML = `
    <div class="card-img-wrapper">
      <img data-src="${data.image_url}" alt="${data.title}" class="card-img lazy" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E">
      <div class="card-overlay">
        <span><i class="fa-solid fa-expand"></i> View Project</span>
      </div>
    </div>
    <div class="card-content">
      <span class="badge">${data.category}</span>
      <h3 class="card-title">${data.title}</h3>
      <p class="card-desc">${data.description}</p>
    </div>
  `;

  // Add click event for lightbox
  card.addEventListener('click', () => openLightbox(data, date));

  return card;
}

// Show Skeleton Loaders
function showSkeletons(count) {
  galleryGrid.innerHTML = '';
  emptyState.classList.add('hidden');
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'card skeleton-card skeleton';
    galleryGrid.appendChild(skeleton);
  }
}

// Lazy Loading with Intersection Observer
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// Lightbox Logic
function openLightbox(data, date) {
  lightboxImg.src = data.image_url;
  lightboxTitle.textContent = data.title;
  lightboxDesc.textContent = data.description;
  lightboxCategory.textContent = data.category;
  lightboxDate.textContent = date;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear src after animation completes to avoid glitch
  setTimeout(() => {
    if (!lightbox.classList.contains('active')) {
      lightboxImg.src = '';
    }
  }, 400);
}

// Theme Logic (Dark/Light)
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}
