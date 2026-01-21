# De'Longhi PLP Mobile Prototype — Specification

**Version**: 1.0  
**Date**: January 2026  
**Figma Source**: https://www.figma.com/design/9Xza9jzi9GbhbdCWQeQkmr/Design?node-id=132-5607

---

## Overview

Pixel-perfect mobile prototype for De'Longhi's Product Listing Page (PLP).  
Target: Mobile-first (max-width: 430px — iPhone 15 Pro Max)

**Tech Stack**: HTML, CSS, JavaScript (Vanilla)  
**No frameworks** — clean, maintainable code.

---

## File Structure

```
prototype/
├── index.html              # PLP page
├── pdp.html                # PDP page (future)
├── css/
│   ├── fonts.css           # @font-face declarations
│   ├── variables.css       # CSS custom properties
│   ├── reset.css           # Minimal reset
│   ├── components.css      # Component styles
│   └── main.css            # Page-specific styles
├── js/
│   ├── data.js             # Product data
│   ├── filters.js          # Filter functionality
│   ├── compare.js          # Comparison bar logic
│   ├── cart.js             # Cart/toast functionality
│   └── main.js             # Init and orchestration
├── assets/
│   ├── icons/              # SVG icons
│   ├── products/           # Product images
│   ├── illustrations/      # USP card backgrounds
│   └── logo/               # De'Longhi logo
└── fonts/                  # Font files (already exists)
    ├── delonghi-serif/
    └── sf-pro/
```

---

## Design Tokens

### Colors

```css
:root {
  /* Primary */
  --color-navy: #082141;
  --color-navy-light: #364b66;
  --color-navy-muted: #6a7d95;
  
  /* Background */
  --color-bg: #f9f4f0;
  --color-bg-card: #ebe7e0;
  --color-bg-warm: #e8e3dc;
  
  /* Text */
  --color-text-primary: #082141;
  --color-text-secondary: rgba(8, 33, 65, 0.8);
  --color-text-muted: rgba(8, 33, 65, 0.5);
  --color-text-inverse: #f9f4f0;
  
  /* Accent */
  --color-accent-green: #888c73;
  --color-accent-brown: #754436;
  --color-accent-terracotta: #6d4439;
  
  /* UI */
  --color-border: rgba(8, 33, 65, 0.12);
  --color-border-light: rgba(255, 255, 255, 0.3);
  --color-overlay: rgba(0, 0, 0, 0.5);
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-serif: 'DeLonghi Serif', Georgia, serif;
  --font-sans: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-compact: 'SF Compact Text', -apple-system, sans-serif;
  
  /* Font Sizes */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 28px;
  --text-2xl: 40px;
  
  /* Font Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
}
```

### Spacing & Sizing

```css
:root {
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 32px;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 999px;
  
  /* Viewport */
  --viewport-max: 430px;
  --header-height: 56px;
  --trust-bar-height: 27px;
}
```

---

## Components

### 1. Trust Bar (Sticky)

**Position**: Fixed top  
**Height**: 27px  
**Background**: var(--color-navy)  
**Content**: Static text with bullet separators

```
"Free delivery over €50  •  30-day returns  •  3-year warranty"
```

**Behavior**: Always visible, sticky on scroll

---

### 2. Header

**Height**: 56px  
**Background**: Transparent (blends with page bg)

**Layout**:
- Left: Hamburger menu (40x40) + Search (40x40)
- Center: De'Longhi logo
- Right: User (40x40) + Cart with badge (40x40)

**Cart Badge**: Shows when items added, animates on add

---

### 3. Page Title

**Text**: "Coffee Machines"  
**Font**: var(--font-serif), var(--text-2xl)  
**Alignment**: Center  
**Margin**: 32px top, 24px bottom

---

### 4. Orientation Cards

**Layout**: Horizontal scroll with snap  
**Card Size**: 140 × 180px  
**Gap**: 8px  
**Padding**: 8px horizontal (page edge)  
**Border Radius**: var(--radius-lg)

**Cards**:

| # | Type | Label | Title | Background |
|---|------|-------|-------|------------|
| 1 | Sale | "SALE" | "20% off Rivelia family" | #39241e + product image |
| 2 | Quiz | "WHICH ONE?" | "Find the right one for you." | #808080 + illustration |
| 3 | Welcome | "WELCOME PACK" | "90€ in value. Beans & care set." | #6d4439 + illustration |

