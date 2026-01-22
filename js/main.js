// De'Longhi PLP Main Application

// State
let activeFilter = "all";
let compareList = [];
let cartCount = 0;

// DOM Elements
const app = document.querySelector(".app");
const productGrid = document.querySelector(".product-grid");
const filterButtons = document.querySelectorAll(".quick-filter[data-filter]");
const comparisonBar = document.querySelector(".comparison-bar");
const cartBadge = document.querySelector(".header__cart-badge");
const toast = document.querySelector(".toast");

// Initialize
function init() {
  renderProducts();
  bindEvents();
}

// Render Products with USP cards intercalated
function renderProducts() {
  productGrid.innerHTML = "";

  const filteredProducts = filterProducts(products, activeFilter);

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">${getIcon("search")}</div>
        <h3 class="empty-state__title">No machines found</h3>
        <p class="empty-state__text">Try adjusting your filters</p>
      </div>
    `;
    return;
  }

  let productIndex = 0;

  filteredProducts.forEach((product, index) => {
    // Check if we should insert a USP card before this product
    const uspCard = uspCards.find((usp) => usp.position === index + 1);
    if (uspCard && activeFilter === "all") {
      productGrid.appendChild(createUSPCard(uspCard));
    }

    productGrid.appendChild(createProductCard(product));
    productIndex++;
  });

  // Add remaining USP cards if we have fewer products
  if (activeFilter === "all") {
    uspCards.forEach((usp) => {
      if (usp.position > filteredProducts.length) {
        productGrid.appendChild(createUSPCard(usp));
      }
    });
  }
}

// Filter products
function filterProducts(products, filter) {
  if (filter === "all") return products;
  return products.filter((p) => p.filters.includes(filter));
}

// Create Product Card
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = product.id;

  const isInCompare = compareList.includes(product.id);

  card.innerHTML = `
    <div class="product-card__image-container">
      <div class="product-card__tags">
        ${product.tags
          .map(
            (tag) => `
          <span class="product-card__tag product-card__tag--${getTagClass(tag)}">
            ${formatTag(tag)}
          </span>
        `,
          )
          .join("")}
      </div>
      <button class="product-card__compare ${isInCompare ? "active" : ""}"
              data-product-id="${product.id}"
              aria-label="Add to compare">
        <span class="product-card__compare__text--inactive">Compare</span>
        <span class="product-card__compare__text--active">Selected</span>
        <img src="assets/icons/checkCircle.svg" alt="" width="16" height="16" class="product-card__compare__icon--active">
        <img src="assets/icons/circleHalf.svg" alt="" width="16" height="16" class="product-card__compare__icon--default">
      </button>
      <img class="product-card__image"
           src="${product.image}"
           alt="${product.name}"
           loading="lazy">
    </div>
    <div class="product-card__content">
      <div class="product-card__info">
        <h2 class="product-card__name">${product.name}</h2>
        <div class="product-card__features">
          ${product.features
            .slice(0, 4)
            .map(
              (f) => `
            <span class="product-card__feature">
              <img src="assets/icons/${f.icon}.svg" alt="" width="14" height="14">
              ${f.label}
            </span>
          `,
            )
            .join("")}
        </div>
        <div class="product-card__meta">
          <div class="product-card__rating">
            <img src="assets/icons/topRated.svg" alt="" width="10" height="11">
            <span class="product-card__rating-score">${product.rating}/5</span>
            <span class="product-card__rating-count">${product.reviewCount}</span>
          </div>
          <div class="product-card__colors" data-product-id="${product.id}">
            ${product.colors
              .slice(0, 4)
              .map(
                (color, i) => `
              <button class="product-card__color${i === 0 ? " product-card__color--active" : ""}${isLightColor(color) ? " product-card__color--light" : ""}"
                      style="--color-swatch: ${color}"
                      data-color-index="${i}"
                      aria-label="Select color ${i + 1}"></button>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="product-card__footer">
        <div class="product-card__divider"></div>
        <div class="product-card__pricing">
          <div class="product-card__price-block">
            <div class="product-card__price">
              €${formatPrice(product.price)}${product.originalPrice ? `<span class="product-card__price-original">€${formatPrice(product.originalPrice)}</span>` : ""}
            </div>
            <div class="product-card__klarna">Or €${formatPrice(product.monthlyPrice)}/mo for 3 months</div>
          </div>
          <button class="product-card__add-to-cart" data-product-id="${product.id}">
            <img src="assets/icons/cart.svg" alt="" width="12" height="12">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  `;

  return card;
}

// Create USP Card
function createUSPCard(usp) {
  const card = document.createElement("div");
  card.className = `usp-card usp-card--${usp.theme}`;

  card.innerHTML = `
    <img src="${usp.illustration}" alt="" class="usp-card__illustration">
    <div class="usp-card__content">
      <h3 class="usp-card__title">${usp.title}</h3>
      <div class="usp-card__items">
        ${usp.items
          .map(
            (item) => `
          <div class="usp-card__item">
            <img src="assets/icons/${item.icon}.svg" alt="" class="usp-card__item-icon" width="24" height="24">
            <span class="usp-card__item-title">${item.title}</span>
            <p class="usp-card__item-desc">${item.desc}</p>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  return card;
}

// Format helpers
function formatPrice(price) {
  return price.toFixed(2).replace(".", ",");
}

// Check if a color is light (for border visibility)
function isLightColor(color) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 180;
}

function formatTag(tag) {
  if (tag.startsWith("-")) return tag;
  if (tag === "new") return "New";
  if (tag === "best-seller") return "Best Seller";
  if (tag === "welcome-pack") return "Welcome Pack";
  if (tag === "nespresso") return "Nespresso";
  return tag;
}

function getTagClass(tag) {
  if (tag.startsWith("-")) return "discount";
  if (tag === "new" || tag === "best-seller") return "new";
  return "new";
}

// Event Bindings
function bindEvents() {
  // Filter clicks
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", handleFilterClick);
  });

  // Product grid delegated events
  productGrid.addEventListener("click", (e) => {
    const compareBtn = e.target.closest(".product-card__compare");
    const addToCartBtn = e.target.closest(".product-card__add-to-cart");
    const colorBtn = e.target.closest(".product-card__color");
    const productCard = e.target.closest(".product-card");

    // Handle compare button click
    if (compareBtn) {
      handleCompareClick(compareBtn);
      return;
    }

    // Handle add to cart button click
    if (addToCartBtn) {
      handleAddToCart(addToCartBtn);
      return;
    }

    // Handle color swatch click
    if (colorBtn) {
      handleColorClick(colorBtn);
      return;
    }

    // Handle card click (navigate to PDP)
    if (productCard) {
      handleCardClick(productCard);
    }
  });

  // Comparison bar events
  comparisonBar?.addEventListener("click", (e) => {
    // Handle click on filled slot or remove button
    const filledSlot = e.target.closest(".comparison-bar__slot--filled");
    if (filledSlot) {
      const removeBtn = filledSlot.querySelector(
        ".comparison-bar__slot-remove",
      );
      if (removeBtn) {
        const productId = parseInt(removeBtn.dataset.productId);
        removeFromCompare(productId);
      }
      return;
    }
  });

  // Orientation card clicks
  document.querySelectorAll(".orientation-card").forEach((card) => {
    card.addEventListener("click", handleOrientationClick);
  });
}

