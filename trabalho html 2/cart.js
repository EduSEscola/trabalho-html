// carregar os produtos salvos no navegador ou iniciar uma lista vazia
let products = JSON.parse(localStorage.getItem('carrinhoCubos')) || [];

// guardar porcentagem de desconto aplicada (0 = padrão)
let discountPercentage = 0;

// salvar o carrinho no navegador
function saveCart() {
  localStorage.setItem('carrinhoCubos', JSON.stringify(products));
}

// função do botão comprar no site.html
function addToCart(product) {
  const existingProduct = products.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    products.push({ ...product, quantity: 1 });
  }

  saveCart();
  alert(`${product.name} foi adicionado ao carrinho!`);
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
}

function renderCartItems() {
  const cartItemsSection = document.getElementById('cart-items');
  if (!cartItemsSection) return;
  let subtotal = 0; 
  
  cartItemsSection.innerHTML = '';
  
  products.forEach(product => {
    const itemTotal = product.price * product.quantity;
    const row = document.createElement('tr');
    subtotal += itemTotal;
    
    row.innerHTML = `
      <td>
        <div class="product">
          <img 
            src="${product.image}" 
            height="100" 
            width="100" 
            alt="${product.name}" 
          />
          <div class="info">
            <div class="name">${product.name}</div>
            <div class="category">${product.category}</div>
          </div>
        </div>
      </td>
      <td>${formatCurrency(product.price)}</td>
      <td>
          <div class="quantity">
          <button onclick="decreaseQuantity(${product.id})">
              <i class="bx bx-minus"></i>
          </button>
          <span>${product.quantity}</span>
          <button onclick="increaseQuantity(${product.id})">
              <i class="bx bx-plus"></i>
          </button>
          </div>
      </td>
      <td>${formatCurrency(itemTotal)}</td>
      <td>
        <button class="remove" onclick="removeProduct(${product.id})">
          <i class="bx bx-x"></i>
        </button>
      </td>
    `;
    cartItemsSection.appendChild(row);
  });
  updateCartSummary(subtotal);
}

function updateCartSummary(subtotal) {
  const subtotalElement = document.getElementById('cart-subtotal');
  const totalElement = document.getElementById('cart-total');

  // valor final aplicando o desconto se houver
  const discountAmount = subtotal * discountPercentage;
  const finalTotal = subtotal - discountAmount;

  if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
  if (totalElement) totalElement.textContent = formatCurrency(finalTotal);
}

//adicionar 1 à quantidade do produto
function increaseQuantity(id) {
  const product = products.find(item => item.id === id);
  if (product) {
    product.quantity += 1;
    saveCart();
    renderCartItems(); 
  }
}

//subtrair 1 da quantidade do produto
function decreaseQuantity(id) {
  const product = products.find(item => item.id === id);
  // Impede que a quantidade seja menor que 1
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    saveCart();
    renderCartItems(); 
  }
}

function removeProduct(id) {
  const index = products.findIndex(item => item.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    saveCart();
    renderCartItems();
  }
}

function finishPayment(id){
  const windowButton = document.querySelector("#windowButton");
  const log = document.querySelector("#log");
  if (products.length > 0) {
    if (window.confirm("Deseja realmente realizar a compra?")) {
      alert('Compra realizada com sucesso!')
      products.splice(0,products.length)
    saveCart();
    renderCartItems();
    discountPercentage = 1;
  }
  }
}

// lógica da modal e validação do cupom
function setupCouponModal() {
  const modal = document.getElementById('coupon-modal');
  const openBtn = document.getElementById('open-coupon-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const confirmBtn = document.getElementById('confirm-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  const feedbackMsg = document.getElementById('coupon-feedback');

  if (!modal || !openBtn) return;

  // abrir a modal
  openBtn.addEventListener('click', () => {
    couponInput.value = '';
    feedbackMsg.textContent = '';
    modal.classList.add('active');
    couponInput.focus();
  });

  // botão de fechar
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // validação do cupom
  confirmBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();

    if (code === 'SIMI') {
      discountPercentage = 0.05; // desconto de 5%
      feedbackMsg.textContent = 'Cupom SIMI aplicado com sucesso! (5% OFF)';
      feedbackMsg.className = 'feedback-msg success';
      
      // atualiza os valores na tela
      renderCartItems();

      // fecha a modal automaticamente dps de 1 segundo
      setTimeout(() => {
        modal.classList.remove('active');
        openBtn.textContent = 'Cupom SIMI aplicado (5% OFF)';
      }, 1000);
    } else {
      feedbackMsg.textContent = 'Cupom inválido. Tente novamente.';
      feedbackMsg.className = 'feedback-msg error';
    }
  });
}

/* para quando dar o load na página.
document.addEventListener('DOMContentLoaded', renderCartItems);*/
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  setupCouponModal();
});