**CTA**: Arrow button (→) in bottom-left, glassmorphism style

---

### 5. Quick Filters

**Layout**: Horizontal scroll, no snap  
**Height**: 36px per filter  
**Gap**: 6px  
**Padding**: 8px horizontal

**Filters**:

| Icon | Label | Filter Key | Active State |
|------|-------|------------|--------------|
| Sliders | (none) | opens-modal | — |
| — | All | all | bg: var(--color-accent-brown), text: white |
| Percent | On sale | on-sale | bg: rgba(255,255,255,0.16) |
| Lightning | Auto milk | auto-milk | bg: rgba(255,255,255,0.16) |
| Snowflake | Cold drinks | cold-drinks | bg: rgba(255,255,255,0.16) |
| Ruler | Compact size | compact | bg: rgba(255,255,255,0.08) |
| Star | Top Rated | top-rated | bg: rgba(255,255,255,0.08) |

**Behavior**: Click toggles filter, products animate (fade out/in)

---

### 6. Product Card

**Width**: Full (with 8px padding each side = 377px content on 393px screen)  
**Height**: ~520px (flexible)  
**Background**: var(--color-bg-card)  
**Border Radius**: var(--radius-lg)

**Structure**:

```
┌─────────────────────────────────────┐
│ [Tags]                    [Compare] │  <- Absolute positioned
│                                     │
│         [Product Image]             │  <- 350px height, mix-blend-multiply
│                                     │
├─────────────────────────────────────┤
│ Product Name                        │  <- DeLonghi Serif, 28px
│ ✋ Manual  ⚙️ Feature  ☕ Feature    │  <- Feature pills with icons
│                                     │
│ ⭐ 4.1/5 · 1.1k    ● ● ● ●         │  <- Rating + Color swatches
│                                     │
│ ─────────────────────────────────── │  <- Divider
│                                     │
│ €819,90                [Add to cart]│  <- Price + CTA
│ Or €273/mo for 3 months             │  <- Klarna
└─────────────────────────────────────┘
```

**Tags** (top-left):
- "New" — bg: var(--color-accent-green)
- "Best Seller" — bg: var(--color-accent-green)
- "-22%" — bg: var(--color-navy-muted)
- Can stack horizontally

**Compare Button** (top-right):
- 36×36px, glassmorphism background
- Icon: Stacked squares
- Click adds to comparison bar

**Feature Pills**:
- Icon (14px) + Text
- Opacity 80%
- Gap 10px between pills

**Color Swatches**:
- 12px circles
- Not clickable (indicative only)
- Gap 6px

**Add to Cart**:
- bg: var(--color-navy-light)
- Icon + "Add to cart" text
- Border radius: var(--radius-sm)

---

### 7. USP Cards (Intercalated)

**3 variants**, inserted between products at strategic positions:

**Card 1: "Worth it."**
- Position: After 3rd product
- USPs: "Price match" + "€90 welcome kit"
- Background: Teal/blue with illustration

**Card 2: "New chapter."**
- Position: After 5th product
- USPs: "Trade in & save" + "Free delivery"
- Background: Terracotta with product display

**Card 3: "Peace of mind."**
- Position: After 7th product
- USPs: "3 year warranty" + "30 Days to decide"
- Background: Ocean/terracotta with coffee cup

**Structure**:
```
┌─────────────────────────────────────┐
│ Title (DeLonghi Serif)              │
│                                     │
│ 🏷️ USP Title 1    📦 USP Title 2   │
│    Subtitle 1        Subtitle 2     │
│                                     │
│         [Illustration]              │
│                                     │
└─────────────────────────────────────┘
```

---

### 8. USP Bar (Before Footer)

**Layout**: 2×2 grid  
**Padding**: 16px all sides  
**Gap**: 20px horizontal, 32px vertical

**Items**:
| Icon | Title | Subtitle |
|------|-------|----------|
| Truck | Light speed delivery | 2-4 days average |
| Box | Free delivery | On orders over €36 |
| Klarna | Pay in 3, with Klarna | Interest free |
| Return | 30 day to return | Free home collection |

---

### 9. Comparison Bar (Floating)

**Position**: Fixed bottom, centered  
**Visibility**: Hidden by default, shows when 1+ products added  
**Max products**: 3