// Filter handling
function handleFilterClick(e) {
  const filter = e.currentTarget.dataset.filter;

  // Update active state
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  e.currentTarget.classList.add("active");

  // Animate products out
  const cards = productGrid.querySelectorAll(".product-card, .usp-card");
  cards.forEach((card) => card.classList.add("hiding"));

  // Update filter and re-render
  setTimeout(() => {
    activeFilter = filter;
    renderProducts();
  }, 200);
}

// Compare handling
function handleCompareClick(btn) {
  const productId = parseInt(btn.dataset.productId);

  if (compareList.includes(productId)) {
    removeFromCompare(productId);
  } else if (compareList.length < 3) {
    addToCompare(productId);
  } else {
    showToast("Max 3 products to compare");
  }
}

function addToCompare(productId) {
  compareList.push(productId);
  updateCompareUI();
}

function removeFromCompare(productId) {
  compareList = compareList.filter((id) => id !== productId);
  updateCompareUI();
}

function updateCompareUI() {
  // Update card buttons
  document.querySelectorAll(".product-card__compare").forEach((btn) => {
    const id = parseInt(btn.dataset.productId);
    btn.classList.toggle("active", compareList.includes(id));
  });

  // Update comparison bar
  updateComparisonBar();
}

function updateComparisonBar() {
  if (!comparisonBar) return;

  const slots = comparisonBar.querySelector(".comparison-bar__slots");
  const compareBtn = comparisonBar.querySelector(".comparison-bar__compare");

  // Show/hide bar
  if (compareList.length > 0) {
    comparisonBar.classList.add("visible");
  } else {
    comparisonBar.classList.remove("visible");
    return;
  }

  // Update button state based on number of items
  if (compareBtn) {
    if (compareList.length < 2) {
      compareBtn.disabled = true;
      compareBtn.classList.add("comparison-bar__compare--disabled");
      compareBtn.textContent = "Add one more";
    } else {
      compareBtn.disabled = false;
      compareBtn.classList.remove("comparison-bar__compare--disabled");
      compareBtn.textContent = "Compare";
    }
  }

  // Render slots
  let slotsHTML = "";

  for (let i = 0; i < 3; i++) {
    if (compareList[i]) {
      const product = products.find((p) => p.id === compareList[i]);
      slotsHTML += `
        <div class="comparison-bar__slot comparison-bar__slot--filled">
          <img class="comparison-bar__slot-image"
               src="${product.image}"
               alt="${product.name}">
          <button class="comparison-bar__slot-remove" data-product-id="${product.id}">
            <img src="assets/icons/iconClose.svg" alt="Remove" width="10" height="10">
          </button>
        </div>
      `;
    } else {
      slotsHTML += `
        <div class="comparison-bar__slot">
          <span class="comparison-bar__slot-placeholder">–</span>
        </div>
      `;
    }
  }

  slots.innerHTML = slotsHTML;
}

