// De'Longhi PDP Main Application

// Product Data
const pdpProduct = {
  id: 1,
  name: "Rivelia",
  subtitle: "Fully Automatic",
  price: 819.9,
  monthlyPrice: 273.3,
  rating: 4.1,
  reviewCount: "1.1k",
  colors: [
    {
      name: "Pebble Grey",
      hex: "#D4C4B0",
      image: "assets/products/rivelia.png",
    },
    {
      name: "Sage Green",
      hex: "#838877",
      image: "assets/products/rivelia-sage.png",
    },
    {
      name: "Navy Blue",
      hex: "#082141",
      image: "assets/products/rivelia-dark.png",
    },
    {
      name: "Silver",
      hex: "#b4b4b4",
      image: "assets/products/rivelia-grey.png",
    },
  ],
  galleryImages: [
    null, // Slot 0: uses current variant image
    "assets/products/rivelia-PDP/rivelia-2.mp4",
    "assets/products/rivelia-PDP/rivelia-3.jpg",
    "assets/products/rivelia-PDP/rivelia-4.jpg",
    "assets/products/rivelia-PDP/rivelia-5.jpg",
  ],
};

// Gallery State
const galleryState = {
  currentIndex: 0,
  realIndex: 1,
  currentColorIndex: 0,
  autoplayInterval: null,
  autoplayDuration: 10000,
  isPaused: false,
  touchStartX: 0,
  touchCurrentX: 0,
  isDragging: false,
  slideCount: 5,
  slideWidth: 0,
  isTransitioning: false,
};

// Lightbox State
const lightboxState = {
  isOpen: false,
  currentIndex: 0,
  scale: 1,
  minScale: 1,
  maxScale: 4,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  isPinching: false,
  startX: 0,
  startY: 0,
  startTranslateX: 0,
  startTranslateY: 0,
  startDistance: 0,
  startScale: 1,
  lastTap: 0,
};

// Cart State
let cartCount = 0;

// DOM Elements
let heroGallery, heroSlides, heroIndicators;
let variantsList;
let addToCartBtn,
  stickyBar,
  stickyBarImage,
  stickyBarVariant,
  stickyAddToCartBtn;
let pdpCtaSection;
let lightbox,
  lightboxContent,
  lightboxWrapper,
  lightboxImage,
  lightboxClose,
  lightboxNav,
  lightboxCounter;
let toast, cartBadge;

// Initialize
function init() {
  cacheDOM();
  setupInfiniteGallery();
  bindEvents();
  setupIntersectionObserver();
  startAutoplay();
}

// Cache DOM elements
function cacheDOM() {
  heroGallery = document.getElementById("heroGallery");
  heroSlides = document.getElementById("heroSlides");
  heroIndicators = document.getElementById("heroIndicators");
  variantsList = document.getElementById("variantsList");
  addToCartBtn = document.getElementById("addToCartBtn");
  stickyBar = document.getElementById("stickyBar");
  stickyBarImage = document.getElementById("stickyBarImage");
  stickyBarVariant = document.getElementById("stickyBarVariant");
  stickyAddToCartBtn = document.getElementById("stickyAddToCartBtn");
  pdpCtaSection = document.getElementById("pdpCtaSection");

  // Lightbox elements
  lightbox = document.getElementById("lightbox");
  lightboxContent = document.getElementById("lightboxContent");
  lightboxWrapper = document.getElementById("lightboxWrapper");
  lightboxImage = document.getElementById("lightboxImage");
  lightboxClose = document.getElementById("lightboxClose");
  lightboxNav = document.getElementById("lightboxNav");
  lightboxCounter = document.getElementById("lightboxCounter");

  toast = document.querySelector(".toast");
  cartBadge = document.querySelector(".header__cart-badge");
}

// Setup infinite gallery with clones
function setupInfiniteGallery() {
  if (!heroGallery || !heroSlides) return;

  galleryState.slideWidth = heroGallery.offsetWidth;

  const slides = heroSlides.querySelectorAll(".pdp-hero__slide");
  if (slides.length === 0) return;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.classList.add("pdp-hero__slide--clone");
  lastClone.classList.add("pdp-hero__slide--clone");

  heroSlides.appendChild(firstClone);
  heroSlides.insertBefore(lastClone, slides[0]);

  galleryState.realIndex = 1;
  updateSlidePosition(false);

  heroSlides.addEventListener("transitionend", handleTransitionEnd);

  window.addEventListener("resize", () => {
    galleryState.slideWidth = heroGallery.offsetWidth;
    updateSlidePosition(false);
  });
}