**Design**:
```
┌──────────────────────────────────────────┐
│ [Prod1×] [Prod2×] [---]   [ Compare ]    │
└──────────────────────────────────────────┘
```

- Background: rgba(8, 33, 65, 0.8) + backdrop-blur
- Border: 1px rgba(255,255,255,0.1)
- Shadow: 0 12px 24px rgba(0,0,0,0.25)
- Border radius: 12px
- Padding: 4px

**Product Thumbnail**:
- 48×48px, rounded-8px
- X button top-right to remove

**Empty Slot**:
- Dashed border, "-" text

**Compare Button**:
- bg: var(--color-navy-muted)
- Opens comparison modal

---

### 10. Toast Notification

**Trigger**: Add to cart click  
**Position**: Top center (below trust bar)  
**Duration**: 2.5 seconds  
**Animation**: Slide down + fade in, slide up + fade out

**Content**: "Added to cart" with checkmark icon

---

### 11. Modals/Sheets

**Filter Modal**:
- Slides up from bottom
- Full filter options
- "Apply" and "Clear" buttons

**Compare Modal**:
- Slides up from bottom
- Product comparison table
- Scrollable horizontally

**Welcome Pack Modal**:
- Info about €90 value bundle
- CTA to learn more

---

## Product Data

```javascript
const products = [
  {
    id: 1,
    name: "Rivelia",
    type: "automatic",
    features: ["Automatic", "App connect", "Cold brew"],
    featureIcons: ["magic-wand", "phone", "snowflake"],
    rating: 4.1,
    reviewCount: "1.1k",
    price: 819.90,
    originalPrice: null,
    monthlyPrice: 273.30,
    colors: ["#D4C4B0", "#838877", "#082141", "#b4b4b4"],
    tags: ["new"],
    filters: ["auto-milk", "cold-drinks", "top-rated"],
    image: "rivelia.png"
  },
  {
    id: 2,
    name: "La Specialista Arte Evo",
    type: "manual",
    features: ["Manual", "Precise grinder", "Top milk creations"],
    featureIcons: ["hand", "target", "coffee"],
    rating: 4.6,
    reviewCount: "892",
    price: 467,
    originalPrice: 599.99,
    monthlyPrice: 155.67,
    colors: ["#C4A77D", "#B22222", "#2C2C2C", "#C0C0C0", "#838877"],
    tags: ["best-seller", "-22%"],
    filters: ["on-sale"],
    image: "specialista-arte-evo.png"
  },
  {
    id: 3,
    name: "Dedica Style",
    type: "manual",
    features: ["Manual", "App", "Top milk creations"],
    featureIcons: ["hand", "phone", "coffee"],
    rating: 4.6,
    reviewCount: "2.3k",
    price: 189,
    originalPrice: 209.90,
    monthlyPrice: 63,
    colors: ["#2C2C2C", "#C0C0C0", "#B22222", "#E8E8E8", "#838877"],
    tags: ["new", "-10%"],
    filters: ["on-sale", "compact"],
    image: "dedica-style.png"
  },
  {
    id: 4,
    name: "Dinamica Plus",
    type: "automatic",
    features: ["Automatic", "App", "LatteCrema©"],
    featureIcons: ["magic-wand", "phone", "coffee"],
    rating: 4.6,
    reviewCount: "562",
    price: 649.90,
    originalPrice: 949.90,
    monthlyPrice: 216.63,
    colors: ["#2C2C2C", "#838877", "#D4C4B0"],
    tags: ["best-seller"],
    filters: ["auto-milk"],
    image: "dinamica-plus.png"
  },
  {
    id: 5,
    name: "Magnifica Plus",
    type: "automatic",
    features: ["Automatic", "App", "Cold brew", "LatteCrema©"],
    featureIcons: ["magic-wand", "phone", "snowflake", "coffee"],
    rating: 4.6,
    reviewCount: "1.4k",
    price: 769.90,
    originalPrice: null,
    monthlyPrice: 256.63,
    colors: ["#2C2C2C", "#838877", "#D4C4B0"],
    tags: ["welcome-pack"],
    filters: ["auto-milk", "cold-drinks"],
    image: "magnifica-plus.png"
  },
  {
    id: 6,
    name: "PrimaDonna Aromatic",
    type: "automatic",
    features: ["Automatic", "App", "Cold brew", "Crema©"],
    featureIcons: ["magic-wand", "phone", "snowflake", "coffee"],
    rating: 4.8,
    reviewCount: "89",
    price: 1799.90,
    originalPrice: null,
    monthlyPrice: 599.97,
    colors: ["#2C2C2C", "#C0C0C0"],
    tags: ["new"],
    filters: ["auto-milk", "cold-drinks", "top-rated"],
    image: "primadonna-aromatic.png"
  },
  {
    id: 7,
    name: "Gran Lattissima",
    type: "pod",
    features: ["Coffee pod", "Crema©", "5 drinks"],
    featureIcons: ["capsule", "coffee", "coffee"],
    rating: 4.5,
    reviewCount: "342",
    price: 349,
    originalPrice: 379.90,
    monthlyPrice: 116.33,
    colors: ["#2C2C2C", "#E8E8E8"],
    tags: ["-8%", "nespresso"],
    filters: ["on-sale", "compact"],
    image: "gran-lattissima.png"
  }
];
```

