// Lógica principal do site Guila's Pizzaria e Petiscaria

document.addEventListener('DOMContentLoaded', () => {
  initBusinessStatus();
  initMenu();
  initHalfAndHalfBuilder();
  initReviews();
  initMap();
  initFAQ();
  initModalsAndEvents();
  initScrollEffects();
});

// 1. Status de Funcionamento em Tempo Real
function initBusinessStatus() {
  const statusBadge = document.getElementById('business-status-badge');
  const heroStatusBadge = document.getElementById('hero-status-pill');
  if (!statusBadge && !heroStatusBadge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  // Aberto de Terça a Domingo das 18h00 às 23h30 (Segunda fechado)
  const isClosedDay = (day === 1); // Segunda
  const isOpenHours = (currentTime >= 18.0 && currentTime <= 23.5);
  const isOpen = !isClosedDay && isOpenHours;

  const statusText = isOpen 
    ? '🟢 Aberto Agora • Entregando' 
    : (isClosedDay ? '🔴 Fechado Hoje (Segunda) • Reabre Terça às 18h' : '🟡 Abre Hoje às 18:00 • Aceitando pedidos');

  const pillClass = isOpen ? 'status-open' : 'status-closed';

  if (statusBadge) {
    statusBadge.innerHTML = `<span class="status-dot"></span> <span>${statusText}</span>`;
    statusBadge.className = `status-badge ${pillClass}`;
  }
  if (heroStatusBadge) {
    heroStatusBadge.innerHTML = `<i class="fas fa-clock"></i> <span>${statusText}</span>`;
    heroStatusBadge.className = `hero-status-pill ${pillClass}`;
  }
}

// 2. Renderização do Cardápio Interativo com Filtros e Busca
let currentCategory = 'todos';
let searchQuery = '';

function initMenu() {
  const container = document.getElementById('menu-grid-container');
  if (!container) return; // Não está na página de cardápio

  renderMenuGrid();

  // Abas de categorias (suporta tanto .menu-tab-btn quanto .menu-category-pill)
  const filterBtns = document.querySelectorAll('.menu-category-pill, .menu-tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      if (!cat) return; // ex: link meio a meio

      filterBtns.forEach(b => {
        if (b.getAttribute('data-category')) b.classList.remove('active');
      });
      btn.classList.add('active');
      currentCategory = cat;
      renderMenuGrid();
    });
  });

  // Campo de busca
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderMenuGrid();
    });
  }
}

