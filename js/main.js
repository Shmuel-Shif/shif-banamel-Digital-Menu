/**
 * שיף בנמל — Digital Menu
 */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const header = $('#site-header');
  const categoryNavWrapper = $('#category-nav-wrapper');
  const categoryNavList = $('#category-nav-list');
  const headerNavList = $('#header-nav-list');
  const mobileNavList = $('#mobile-nav-list');
  const menuSections = $('#menu-sections');
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const categoryNavScroll = $('#category-nav-scroll');
  const foodModal = $('#food-modal');
  const foodModalBody = $('#food-modal-body');
  const foodModalClose = $('#food-modal-close');
  const foodModalBackdrop = $('#food-modal-backdrop');
  const cartToggle = $('#cart-toggle');
  const cartPanel = $('#cart-panel');
  const cartBody = $('#cart-body');
  const cartFooter = $('#cart-footer');
  const cartTotalPrice = $('#cart-total-price');
  const cartBadge = $('#cart-badge');
  const cartClose = $('#cart-close');
  const cartBackdrop = $('#cart-backdrop');
  const cartClear = $('#cart-clear');
  const cartToast = $('#cart-toast');

  const CART_STORAGE_KEY = 'shif-banamel-cart';

  let activeCategoryId = null;
  let categoryObserver = null;
  let revealObserver = null;
  let heroSlideTimer = null;
  let lastFocusedElement = null;
  let cartLastFocusedElement = null;
  let cartToastTimer = null;
  let cart = [];

  const HERO_SLIDES = [
    'assets/images/ארנצ\'יני בשר.webp',
    'assets/images/קריספי שניצל בחלה.webp',
    'assets/images/שיפצ_יקן.webp',
    'assets/images/בשר מפורק בפרנה.webp',
    'assets/images/שיפבורגר דאבל.webp',
    'assets/images/סלט פרגית במרינדה.webp',
    'assets/images/חזה עוף בצלחת.webp',
    'assets/images/כרובית מטוגנת.webp',
    'assets/images/פרגית מרינדה בחלה.webp',
    'assets/images/טבעות בצל.webp',
    'assets/images/צלחת חומוס.webp',
    'assets/images/כנפיים נשנוש.webp'
  ];

  /* ---------- Init ---------- */
  function init() {
    $('#year').textContent = new Date().getFullYear();
    buildNavigation();
    buildMenu();
    initStickyHeader();
    initCategoryNav();
    initSmoothScroll();
    initMobileMenu();
    initScrollReveal();
    initCategoryTracking();
    initHeroSlideshow();
    handleHeroAnimations();
    initFoodModal();
    initCart();
  }

  /* ---------- Build nav links ---------- */
  function buildNavigation() {
    const fragment = document.createDocumentFragment();
    const mobileFragment = document.createDocumentFragment();
    const catFragment = document.createDocumentFragment();

    MENU_DATA.categories.forEach((cat, index) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${cat.id}`;
      a.textContent = cat.title;
      a.dataset.category = cat.id;
      a.className = 'nav-link';
      li.appendChild(a);
      fragment.appendChild(li.cloneNode(true));

      const mobileLi = li.cloneNode(true);
      mobileFragment.appendChild(mobileLi);

      if (index > 0) {
        const sep = document.createElement('li');
        sep.className = 'category-nav-sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = '•';
        catFragment.appendChild(sep);
      }

      const catLi = document.createElement('li');
      const catA = a.cloneNode(true);
      catA.className = 'category-link';
      catLi.appendChild(catA);
      catFragment.appendChild(catLi);
    });

    headerNavList.appendChild(fragment);
    mobileNavList.appendChild(mobileFragment);
    categoryNavList.appendChild(catFragment);
  }

  /* ---------- Build menu HTML ---------- */
  function buildMenu() {
    const fragment = document.createDocumentFragment();

    MENU_DATA.categories.forEach((cat) => {
      const section = document.createElement('section');
      section.className = 'menu-category reveal';
      section.id = cat.id;
      section.dataset.category = cat.id;

      section.innerHTML = `
        <header class="category-header">
          <h2 class="category-title">${escapeHtml(cat.title)}</h2>
          ${cat.description ? `<p class="category-desc">${escapeHtml(cat.description)}</p>` : ''}
        </header>
      `;

      appendItemsToList(section, cat.items);

      (cat.subsections || []).forEach((sub) => {
        const subBlock = document.createElement('div');
        subBlock.className = 'menu-subsection';
        subBlock.innerHTML = `
          <h3 class="subsection-title">${escapeHtml(sub.title)}</h3>
          ${sub.description ? `<p class="subsection-desc">${escapeHtml(sub.description)}</p>` : ''}
        `;
        appendItemsToList(subBlock, sub.items, { compact: true });
        section.appendChild(subBlock);
      });

      fragment.appendChild(section);
    });

    menuSections.appendChild(fragment);
  }

  function appendItemsToList(parent, items, options = {}) {
    const list = document.createElement('ul');
    list.className = options.compact ? 'food-list food-list--compact' : 'food-list';
    list.setAttribute('role', 'list');

    items.forEach((item) => {
      list.appendChild(createFoodCard(item, options));
    });

    parent.appendChild(list);
  }

  function getCartItemId(name) {
    return String(name).trim();
  }

  function buildFoodCardMarkup(item, options = {}) {
    const hasImage = Boolean(item.image);
    const canAddToCart = item.price != null;
    const priceHtml = canAddToCart
      ? `<span class="food-price">₪${item.price}</span>`
      : '';

    const noteHtml = item.note
      ? `<span class="food-note">${escapeHtml(item.note)}</span>`
      : '';

    const imageHtml = hasImage
      ? `<div class="food-image-wrap">
           <img
             class="food-image"
             src="${escapeAttr(item.image)}"
             alt="${escapeAttr(item.name)}"
             loading="lazy"
             decoding="async"
             width="160"
             height="160"
           >
         </div>`
      : '';

    const descHtml = item.description
      ? `<p class="food-desc">${escapeHtml(item.description)}</p>`
      : '';

    const addBtnHtml = canAddToCart
      ? `<button type="button" class="food-add-btn" data-action="add-to-cart" aria-label="הוסף ${escapeAttr(item.name)} לסל">
           <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
           <span>הוסף לסל</span>
         </button>`
      : '';

    const cardClass = [
      'food-card',
      hasImage ? '' : 'food-card--no-image',
      options.compact ? 'food-card--compact' : ''
    ].filter(Boolean).join(' ');

    return {
      cardClass,
      cartId: getCartItemId(item.name),
      cartName: item.name,
      cartPrice: item.price,
      innerHtml: `
        <div class="food-content">
          <div class="food-text">
            <h3 class="food-name">${escapeHtml(item.name)}</h3>
            ${descHtml}
            <div class="food-meta">
              ${priceHtml}
              ${noteHtml}
            </div>
            ${addBtnHtml}
          </div>
          ${imageHtml}
        </div>
      `
    };
  }

  function createFoodCard(item, options = {}) {
    const li = document.createElement('li');
    li.className = options.compact ? 'food-item food-item--compact' : 'food-item';
    const { cardClass, innerHtml, cartId, cartName, cartPrice } = buildFoodCardMarkup(item, options);
    const cartAttrs = cartPrice != null
      ? `data-cart-id="${escapeAttr(cartId)}" data-cart-name="${escapeAttr(cartName)}" data-cart-price="${cartPrice}"`
      : '';

    li.innerHTML = `
      <article
        class="${cardClass}"
        ${cartAttrs}
        tabindex="0"
        role="button"
        aria-haspopup="dialog"
        aria-label="הצג פרטים על ${escapeAttr(item.name)}"
      >
        ${innerHtml}
      </article>
    `;

    return li;
  }

  /* ---------- Food modal ---------- */
  function initFoodModal() {
    if (!foodModal || !foodModalBody) return;

    menuSections.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="add-to-cart"]')) {
        event.stopPropagation();
        handleAddToCart(event.target);
        return;
      }

      const card = event.target.closest('.food-card');
      if (!card) return;
      openFoodModal(card);
    });

    menuSections.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('[data-action="add-to-cart"]')) return;

      const card = event.target.closest('.food-card');
      if (!card) return;

      event.preventDefault();
      openFoodModal(card);
    });

    foodModalBody.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="add-to-cart"]')) {
        event.stopPropagation();
        handleAddToCart(event.target);
      }
    });

    foodModalClose.addEventListener('click', closeFoodModal);
    foodModalBackdrop.addEventListener('click', closeFoodModal);
  }

  function openFoodModal(card) {
    const clone = card.cloneNode(true);
    clone.classList.remove('is-visible');
    clone.removeAttribute('tabindex');
    clone.removeAttribute('role');
    clone.removeAttribute('aria-haspopup');
    clone.removeAttribute('aria-label');

    const title = clone.querySelector('.food-name');
    if (title) {
      title.id = 'food-modal-title';
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'food-modal-content';

    if (card.dataset.cartId) {
      wrapper.dataset.cartId = card.dataset.cartId;
      wrapper.dataset.cartName = card.dataset.cartName;
      wrapper.dataset.cartPrice = card.dataset.cartPrice;
    }

    wrapper.appendChild(clone);

    if (card.dataset.cartId) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn btn-primary food-modal-add';
      addBtn.dataset.action = 'add-to-cart';
      addBtn.textContent = `הוסף לסל · ₪${card.dataset.cartPrice}`;
      wrapper.appendChild(addBtn);
    }

    foodModalBody.replaceChildren(wrapper);
    lastFocusedElement = document.activeElement;

    foodModal.hidden = false;
    foodModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    requestAnimationFrame(() => {
      foodModal.classList.add('is-open');
      foodModalClose.focus();
    });
  }

  function closeFoodModal() {
    if (foodModal.hidden) return;

    foodModal.classList.remove('is-open');
    foodModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    window.setTimeout(() => {
      if (foodModal.classList.contains('is-open')) return;

      foodModal.hidden = true;
      foodModalBody.replaceChildren();
      lastFocusedElement?.focus?.();
      lastFocusedElement = null;
    }, 280);
  }

  /* ---------- Sticky header ---------- */
  function initStickyHeader() {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          header.classList.toggle('is-scrolled', scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Category nav sticky + scroll active into view ---------- */
  function initCategoryNav() {
    const heroHeight = () => $('#hero').offsetHeight;
    const headerHeight = () => header.offsetHeight;

    const updateNavPosition = () => {
      const threshold = heroHeight() - headerHeight();
      categoryNavWrapper.classList.toggle('is-visible', window.scrollY >= threshold);
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateNavPosition);
    }, { passive: true });

    updateNavPosition();
  }

  function scrollCategoryLinkIntoView(link) {
    if (!link || !categoryNavScroll) return;
    const scrollEl = categoryNavScroll;
    const linkRect = link.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    const offset = linkRect.left - scrollRect.left - scrollRect.width / 2 + linkRect.width / 2;
    scrollEl.scrollBy({ left: offset, behavior: 'smooth' });
  }

  /* ---------- Smooth scroll ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      scrollToSection(id);
      closeMobileMenu();

      if (link.classList.contains('category-link')) {
        setActiveCategory(id);
        scrollCategoryLinkIntoView(link);
      }
    });
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const offset = getScrollOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  }

  function getScrollOffset() {
    const headerH = header.offsetHeight;
    const catNavH = categoryNavWrapper.classList.contains('is-visible')
      ? categoryNavWrapper.offsetHeight
      : 0;
    return headerH + catNavH + 12;
  }

  /* ---------- Active category tracking ---------- */
  function initCategoryTracking() {
    const sections = $$('.menu-category');

    categoryObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveCategory(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${getScrollOffset()}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.35, 0.5]
      }
    );

    sections.forEach((s) => categoryObserver.observe(s));

    window.addEventListener('resize', debounce(() => {
      categoryObserver.disconnect();
      sections.forEach((s) => categoryObserver.observe(s));
    }, 200));
  }

  function setActiveCategory(id) {
    if (activeCategoryId === id) return;
    activeCategoryId = id;

    $$('.category-link, .nav-link').forEach((link) => {
      const isActive = link.dataset.category === id;
      link.classList.toggle('is-active', isActive);
      if (isActive && link.classList.contains('category-link')) {
        scrollCategoryLinkIntoView(link);
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    $$('.reveal, .food-card').forEach((el) => revealObserver.observe(el));
  }

  function initHeroSlideshow() {
    const container = $('#hero-slides');
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    HERO_SLIDES.forEach((src, index) => {
      const slide = document.createElement('div');
      slide.className = `hero-slide${index === 0 ? ' is-active' : ''}`;

      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';

      slide.appendChild(img);
      container.appendChild(slide);
    });

    if (reducedMotion || HERO_SLIDES.length < 2) return;

    const slides = $$('.hero-slide', container);
    let current = 0;

    heroSlideTimer = window.setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 3000);
  }

  function handleHeroAnimations() {
    requestAnimationFrame(() => {
      $$('.hero .reveal').forEach((el) => {
        let delay = 0.76;

        if (el.classList.contains('hero-logo')) delay = 0.2;
        else if (el.classList.contains('hero-title')) delay = 0.38;
        else if (el.classList.contains('hero-cert')) delay = 0.58;

        el.style.transitionDelay = `${delay}s`;
        el.classList.add('is-visible');
      });
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (foodModal && !foodModal.hidden) {
          closeFoodModal();
          return;
        }
        if (cartPanel && !cartPanel.hidden) {
          closeCartPanel();
          return;
        }
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.hidden = false;
    requestAnimationFrame(() => mobileNav.classList.add('is-open'));
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setTimeout(() => {
      if (menuToggle.getAttribute('aria-expanded') === 'false') {
        mobileNav.hidden = true;
      }
    }, 300);
  }

  /* ---------- Cart ---------- */
  function initCart() {
    cart = loadCart();
    renderCart();

    if (!cartToggle || !cartPanel) return;

    cartToggle.addEventListener('click', openCartPanel);
    cartClose.addEventListener('click', closeCartPanel);
    cartBackdrop.addEventListener('click', closeCartPanel);
    cartClear.addEventListener('click', () => {
      cart = [];
      saveCart();
      renderCart();
    });

    cartBody.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-action]');
      if (!btn) return;

      const row = btn.closest('[data-cart-item-id]');
      if (!row) return;

      const id = row.dataset.cartItemId;

      if (btn.dataset.action === 'cart-inc') {
        changeCartQty(id, 1);
      } else if (btn.dataset.action === 'cart-dec') {
        changeCartQty(id, -1);
      } else if (btn.dataset.action === 'cart-remove') {
        removeFromCart(id);
      }
    });
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  function getCartItemFromElement(el) {
    const source = el.closest('[data-cart-id]');
    if (!source || !source.dataset.cartId) return null;

    return {
      id: source.dataset.cartId,
      name: source.dataset.cartName,
      price: Number(source.dataset.cartPrice)
    };
  }

  function handleAddToCart(el) {
    const item = getCartItemFromElement(el);
    if (!item || Number.isNaN(item.price)) return;
    addToCart(item);

    if (foodModal && !foodModal.hidden) {
      closeFoodModal();
    }
  }

  function addToCart(item) {
    const existing = cart.find((entry) => entry.id === item.id);

    if (existing) {
      existing.qty += 1;
      cart = cart.filter((entry) => entry.id !== item.id);
      cart.unshift(existing);
    } else {
      cart.unshift({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    showCartToast(`${item.name} נוסף לסל`);
  }

  function changeCartQty(id, delta) {
    const entry = cart.find((item) => item.id === id);
    if (!entry) return;

    entry.qty += delta;

    if (entry.qty <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }

    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    renderCart();
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function renderCart() {
    const count = getCartCount();

    if (cartBadge) {
      cartBadge.textContent = String(count);
      cartBadge.hidden = count === 0;
    }

    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = '<p class="cart-empty">הסל ריק הוסיפו מנות מהתפריט</p>';
      if (cartFooter) cartFooter.hidden = true;
      return;
    }

    if (cartFooter) cartFooter.hidden = false;
    if (cartTotalPrice) cartTotalPrice.textContent = `₪${getCartTotal()}`;

    cartBody.innerHTML = cart.map((item) => `
      <article class="cart-item" data-cart-item-id="${escapeAttr(item.id)}">
        <div class="cart-item-main">
          <h3 class="cart-item-name">${escapeHtml(item.name)}</h3>
          <p class="cart-item-unit">₪${item.price} ליחידה</p>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="cart-qty-btn" data-action="cart-dec" aria-label="הפחת כמות">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button type="button" class="cart-qty-btn" data-action="cart-inc" aria-label="הוסף כמות">+</button>
        </div>
        <div class="cart-item-total">₪${item.price * item.qty}</div>
      </article>
    `).join('');
  }

  function openCartPanel() {
    if (!cartPanel) return;

    cartLastFocusedElement = document.activeElement;
    cartPanel.hidden = false;
    cartPanel.setAttribute('aria-hidden', 'false');
    cartToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-open');

    requestAnimationFrame(() => {
      cartPanel.classList.add('is-open');
      cartClose.focus();
    });
  }

  function closeCartPanel() {
    if (!cartPanel || cartPanel.hidden) return;

    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    cartToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-open');

    window.setTimeout(() => {
      if (cartPanel.classList.contains('is-open')) return;

      cartPanel.hidden = true;
      cartLastFocusedElement?.focus?.();
      cartLastFocusedElement = null;
    }, 280);
  }

  function showCartToast(message) {
    if (!cartToast) return;

    cartToast.textContent = message;
    cartToast.hidden = false;
    cartToast.classList.add('is-visible');

    window.clearTimeout(cartToastTimer);
    cartToastTimer = window.setTimeout(() => {
      cartToast.classList.remove('is-visible');
      window.setTimeout(() => {
        cartToast.hidden = true;
      }, 280);
    }, 2200);
  }

  /* ---------- Utils ---------- */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;');
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