// Color selection
function handleColorClick(btn) {
  const colorsContainer = btn.closest(".product-card__colors");
  const productId = parseInt(colorsContainer.dataset.productId);
  const colorIndex = parseInt(btn.dataset.colorIndex);
  const product = products.find((p) => p.id === productId);

  // Update active state
  colorsContainer.querySelectorAll(".product-card__color").forEach((c) => {
    c.classList.remove("product-card__color--active");
  });
  btn.classList.add("product-card__color--active");

  // Update product image if we have color-specific images
  if (product.colorImages && product.colorImages[colorIndex]) {
    const card = btn.closest(".product-card");
    const img = card.querySelector(".product-card__image");
    const newSrc = product.colorImages[colorIndex];

    // Only transition if image is different
    if (img.src.endsWith(newSrc) || img.getAttribute("src") === newSrc) return;

    // Add blur, scale, opacity transition
    img.style.filter = "blur(8px)";
    img.style.opacity = "0";
    img.style.transform = "scale(0.95)";
    img.style.transition =
      "filter 80ms ease-out, opacity 80ms ease-out, transform 80ms ease-out";

    setTimeout(() => {
      img.src = newSrc;
      img.onload = () => {
        img.style.filter = "blur(0)";
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      };
    }, 80);
  }
}

// Add to cart
function handleAddToCart(btn) {
  const productId = parseInt(btn.dataset.productId);
  const product = products.find((p) => p.id === productId);

  // Update cart count
  cartCount++;
  updateCartBadge();

  // Show toast
  showToast(`${product.name} added to cart`);
}

function updateCartBadge() {
  if (!cartBadge) return;

  cartBadge.textContent = cartCount;
  cartBadge.classList.add("visible");

  // Bounce animation
  cartBadge.parentElement.classList.add("cart-bounce");
  setTimeout(() => {
    cartBadge.parentElement.classList.remove("cart-bounce");
  }, 300);
}

// Toast
function showToast(message) {
  if (!toast) return;

  toast.innerHTML = `
    ${getIcon("check")}
    <span>${message}</span>
  `;

  toast.classList.add("visible");

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}

// Orientation card handling
function handleOrientationClick(e) {
  const card = e.currentTarget;
  const type = card.dataset.type;

  switch (type) {
    case "sale":
      // Activate sale filter
      const saleFilter = document.querySelector('[data-filter="on-sale"]');
      if (saleFilter) saleFilter.click();
      break;
    case "quiz":
      // TODO: Open quiz modal
      showToast("Quiz coming soon");
      break;
    case "welcome":
      // TODO: Open welcome pack modal
      showToast("Welcome pack info coming soon");
      break;
  }
}

// Product card click - navigate to PDP
function handleCardClick(card) {
  const productId = parseInt(card.dataset.productId);

  // Map product IDs to their PDP pages
  const pdpPages = {
    1: "pdp.html", // Rivelia
  };

  const pdpUrl = pdpPages[productId];

  if (pdpUrl) {
    // Navigate to PDP
    window.location.href = pdpUrl;
  }
}

// Start the app
document.addEventListener("DOMContentLoaded", init);