---

## Interactions

### Filter Click
1. Toggle active state on clicked filter
2. If "All" clicked, deselect other filters
3. Filter products array
4. Animate: fade out → update DOM → fade in
5. Scroll to top of product list

### Compare Button Click
1. Check if product already in compare list
2. If yes, remove it (toggle off)
3. If no and list < 3, add it
4. If list = 3, show toast "Max 3 products"
5. Update comparison bar visibility
6. Animate button state

### Add to Cart Click
1. Button shows loading state (brief)
2. Cart icon in header animates (bounce + badge update)
3. Toast slides in from top
4. Toast auto-dismisses after 2.5s

### Orientation Card Click
- "Sale" → Filter products to "on-sale", scroll to grid
- "Which one?" → Open quiz sheet (future)
- "Welcome pack" → Open info modal

### Comparison Bar
- Product X click → Remove from list
- Compare click → Open comparison modal
- Bar animates in/out based on list length

---

## Animations

```css
/* Fade transition for products */
.product-card {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.product-card.hiding {
  opacity: 0;
  transform: scale(0.98);
}

/* Comparison bar */
.comparison-bar {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.comparison-bar.hidden {
  transform: translateY(100px);
}

/* Toast */
.toast {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast.hidden {
  transform: translateY(-100%);
  opacity: 0;
}

/* Cart badge */
@keyframes cart-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

---

## Implementation Plan

### Phase 1: Foundation (30 min)
- [x] Create file structure
- [ ] Set up fonts.css with @font-face
- [ ] Set up variables.css with design tokens
- [ ] Create reset.css
- [ ] Basic HTML structure

### Phase 2: Layout (45 min)
- [ ] Trust bar (sticky)
- [ ] Header with icons
- [ ] Page title
- [ ] Main content area
- [ ] Footer placeholder

### Phase 3: Components (2 hours)
- [ ] Orientation cards carousel
- [ ] Quick filters bar
- [ ] Product card component
- [ ] USP cards (3 variants)
- [ ] USP bar grid

### Phase 4: Interactivity (1.5 hours)
- [ ] Filter logic + animations
- [ ] Comparison bar + logic
- [ ] Add to cart + toast
- [ ] Modal sheets (basic structure)

### Phase 5: Polish (1 hour)
- [ ] Scroll behaviors
- [ ] Touch feedback
- [ ] Animation timing
- [ ] Pixel-perfect adjustments

### Phase 6: Assets (ongoing)
- [ ] Export all icons from Figma
- [ ] Export product images
- [ ] Export USP illustrations
- [ ] Optimize images

---

## Quiz Draft (Future Feature)

**Format**: Instagram Stories style (fullscreen, tap to advance)

**Question 1**: "How do you take your coffee?"
- ☕ Black / Espresso
- 🥛 With milk (cappuccino, latte)
- 🧊 Cold drinks too
- 🤷 I want variety

**Question 2**: "How much control do you want?"
- 🪄 One touch, done
- ⚙️ Some customization
- 🎛️ Full barista control

**Question 3**: "What's your budget?"
- 💚 Under €400
- 💛 €400 - €800
- 🧡 €800+
- 💜 Show me the best

**Question 4**: "Space matters?"
- 📏 Yes, compact please
- 🏠 I have room

**Result**: "Perfect for you: [Product Name]" → CTA to PDP

---

*Document auto-generated. Last updated: January 2026*