// Bind Events
function bindEvents() {
  // Gallery events
  if (heroGallery) {
    heroGallery.addEventListener("touchstart", handleGalleryTouchStart, {
      passive: true,
    });
    heroGallery.addEventListener("touchmove", handleGalleryTouchMove, {
      passive: false,
    });
    heroGallery.addEventListener("touchend", handleGalleryTouchEnd, {
      passive: true,
    });
    heroGallery.addEventListener("click", openLightbox);
  }

  if (heroIndicators) {
    heroIndicators.addEventListener("click", handleIndicatorClick);
  }

  if (variantsList) {
    variantsList.addEventListener("click", handleVariantClick);
  }

  if (addToCartBtn) addToCartBtn.addEventListener("click", handleAddToCart);
  if (stickyAddToCartBtn)
    stickyAddToCartBtn.addEventListener("click", handleAddToCart);

  // Lightbox events
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNav)
    lightboxNav.addEventListener("click", handleLightboxNavClick);
  if (lightboxContent) {
    lightboxContent.addEventListener("touchstart", handleLightboxTouchStart, {
      passive: false,
    });
    lightboxContent.addEventListener("touchmove", handleLightboxTouchMove, {
      passive: false,
    });
    lightboxContent.addEventListener("touchend", handleLightboxTouchEnd, {
      passive: true,
    });
  }

  // FAQ, cross-sell, reviews
  document.querySelectorAll(".pdp-faq__question").forEach((btn) => {
    btn.addEventListener("click", handleFaqClick);
  });
  document.querySelectorAll(".pdp-cross-sell__add").forEach((btn) => {
    btn.addEventListener("click", handleCrossSellAdd);
  });
  document.querySelectorAll(".pdp-review-filter").forEach((btn) => {
    btn.addEventListener("click", handleReviewFilterClick);
  });

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

// ==========================================
// GALLERY FUNCTIONS
// ==========================================

function startAutoplay() {
  stopAutoplay();
  galleryState.isPaused = false;
  resetIndicatorAnimation(galleryState.currentIndex);

  galleryState.autoplayInterval = setInterval(() => {
    if (!galleryState.isPaused && !galleryState.isTransitioning) {
      goToNextSlide();
    }
  }, galleryState.autoplayDuration);
}

function stopAutoplay() {
  if (galleryState.autoplayInterval) {
    clearInterval(galleryState.autoplayInterval);
    galleryState.autoplayInterval = null;
  }
}

function pauseAutoplay() {
  galleryState.isPaused = true;
  const activeIndicator = heroIndicators?.querySelector(
    ".pdp-hero__indicator--active",
  );
  if (activeIndicator)
    activeIndicator.classList.add("pdp-hero__indicator--paused");
}

function resumeAutoplay() {
  galleryState.isPaused = false;
  const activeIndicator = heroIndicators?.querySelector(
    ".pdp-hero__indicator--active",
  );
  if (activeIndicator)
    activeIndicator.classList.remove("pdp-hero__indicator--paused");
}

function resetIndicatorAnimation(index) {
  const indicators = heroIndicators?.querySelectorAll(".pdp-hero__indicator");
  if (!indicators) return;

  indicators.forEach((indicator, i) => {
    const fill = indicator.querySelector(".pdp-hero__indicator-fill");
    if (!fill) return;

    if (i < index) {
      indicator.classList.add("pdp-hero__indicator--visited");
      indicator.classList.remove("pdp-hero__indicator--active");
    } else if (i === index) {
      indicator.classList.add("pdp-hero__indicator--active");
      indicator.classList.remove(
        "pdp-hero__indicator--visited",
        "pdp-hero__indicator--paused",
      );
      fill.style.animation = "none";
      fill.offsetHeight;
      fill.style.animation = "";
    } else {
      indicator.classList.remove(
        "pdp-hero__indicator--active",
        "pdp-hero__indicator--visited",
      );
      fill.style.width = "0%";
    }
  });
}

