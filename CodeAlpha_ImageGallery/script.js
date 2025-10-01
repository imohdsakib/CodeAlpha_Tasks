// Image Gallery JavaScript

class ImageGallery {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightboxImg');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.closeBtn = document.getElementById('closeBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.currentImageIndex = 0;
        this.filteredImages = Array.from(this.galleryItems);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupImageLoadAnimation();
        this.setupFilterAnimation();
    }

    setupEventListeners() {
        // Gallery item click events
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });

        // Lightbox controls
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });

        // Click outside to close lightbox
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterImages(btn.dataset.filter);
                this.setActiveFilter(btn);
            });
        });

        // Prevent context menu on images
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }

    setupImageLoadAnimation() {
        const images = document.querySelectorAll('.gallery-item img');
        
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    setupFilterAnimation() {
        // Add initial animation delay to gallery items
        this.galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    openLightbox(index) {
        // Update filtered images based on current filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        this.updateFilteredImages(activeFilter);
        
        // Find the correct index in filtered images
        const clickedItem = this.galleryItems[index];
        const filteredIndex = this.filteredImages.indexOf(clickedItem);
        
        if (filteredIndex !== -1) {
            this.currentImageIndex = filteredIndex;
            this.updateLightboxImage();
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Add a small delay before hiding to allow animation
        setTimeout(() => {
            if (!this.lightbox.classList.contains('active')) {
                this.lightbox.style.display = 'none';
            }
        }, 300);
    }

    prevImage() {
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.filteredImages.length - 1;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = this.currentImageIndex < this.filteredImages.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const currentItem = this.filteredImages[this.currentImageIndex];
        const img = currentItem.querySelector('img');
        
        // Fade out current image
        this.lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            this.lightboxImg.src = img.src;
            this.lightboxImg.alt = img.alt;
            this.lightboxCaption.textContent = img.alt;
            
            // Fade in new image
            this.lightboxImg.style.opacity = '1';
        }, 150);

        // Show/hide navigation buttons based on availability
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        // Always show buttons but add visual feedback
        this.prevBtn.style.opacity = this.filteredImages.length > 1 ? '1' : '0.5';
        this.nextBtn.style.opacity = this.filteredImages.length > 1 ? '1' : '0.5';
    }

    filterImages(category) {
        this.galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                item.classList.remove('hide');
                item.classList.add('show');
                // Reset animation delay for filtered items
                setTimeout(() => {
                    item.style.display = 'block';
                }, 50);
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400);
            }
        });

        // Update filtered images array
        this.updateFilteredImages(category);
        
        // Add staggered animation to visible items
        this.animateFilteredItems();
    }

    updateFilteredImages(category) {
        this.filteredImages = Array.from(this.galleryItems).filter(item => {
            return category === 'all' || item.dataset.category === category;
        });
    }

    animateFilteredItems() {
        const visibleItems = document.querySelectorAll('.gallery-item.show');
        visibleItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'none';
            
            // Trigger reflow
            item.offsetHeight;
            
            item.style.animation = 'fadeInUp 0.6s ease-out both';
        });
    }

    setActiveFilter(activeBtn) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Lazy loading implementation
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // This triggers the load
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize for responsive adjustments
const handleResize = debounce(() => {
    // Recalculate grid if needed
    const gallery = document.querySelector('.gallery-grid');
    if (gallery) {
        gallery.style.opacity = '0';
        setTimeout(() => {
            gallery.style.opacity = '1';
        }, 100);
    }
}, 250);

// Touch/swipe support for mobile devices
class TouchHandler {
    constructor(gallery) {
        this.gallery = gallery;
        this.startX = 0;
        this.startY = 0;
        this.minSwipeDistance = 50;
        
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const lightbox = this.gallery.lightbox;
        
        lightbox.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - this.startX;
            const deltaY = endY - this.startY;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
                if (deltaX > 0) {
                    this.gallery.prevImage();
                } else {
                    this.gallery.nextImage();
                }
            }
        }, { passive: true });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the gallery
    const gallery = new ImageGallery();
    
    // Initialize touch handler for mobile
    new TouchHandler(gallery);
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Add resize handler
    window.addEventListener('resize', handleResize);
    
    // Add loading animation to the page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Preload first few images for better performance
    const firstImages = document.querySelectorAll('.gallery-item img');
    Array.from(firstImages).slice(0, 6).forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can add a service worker here for caching
        console.log('Gallery loaded successfully!');
    });
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageGallery, TouchHandler };
}
