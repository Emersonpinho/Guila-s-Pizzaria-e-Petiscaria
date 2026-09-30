// Sistema de Carrinho Inteligente e Integração com WhatsApp
// Guila's Pizzaria e Petiscaria - (87) 9807-9219

class CartManager {
  constructor() {
    this.phone = '558798079219'; // Número oficial do Guila's Pizzaria
    this.items = this.loadCart();
    this.deliveryFee = 5.00;
    this.orderType = 'delivery'; // 'delivery', 'pickup', 'dinein'
    
    this.init();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('guilas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('guilas_cart', JSON.stringify(this.items));
    } catch (e) {}
    this.updateUI();
  }

  addItem(item) {
    const existingIndex = this.items.findIndex(i => 
      i.id === item.id && 
      i.size === item.size && 
      i.border === item.border && 
      (i.notes || '') === (item.notes || '')
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += (item.quantity || 1);
    } else {
      this.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size || null,
        border: item.border || null,
        borderPrice: item.borderPrice || 0,
        notes: item.notes || '',
        image: item.image || 'assets/images/hero_pizza.jpg',
        quantity: item.quantity || 1
      });
    }

    this.saveCart();
    this.showToast(`"${item.name}" adicionado à sacola!`);
    this.animateCartButton();
  }

  removeItem(index) {
    if (this.items[index]) {
      this.items.splice(index, 1);
      this.saveCart();
      this.showToast('Item removido da sacola.');
    }
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
      } else {
        this.saveCart();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => {
      const itemUnitPrice = (item.price || 0) + (item.borderPrice || 0);
      return sum + (itemUnitPrice * item.quantity);
    }, 0);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    const fee = this.orderType === 'delivery' ? this.deliveryFee : 0;
    return subtotal + fee;
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  setOrderType(type) {
    this.orderType = type;
    this.updateUI();
  }

  formatMoney(val) {
    return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  renderItemListHTML() {
    return this.items.map((item, index) => {
      const itemUnitPrice = item.price + (item.borderPrice || 0);
      const itemTotalPrice = itemUnitPrice * item.quantity;
      
      let detailsHtml = '';
      if (item.size) {
        detailsHtml += `<span class="cart-item-detail"><i class="fas fa-pizza-slice"></i> ${item.size}</span>`;
      }
      if (item.border && item.border !== 'Sem Borda Recheada') {
        detailsHtml += `<span class="cart-item-detail"><i class="fas fa-circle-notch"></i> ${item.border} (+${this.formatMoney(item.borderPrice)})</span>`;
      }
      if (item.notes) {
        detailsHtml += `<span class="cart-item-detail cart-item-obs"><i class="fas fa-comment-dots"></i> ${item.notes}</span>`;
      }

      return `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/images/hero_pizza.jpg'">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-details-list">
              ${detailsHtml}
            </div>
            <div class="cart-item-price-unit">${this.formatMoney(itemUnitPrice)} un.</div>
          </div>
          <div class="cart-item-actions">
            <button class="cart-remove-btn" onclick="window.cart.removeItem(${index})" title="Remover item">
              <i class="fas fa-trash-alt"></i>
            </button>
            <div class="cart-stepper">
              <button onclick="window.cart.updateQuantity(${index}, -1)" title="Diminuir">-</button>
              <span>${item.quantity}</span>
              <button onclick="window.cart.updateQuantity(${index}, 1)" title="Aumentar">+</button>
            </div>
            <div class="cart-item-total">${this.formatMoney(itemTotalPrice)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  updateUI() {
    const count = this.getItemCount();
    const subtotal = this.getSubtotal();
    const fee = this.orderType === 'delivery' ? this.deliveryFee : 0;
    const total = this.getTotal();
    const hasItems = this.items.length > 0;

    // Atualiza contadores
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    const itemsHtml = this.renderItemListHTML();

    // 1. Atualiza Drawer do Carrinho
    const cartList = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const cartFooter = document.getElementById('cart-drawer-footer');
    const checkoutForm = document.getElementById('cart-checkout-form');

    if (cartList) {
      if (hasItems) {
        cartList.innerHTML = itemsHtml;
        if (emptyState) emptyState.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';
        if (checkoutForm) checkoutForm.style.display = 'flex';
      } else {
        cartList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
        if (checkoutForm) checkoutForm.style.display = 'none';
      }
    }

    const cartSubtotalEl = document.getElementById('cart-subtotal-val');
    const cartFeeEl = document.getElementById('cart-fee-val');
    const cartTotalEl = document.getElementById('cart-total-val');
    const feeRow = document.getElementById('cart-fee-row');

    if (cartSubtotalEl) cartSubtotalEl.textContent = this.formatMoney(subtotal);
    if (cartFeeEl) cartFeeEl.textContent = this.orderType === 'delivery' ? this.formatMoney(fee) : 'Grátis';
    if (feeRow) feeRow.style.display = this.orderType === 'delivery' ? 'flex' : 'none';
    if (cartTotalEl) cartTotalEl.textContent = this.formatMoney(total);

    // 2. Atualiza Sidebar do Carrinho (se estiver na página cardapio.html)
    const sidebarList = document.getElementById('sidebar-cart-list');
    const sidebarEmpty = document.getElementById('sidebar-cart-empty');
    const sidebarFooter = document.getElementById('sidebar-cart-footer');
    const sidebarForm = document.getElementById('sidebar-checkout-form');

    if (sidebarList) {
      if (hasItems) {
        sidebarList.innerHTML = itemsHtml;
        if (sidebarEmpty) sidebarEmpty.style.display = 'none';
        if (sidebarFooter) sidebarFooter.style.display = 'block';
        if (sidebarForm) sidebarForm.style.display = 'flex';
      } else {
        sidebarList.innerHTML = '';
        if (sidebarEmpty) sidebarEmpty.style.display = 'block';
        if (sidebarFooter) sidebarFooter.style.display = 'none';
        if (sidebarForm) sidebarForm.style.display = 'none';
      }
    }

    const sideSubtotal = document.getElementById('sidebar-subtotal-val');
    const sideFee = document.getElementById('sidebar-fee-val');
    const sideTotal = document.getElementById('sidebar-total-val');
    const sideFeeRow = document.getElementById('sidebar-fee-row');

    if (sideSubtotal) sideSubtotal.textContent = this.formatMoney(subtotal);
    if (sideFee) sideFee.textContent = this.orderType === 'delivery' ? this.formatMoney(fee) : 'Grátis';
    if (sideFeeRow) sideFeeRow.style.display = this.orderType === 'delivery' ? 'flex' : 'none';
    if (sideTotal) sideTotal.textContent = this.formatMoney(total);
  }

  animateCartButton() {
    const floatBtn = document.getElementById('floating-cart-btn');
    if (floatBtn) {
      floatBtn.classList.add('pulse-pop');
      setTimeout(() => floatBtn.classList.remove('pulse-pop'), 500);
    }
  }

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle text-green"></i> <span>${message}</span>`;
    toast.className = 'app-toast show';
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.className = 'app-toast';
    }, 3000);
  }

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateUI();
  }

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  checkoutWhatsApp(source = 'drawer') {
    if (this.items.length === 0) {
      alert('Sua sacola está vazia! Adicione itens deliciosos antes de finalizar.');
      return;
    }

    const isSidebar = (source === 'sidebar');
    const nameId = isSidebar ? 'sidebar-checkout-name' : 'checkout-name';
    const addressId = isSidebar ? 'sidebar-checkout-address' : 'checkout-address';
    const paymentId = isSidebar ? 'sidebar-checkout-payment' : 'checkout-payment';

    const nameInput = document.getElementById(nameId) || document.getElementById('checkout-name');
    const addressInput = document.getElementById(addressId) || document.getElementById('checkout-address');
    const paymentSelect = document.getElementById(paymentId) || document.getElementById('checkout-payment');

    const name = nameInput ? nameInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';
    const payment = paymentSelect ? paymentSelect.value : 'Pix';

    if (!name) {
      alert('Por favor, informe seu nome para identificarmos o pedido.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (this.orderType === 'delivery' && !address) {
      alert('Por favor, informe o endereço de entrega (Rua, Número, Bairro e Ponto de Referência).');
      if (addressInput) addressInput.focus();
      return;
    }

    let orderTypeLabel = '🛵 Entrega Delivery em Casa';
    if (this.orderType === 'pickup') orderTypeLabel = '🥡 Retirada no Balcão';
    if (this.orderType === 'dinein') orderTypeLabel = '🍽️ Consumo na Mesa';

    let msg = `🍕 *NOVO PEDIDO - GUILA'S PIZZARIA & PETISCARIA*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Cliente:* ${name}\n`;
    msg += `📍 *Modalidade:* ${orderTypeLabel}\n`;
    
    if (this.orderType === 'delivery') {
      msg += `🏠 *Endereço:* ${address}\n`;
    } else if (this.orderType === 'dinein') {
      msg += `🪑 *Mesa/Local:* ${address || 'Salão Principal'}\n`;
    }

    msg += `\n📋 *ITENS DO PEDIDO:*\n`;
    this.items.forEach(item => {
      const unitP = item.price + (item.borderPrice || 0);
      const totalP = unitP * item.quantity;
      msg += `\n*${item.quantity}x ${item.name}*\n`;
      if (item.size) msg += `   ▫️ Tamanho: ${item.size}\n`;
      if (item.border && item.border !== 'Sem Borda Recheada') {
        msg += `   ▫️ Borda: ${item.border} (+${this.formatMoney(item.borderPrice)})\n`;
      }
      if (item.notes) msg += `   ▫️ Obs: _${item.notes}_\n`;
      msg += `   ▫️ Subtotal: ${this.formatMoney(totalP)}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *Subtotal:* ${this.formatMoney(this.getSubtotal())}\n`;
    if (this.orderType === 'delivery') {
      msg += `🛵 *Taxa de Entrega:* ${this.formatMoney(this.deliveryFee)}\n`;
    }
    msg += `💵 *TOTAL GERAL:* ${this.formatMoney(this.getTotal())}\n`;
    msg += `💳 *Pagamento:* ${payment}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Pedido gerado pelo site Guila's Pizzaria. Aguardando confirmação do estabelecimento!_`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${this.phone}?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
    this.showToast('Redirecionando para o WhatsApp com seu pedido pronto!');
    
    setTimeout(() => {
      this.closeDrawer();
    }, 1200);
  }

  init() {
    this.updateUI();
    window.cart = this;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cart = new CartManager();
});