function updateSlidePosition(animate = true) {
  if (!heroSlides) return;

  const offset = -galleryState.realIndex * galleryState.slideWidth;

  if (animate) {
    heroSlides.style.transition =
      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    galleryState.isTransitioning = true;
  } else {
    heroSlides.style.transition = "none";
  }

  heroSlides.style.transform = `translateX(${offset}px)`;
}

function handleTransitionEnd() {
  galleryState.isTransitioning = false;
  const totalSlides = galleryState.slideCount + 2;

  if (galleryState.realIndex >= totalSlides - 1) {
    galleryState.realIndex = 1;
    updateSlidePosition(false);
  }

  if (galleryState.realIndex <= 0) {
    galleryState.realIndex = galleryState.slideCount;
    updateSlidePosition(false);
  }
}

function goToSlide(index, animate = true) {
  if (galleryState.isTransitioning) return;

  galleryState.currentIndex = index;
  galleryState.realIndex = index + 1;

  updateSlidePosition(animate);
  updateIndicators(index);
  handleVideoPlayback(index);
  startAutoplay();
}

function goToNextSlide() {
  if (galleryState.isTransitioning) return;

  galleryState.realIndex++;
  galleryState.currentIndex =
    (galleryState.currentIndex + 1) % galleryState.slideCount;

  if (galleryState.currentIndex === 0) resetAllIndicators();

  updateSlidePosition(true);
  updateIndicators(galleryState.currentIndex);
  handleVideoPlayback(galleryState.currentIndex);
  resetIndicatorAnimation(galleryState.currentIndex);
}

function goToPrevSlide() {
  if (galleryState.isTransitioning) return;

  galleryState.realIndex--;
  galleryState.currentIndex =
    (galleryState.currentIndex - 1 + galleryState.slideCount) %
    galleryState.slideCount;

  updateSlidePosition(true);
  updateIndicators(galleryState.currentIndex);
  handleVideoPlayback(galleryState.currentIndex);
  resetIndicatorAnimation(galleryState.currentIndex);
  startAutoplay();
}