function renderMenuGrid() {
  const container = document.getElementById('menu-grid-container');
  if (!container || typeof MENU_DATA === 'undefined') return;

  let filtered = MENU_DATA.filter(item => {
    const matchesCategory = (currentCategory === 'todos') || (item.category === currentCategory);
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery) || 
      (item.description && item.description.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #fff; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <i class="fas fa-search" style="font-size: 2.8rem; color: var(--text-muted); margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 6px;">Nenhum item encontrado</h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Tente pesquisar por outro sabor ou selecione outra categoria acima.</p>
        <button class="btn btn-outline btn-sm" onclick="resetMenuFilters()">Ver Todo o Cardápio</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isPizza = item.category.startsWith('pizzas');
    const badgeHtml = item.badge ? `<span class="item-tag-badge">${item.badge}</span>` : '';
    const priceDisplay = isPizza 
      ? `A partir de <strong>${window.cart.formatMoney(item.sizes['P (4 fatias)'] || item.basePrice)}</strong>`
      : `<strong>${window.cart.formatMoney(item.basePrice)}</strong>`;

    const buttonLabel = isPizza ? 'Personalizar / Pedir' : 'Adicionar ao Pedido';

    return `
      <div class="menu-card" data-id="${item.id}">
        <div class="menu-card-img-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy" class="menu-card-img" onerror="this.src='assets/images/hero_pizza.jpg'">
          ${badgeHtml}
          ${item.portion ? `<span class="item-portion-badge"><i class="fas fa-user-friends"></i> ${item.portion}</span>` : ''}
        </div>
        <div class="menu-card-content">
          <h3 class="menu-card-title">${item.name}</h3>
          <p class="menu-card-desc">${item.description}</p>
          <div class="menu-card-footer">
            <div class="menu-card-price">${priceDisplay}</div>
            <button class="btn btn-primary btn-sm menu-card-btn" onclick="openProductModal('${item.id}')">
              <i class="fas fa-plus"></i> ${buttonLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetMenuFilters() {
  currentCategory = 'todos';
  searchQuery = '';
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.menu-category-pill, .menu-tab-btn').forEach(b => {
    if (b.getAttribute('data-category') === 'todos') b.classList.add('active');
    else if (b.getAttribute('data-category')) b.classList.remove('active');
  });
  renderMenuGrid();
}

// 3. Modal de Personalização do Produto
let selectedModalProduct = null;
let currentModalSize = null;
let currentModalBorder = null;
let modalQuantity = 1;

function openProductModal(productId) {
  if (typeof MENU_DATA === 'undefined') return;
  const product = MENU_DATA.find(p => p.id === productId);
  if (!product) return;

  selectedModalProduct = product;
  modalQuantity = 1;

  const isPizza = product.category.startsWith('pizzas');
  const modal = document.getElementById('product-modal');
  const overlay = document.getElementById('modal-overlay');

  if (!modal || !overlay) return;

  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-name').textContent = product.name;
  document.getElementById('modal-product-desc').textContent = product.description;
  document.getElementById('modal-qty-val').textContent = modalQuantity;
  document.getElementById('modal-product-obs').value = '';

  const sizeSection = document.getElementById('modal-size-section');
  const borderSection = document.getElementById('modal-border-section');

  if (isPizza && product.sizes) {
    sizeSection.style.display = 'block';
    borderSection.style.display = 'block';

    const sizeKeys = Object.keys(product.sizes);
    currentModalSize = sizeKeys[1] || sizeKeys[0];

    const sizeOptionsContainer = document.getElementById('modal-size-options');
    sizeOptionsContainer.innerHTML = sizeKeys.map(sizeName => {
      const price = product.sizes[sizeName];
      const isChecked = sizeName === currentModalSize ? 'checked' : '';
      return `
        <label class="custom-radio-card">
          <input type="radio" name="modal-size-radio" value="${sizeName}" ${isChecked} onchange="onModalSizeChange('${sizeName}')">
          <div class="radio-card-content">
            <span class="radio-card-title">${sizeName}</span>
            <span class="radio-card-price">${window.cart.formatMoney(price)}</span>
          </div>
        </label>
      `;
    }).join('');

    currentModalBorder = BORDER_OPTIONS[0];
    const borderOptionsContainer = document.getElementById('modal-border-options');
    borderOptionsContainer.innerHTML = BORDER_OPTIONS.map((border, idx) => {
      const isChecked = idx === 0 ? 'checked' : '';
      const priceLabel = border.price > 0 ? `+${window.cart.formatMoney(border.price)}` : 'Inclusa';
      return `
        <label class="custom-radio-card">
          <input type="radio" name="modal-border-radio" value="${border.name}" ${isChecked} onchange="onModalBorderChange('${border.name}')">
          <div class="radio-card-content">
            <span class="radio-card-title">${border.name}</span>
            <span class="radio-card-price">${priceLabel}</span>
          </div>
        </label>
      `;
    }).join('');
  } else {
    sizeSection.style.display = 'none';
    borderSection.style.display = 'none';
    currentModalSize = null;
    currentModalBorder = null;
  }

  updateModalTotal();

  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function onModalSizeChange(sizeName) {
  currentModalSize = sizeName;
  updateModalTotal();
}

function onModalBorderChange(borderName) {
  currentModalBorder = BORDER_OPTIONS.find(b => b.name === borderName) || BORDER_OPTIONS[0];
  updateModalTotal();
}

function changeModalQty(delta) {
  modalQuantity += delta;
  if (modalQuantity < 1) modalQuantity = 1;
  document.getElementById('modal-qty-val').textContent = modalQuantity;
  updateModalTotal();
}

function updateModalTotal() {
  if (!selectedModalProduct) return;

  let unitPrice = selectedModalProduct.basePrice;
  if (selectedModalProduct.sizes && currentModalSize && selectedModalProduct.sizes[currentModalSize]) {
    unitPrice = selectedModalProduct.sizes[currentModalSize];
  }
  const borderPrice = currentModalBorder ? currentModalBorder.price : 0;
  const total = (unitPrice + borderPrice) * modalQuantity;

  const totalEl = document.getElementById('modal-total-price');
  if (totalEl) totalEl.textContent = window.cart.formatMoney(total);
}

function addModalItemToCart() {
  if (!selectedModalProduct) return;

  let unitPrice = selectedModalProduct.basePrice;
  if (selectedModalProduct.sizes && currentModalSize && selectedModalProduct.sizes[currentModalSize]) {
    unitPrice = selectedModalProduct.sizes[currentModalSize];
  }
  const borderName = currentModalBorder ? currentModalBorder.name : null;
  const borderPrice = currentModalBorder ? currentModalBorder.price : 0;
  const obs = document.getElementById('modal-product-obs').value.trim();

  window.cart.addItem({
    id: selectedModalProduct.id,
    name: selectedModalProduct.name,
    price: unitPrice,
    size: currentModalSize,
    border: borderName,
    borderPrice: borderPrice,
    notes: obs,
    image: selectedModalProduct.image,
    quantity: modalQuantity
  });

  closeProductModal();
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// 4. Construtor "Monte Sua Pizza Meio a Meio"
function initHalfAndHalfBuilder() {
  const select1 = document.getElementById('builder-flavor-1');
  const select2 = document.getElementById('builder-flavor-2');
  const sizeSelect = document.getElementById('builder-size');
  const borderSelect = document.getElementById('builder-border');
  const addBtn = document.getElementById('builder-add-btn');

  if (!select1 || !select2 || typeof MENU_DATA === 'undefined') return;

  const pizzaList = MENU_DATA.filter(item => item.category.startsWith('pizzas'));

  const optionsHtml = pizzaList.map(p => `
    <option value="${p.id}">
      ${p.name}
    </option>
  `).join('');

  select1.innerHTML = optionsHtml;
  select2.innerHTML = optionsHtml;

  if (select1.options.length > 0) select1.selectedIndex = 0;
  if (select2.options.length > 5) select2.selectedIndex = 5;

  borderSelect.innerHTML = BORDER_OPTIONS.map(b => `
    <option value="${b.name}" data-price="${b.price}">
      ${b.name} ${b.price > 0 ? `(+${window.cart.formatMoney(b.price)})` : '(Inclusa)'}
    </option>
  `).join('');

  const updateBuilderPrice = () => {
    const s1 = pizzaList.find(p => p.id === select1.value);
    const s2 = pizzaList.find(p => p.id === select2.value);
    const chosenSize = sizeSelect.value;
    const borderOpt = BORDER_OPTIONS.find(b => b.name === borderSelect.value) || BORDER_OPTIONS[0];

    const price1 = (s1 && s1.sizes && s1.sizes[chosenSize]) || 48;
    const price2 = (s2 && s2.sizes && s2.sizes[chosenSize]) || 48;
    const baseCalculated = Math.max(price1, price2);
    const totalHalf = baseCalculated + borderOpt.price;

    const p1 = document.getElementById('builder-preview-flavor1');
    const p2 = document.getElementById('builder-preview-flavor2');
    const totalEl = document.getElementById('builder-total-price');

    if (p1 && s1) p1.textContent = s1.name;
    if (p2 && s2) p2.textContent = s2.name;
    if (totalEl) totalEl.textContent = window.cart.formatMoney(totalHalf);
  };

  select1.addEventListener('change', updateBuilderPrice);
  select2.addEventListener('change', updateBuilderPrice);
  sizeSelect.addEventListener('change', updateBuilderPrice);
  borderSelect.addEventListener('change', updateBuilderPrice);

  updateBuilderPrice();

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const s1 = pizzaList.find(p => p.id === select1.value);
      const s2 = pizzaList.find(p => p.id === select2.value);
      const chosenSize = sizeSelect.value;
      const borderOpt = BORDER_OPTIONS.find(b => b.name === borderSelect.value) || BORDER_OPTIONS[0];
      const obs = document.getElementById('builder-notes') ? document.getElementById('builder-notes').value.trim() : '';

      const price1 = (s1 && s1.sizes && s1.sizes[chosenSize]) || 48;
      const price2 = (s2 && s2.sizes && s2.sizes[chosenSize]) || 48;
      const baseCalculated = Math.max(price1, price2);

      const halfName = `Pizza Meio a Meio: ½ ${s1.name} + ½ ${s2.name}`;

      window.cart.addItem({
        id: `half-${s1.id}-${s2.id}-${Date.now()}`,
        name: halfName,
        price: baseCalculated,
        size: chosenSize,
        border: borderOpt.name,
        borderPrice: borderOpt.price,
        notes: obs,
        image: 'assets/images/hero_pizza.jpg',
        quantity: 1
      });

      // Em telas menores que 1024px abre a gaveta
      if (window.innerWidth < 1024) {
        window.cart.openDrawer();
      }
    });
  }
}

// 5. Renderização das Avaliações Reais do Google Maps (Top 3 na Home)
function initReviews() {
  const reviewsContainer = document.getElementById('reviews-cards-container');
  if (!reviewsContainer || typeof REAL_REVIEWS === 'undefined') return;

  const topReviews = REAL_REVIEWS.slice(0, 3);
  reviewsContainer.innerHTML = topReviews.map(r => {
    const starsHtml = Array(r.rating).fill('<i class="fas fa-star" style="color: #f59e0b;"></i>').join('');

    return `
      <div class="review-card">
        <div class="review-card-top">
          <div class="review-user-badge">
            <div class="review-avatar" style="background-color: ${r.avatarBg}">${r.avatar}</div>
            <div>
              <h4 class="review-user-name">${r.name}</h4>
              <span class="review-user-role">${r.role} • ${r.date}</span>
            </div>
          </div>
          <div class="review-stars-row">
            ${starsHtml}
          </div>
        </div>
        <p class="review-text">"${r.comment}"</p>
        <div class="review-highlight-tag">
          <i class="fab fa-google text-google"></i>
          <span>${r.highlight}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 6. Mapa Interativo (Leaflet OpenStreetMap)
function initMap() {
  const mapElement = document.getElementById('pizzeria-map');
  if (!mapElement) return;

  const lat = -7.4696021;
  const lng = -37.2748222;

  try {
    const map = L.map('pizzeria-map', {
      scrollWheelZoom: false
    }).setView([lat, lng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%); border: 3px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.35);">
          <i class="fas fa-pizza-slice" style="transform: rotate(45deg); color: #fff; font-size: 1.15rem;"></i>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -40]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    const popupContent = `
      <div style="font-family: inherit; padding: 4px;">
        <h4 style="font-size: 1rem; color: #1c140e; margin-bottom: 4px;">🍕 Guila´s Pizzaria e Petiscaria</h4>
        <p style="font-size: 0.82rem; color: #555; margin-bottom: 8px;">Av. 25 de Agosto, 699 - Bairro Planalto<br>São José do Egito - PE</p>
        <span style="background: #fef3c7; color: #b45309; font-size: 0.76rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">⭐ 4.8 no Google Maps</span>
        <div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="display: inline-block; background: #c2410c; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 600;">
            Traçar Rota no Google
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();
  } catch (err) {
    console.warn('Erro ao inicializar Leaflet:', err);
  }
}

// 7. FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

// 8. Modais, Gavetas e Menus Mobile
function initModalsAndEvents() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileClose = document.getElementById('mobile-drawer-close');

  const closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileMenu);
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Cart Drawer open/close
  document.querySelectorAll('.open-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeMobileMenu();
      if (window.cart) window.cart.openDrawer();
    });
  });

  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartOverlay = document.getElementById('cart-overlay');

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
      if (window.cart) window.cart.closeDrawer();
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      if (window.cart) window.cart.closeDrawer();
    });
  }

  // Product Modal close
  const modalCloseBtn = document.getElementById('product-modal-close');
  const modalOverlay = document.getElementById('modal-overlay');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeProductModal);

  // Seletores de Tipo de Pedido (Delivery vs Retirada vs Mesa)
  document.querySelectorAll('.order-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.getAttribute('data-type');
      if (window.cart) window.cart.setOrderType(type);

      const addressLabel = document.getElementById('checkout-address-label');
      const addressInput = document.getElementById('checkout-address');
      const sideAddressLabel = document.getElementById('sidebar-address-label');
      const sideAddressInput = document.getElementById('sidebar-checkout-address');

      const labelText = type === 'delivery' 
        ? '<i class="fas fa-map-marker-alt"></i> Endereço de Entrega*' 
        : (type === 'pickup' ? '<i class="fas fa-store"></i> Retirada no Balcão' : '<i class="fas fa-chair"></i> Número da Mesa');

      const placeholderText = type === 'delivery' 
        ? 'Rua, Nº, Bairro e Referência' 
        : (type === 'pickup' ? 'Retirada na Av. 25 de Agosto, 699' : 'Ex: Mesa 04 (Salão)');

      if (addressLabel) addressLabel.innerHTML = labelText;
      if (addressInput) addressInput.placeholder = placeholderText;
      if (sideAddressLabel) sideAddressLabel.innerHTML = labelText;
      if (sideAddressInput) sideAddressInput.placeholder = placeholderText;
    });
  });
}

// 9. Efeitos de Rolagem Suave e Navbar Sticky
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
}