function handleVideoPlayback(activeIndex) {
  const slides = heroSlides?.querySelectorAll(".pdp-hero__slide");
  if (!slides) return;

  slides.forEach((slide) => {
    const video = slide.querySelector(".pdp-hero__video");
    if (video) {
      const slideIndex = parseInt(slide.dataset.index);
      if (slideIndex === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  });
}

function resetAllIndicators() {
  const indicators = heroIndicators?.querySelectorAll(".pdp-hero__indicator");
  if (!indicators) return;

  indicators.forEach((indicator) => {
    indicator.classList.remove(
      "pdp-hero__indicator--visited",
      "pdp-hero__indicator--active",
    );
    const fill = indicator.querySelector(".pdp-hero__indicator-fill");
    if (fill) fill.style.width = "0%";
  });
}

function updateIndicators(activeIndex) {
  const indicators = heroIndicators?.querySelectorAll(".pdp-hero__indicator");
  if (!indicators) return;

  indicators.forEach((indicator, i) => {
    indicator.classList.toggle(
      "pdp-hero__indicator--active",
      i === activeIndex,
    );
  });
}

// Gallery touch handling
function handleGalleryTouchStart(e) {
  if (galleryState.isTransitioning) return;

  galleryState.touchStartX = e.touches[0].clientX;
  galleryState.touchCurrentX = e.touches[0].clientX;
  galleryState.isDragging = true;

  if (heroSlides) heroSlides.style.transition = "none";
  pauseAutoplay();
}

function handleGalleryTouchMove(e) {
  if (!galleryState.isDragging) return;

  galleryState.touchCurrentX = e.touches[0].clientX;
  const diff = galleryState.touchCurrentX - galleryState.touchStartX;
  const currentOffset = -galleryState.realIndex * galleryState.slideWidth;

  if (heroSlides)
    heroSlides.style.transform = `translateX(${currentOffset + diff}px)`;
  if (Math.abs(diff) > 10) e.preventDefault();
}

function handleGalleryTouchEnd() {
  if (!galleryState.isDragging) return;
  galleryState.isDragging = false;

  const diff = galleryState.touchCurrentX - galleryState.touchStartX;
  const threshold = galleryState.slideWidth * 0.2;

  if (Math.abs(diff) > threshold) {
    if (diff < 0) goToNextSlide();
    else goToPrevSlide();
  } else {
    updateSlidePosition(true);
    startAutoplay();
  }
}

function handleIndicatorClick(e) {
  const indicator = e.target.closest(".pdp-hero__indicator");
  if (!indicator) return;

  const index = parseInt(indicator.dataset.index, 10);
  if (!isNaN(index)) {
    resetAllIndicators();
    goToSlide(index);
  }
}

function handleVisibilityChange() {
  if (document.hidden) pauseAutoplay();
  else resumeAutoplay();
}

// ==========================================
// LIGHTBOX FUNCTIONS
// ==========================================

function openLightbox() {
  if (!lightbox) return;

  lightboxState.isOpen = true;
  lightboxState.currentIndex = galleryState.currentIndex;
  lightboxState.scale = 1;
  lightboxState.translateX = 0;
  lightboxState.translateY = 0;

  updateLightboxImage();
  updateLightboxIndicators();
  updateLightboxCounter();

  lightbox.classList.add("visible");
  document.body.style.overflow = "hidden";
  stopAutoplay();
}

function closeLightbox() {
  if (!lightbox) return;

  lightboxState.isOpen = false;
  lightbox.classList.remove("visible");
  document.body.style.overflow = "";
  startAutoplay();
}

function updateLightboxImage() {
  if (!lightboxImage) return;

  const index = lightboxState.currentIndex;
  let src;

  if (index === 0) {
    src = pdpProduct.colors[galleryState.currentColorIndex].image;
  } else {
    src = pdpProduct.galleryImages[index];
    // Skip video for now, use placeholder or next image
    if (src && src.endsWith(".mp4")) {
      src = pdpProduct.galleryImages[index + 1] || pdpProduct.colors[0].image;
    }
  }

  lightboxImage.src = src;
  resetLightboxZoom();
}

function updateLightboxIndicators() {
  if (!lightboxNav) return;

  const indicators = lightboxNav.querySelectorAll(".lightbox__indicator");
  indicators.forEach((ind, i) => {
    ind.classList.toggle(
      "lightbox__indicator--active",
      i === lightboxState.currentIndex,
    );
  });
}

function updateLightboxCounter() {
  if (!lightboxCounter) return;
  lightboxCounter.textContent = `${lightboxState.currentIndex + 1} / ${galleryState.slideCount}`;
}

function goToLightboxSlide(index) {
  if (index < 0 || index >= galleryState.slideCount) return;

  lightboxState.currentIndex = index;
  updateLightboxImage();
  updateLightboxIndicators();
  updateLightboxCounter();
}

function handleLightboxNavClick(e) {
  const indicator = e.target.closest(".lightbox__indicator");
  if (!indicator) return;

  const index = parseInt(indicator.dataset.index, 10);
  if (!isNaN(index)) goToLightboxSlide(index);
}

// Lightbox zoom and pan
function resetLightboxZoom() {
  lightboxState.scale = 1;
  lightboxState.translateX = 0;
  lightboxState.translateY = 0;
  applyLightboxTransform(true);
}

function applyLightboxTransform(animate = false) {
  if (!lightboxWrapper) return;

  if (animate) {
    lightboxWrapper.classList.remove("zooming");
  } else {
    lightboxWrapper.classList.add("zooming");
  }

  lightboxWrapper.style.transform = `translate(${lightboxState.translateX}px, ${lightboxState.translateY}px) scale(${lightboxState.scale})`;
}

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getMidpoint(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function handleLightboxTouchStart(e) {
  if (e.touches.length === 2) {
    // Pinch start
    e.preventDefault();
    lightboxState.isPinching = true;
    lightboxState.startDistance = getDistance(e.touches);
    lightboxState.startScale = lightboxState.scale;
  } else if (e.touches.length === 1) {
    // Check for double tap
    const now = Date.now();
    if (now - lightboxState.lastTap < 300) {
      // Double tap - toggle zoom
      e.preventDefault();
      if (lightboxState.scale > 1) {
        resetLightboxZoom();
      } else {
        lightboxState.scale = 2.5;
        applyLightboxTransform(true);
      }
      lightboxState.lastTap = 0;
      return;
    }
    lightboxState.lastTap = now;

    // Pan start (only if zoomed)
    if (lightboxState.scale > 1) {
      lightboxState.isDragging = true;
      lightboxState.startX = e.touches[0].clientX;
      lightboxState.startY = e.touches[0].clientY;
      lightboxState.startTranslateX = lightboxState.translateX;
      lightboxState.startTranslateY = lightboxState.translateY;
    } else {
      // Swipe to change image
      lightboxState.isDragging = true;
      lightboxState.startX = e.touches[0].clientX;
    }
  }
}

function handleLightboxTouchMove(e) {
  if (lightboxState.isPinching && e.touches.length === 2) {
    e.preventDefault();

    const currentDistance = getDistance(e.touches);
    const scaleDelta = currentDistance / lightboxState.startDistance;
    let newScale = lightboxState.startScale * scaleDelta;

    // Clamp scale
    newScale = Math.max(
      lightboxState.minScale,
      Math.min(lightboxState.maxScale, newScale),
    );
    lightboxState.scale = newScale;

    applyLightboxTransform(false);
  } else if (lightboxState.isDragging && e.touches.length === 1) {
    if (lightboxState.scale > 1) {
      // Pan while zoomed
      e.preventDefault();

      const dx = e.touches[0].clientX - lightboxState.startX;
      const dy = e.touches[0].clientY - lightboxState.startY;

      lightboxState.translateX = lightboxState.startTranslateX + dx;
      lightboxState.translateY = lightboxState.startTranslateY + dy;

      applyLightboxTransform(false);
    }
  }
}

function handleLightboxTouchEnd(e) {
  if (lightboxState.isPinching) {
    lightboxState.isPinching = false;

    // Snap to min scale if below
    if (lightboxState.scale < 1) {
      resetLightboxZoom();
    }
  } else if (lightboxState.isDragging) {
    lightboxState.isDragging = false;

    if (lightboxState.scale === 1 && e.changedTouches.length > 0) {
      // Check for swipe to change image
      const endX = e.changedTouches[0].clientX;
      const diff = endX - lightboxState.startX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (
          diff < 0 &&
          lightboxState.currentIndex < galleryState.slideCount - 1
        ) {
          goToLightboxSlide(lightboxState.currentIndex + 1);
        } else if (diff > 0 && lightboxState.currentIndex > 0) {
          goToLightboxSlide(lightboxState.currentIndex - 1);
        }
      }
    }

    // Constrain pan bounds when zoomed
    if (lightboxState.scale > 1) {
      constrainPan();
    }
  }
}

function constrainPan() {
  if (!lightboxContent || !lightboxImage) return;

  const containerRect = lightboxContent.getBoundingClientRect();
  const scaledWidth = lightboxImage.naturalWidth * lightboxState.scale;
  const scaledHeight = lightboxImage.naturalHeight * lightboxState.scale;

  const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
  const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);

  lightboxState.translateX = Math.max(
    -maxX,
    Math.min(maxX, lightboxState.translateX),
  );
  lightboxState.translateY = Math.max(
    -maxY,
    Math.min(maxY, lightboxState.translateY),
  );

  applyLightboxTransform(true);
}

// ==========================================
// VARIANT SELECTION
// ==========================================

function handleVariantClick(e) {
  const variant = e.target.closest(".pdp-variant");
  if (!variant) return;

  const index = parseInt(variant.dataset.index, 10);
  const colorName = variant.dataset.name;

  galleryState.currentColorIndex = index;

  variantsList.querySelectorAll(".pdp-variant").forEach((v) => {
    v.classList.remove("pdp-variant--active");
  });
  variant.classList.add("pdp-variant--active");

  const allSlides = heroSlides?.querySelectorAll(
    '.pdp-hero__slide[data-index="0"]',
  );
  allSlides?.forEach((slide) => {
    const img = slide.querySelector(".pdp-hero__image");
    if (img) {
      img.style.opacity = "0";
      img.style.transform = "scale(0.95)";

      setTimeout(() => {
        img.src = pdpProduct.colors[index].image;
        img.alt = `Rivelia - ${colorName}`;
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      }, 150);
    }
  });

  if (stickyBarImage) stickyBarImage.src = pdpProduct.colors[index].image;
  if (stickyBarVariant) stickyBarVariant.textContent = colorName;

  if (galleryState.currentIndex !== 0) {
    resetAllIndicators();
    goToSlide(0);
  }
}

// ==========================================
// INTERSECTION OBSERVER (Sticky Bar)
// ==========================================

function setupIntersectionObserver() {
  if (!pdpCtaSection || !stickyBar) return;

  const ctaButton = pdpCtaSection.querySelector(".pdp-cta__button");
  const targetElement = ctaButton || pdpCtaSection;
  let currentlyVisible = false;

  function checkStickyBar() {
    const ctaRect = targetElement.getBoundingClientRect();
    // Show only when CTA button is above the viewport (scrolled past it)
    const shouldShow = ctaRect.bottom < 0;

    // Only update if state actually changed
    if (shouldShow !== currentlyVisible) {
      currentlyVisible = shouldShow;
      if (shouldShow) {
        stickyBar.classList.add("visible");
      } else {
        stickyBar.classList.remove("visible");
      }
    }
  }

  // Check on scroll with throttle for performance
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkStickyBar();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  // Initial check after DOM is ready
  setTimeout(checkStickyBar, 100);
}

// ==========================================
// ADD TO CART
// ==========================================

function handleAddToCart(e) {
  cartCount++;
  updateCartBadge();
  showToast(`${pdpProduct.name} added to cart`);

  const btn = e.currentTarget;
  btn.style.transform = "scale(0.95)";
  setTimeout(() => {
    btn.style.transform = "";
  }, 150);
}

function updateCartBadge() {
  if (!cartBadge) return;
  cartBadge.textContent = cartCount;
  cartBadge.classList.add("visible");
  cartBadge.parentElement.classList.add("cart-bounce");
  setTimeout(() => {
    cartBadge.parentElement.classList.remove("cart-bounce");
  }, 300);
}

// ==========================================
// TOAST
// ==========================================

function showToast(message) {
  if (!toast) return;
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}

// ==========================================
// KEYBOARD SUPPORT
// ==========================================

function handleKeydown(e) {
  if (lightboxState.isOpen) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft" && lightboxState.currentIndex > 0) {
      goToLightboxSlide(lightboxState.currentIndex - 1);
    } else if (
      e.key === "ArrowRight" &&
      lightboxState.currentIndex < galleryState.slideCount - 1
    ) {
      goToLightboxSlide(lightboxState.currentIndex + 1);
    }
    return;
  }

  if (e.key === "ArrowLeft") goToPrevSlide();
  else if (e.key === "ArrowRight") goToNextSlide();
}

// ==========================================
// FAQ ACCORDION
// ==========================================

function handleFaqClick(e) {
  const question = e.currentTarget;
  const item = question.closest(".pdp-faq__item");

  document.querySelectorAll(".pdp-faq__item--open").forEach((openItem) => {
    if (openItem !== item) openItem.classList.remove("pdp-faq__item--open");
  });

  item.classList.toggle("pdp-faq__item--open");
}

// ==========================================
// CROSS-SELL
// ==========================================

function handleCrossSellAdd(e) {
  const btn = e.currentTarget;
  cartCount++;
  updateCartBadge();

  const item = btn.closest(".pdp-cross-sell__item");
  const name = item.querySelector(".pdp-cross-sell__name").textContent;
  showToast(`${name} added to cart`);

  btn.style.transform = "scale(0.9)";
  btn.style.background = "var(--color-bg-card)";
  setTimeout(() => {
    btn.style.transform = "";
    btn.style.background = "";
  }, 150);
}

// ==========================================
// REVIEW FILTERS
// ==========================================

function handleReviewFilterClick(e) {
  const btn = e.currentTarget;
  document.querySelectorAll(".pdp-review-filter").forEach((f) => {
    f.classList.remove("pdp-review-filter--active");
  });
  btn.classList.add("pdp-review-filter--active");
}

// Start the app
document.addEventListener("DOMContentLoaded", init);
