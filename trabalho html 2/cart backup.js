const products =[
{
    id: 1,
    name:"Teclado Mecânico",
    category: "Periféricos",
    price: 650.00,
    image: "./images/teclado-mecanico.jpg",
    quantity: 2
},

{
        id: 2,
        name: "Cadeira Gamer",
        category: "Acessórios",
        price: 500.00,
        image: "./images/cadeira-gamer.jpg",
        quantity: 2
},

{
        id: 3,
        name: "Headset Bluetooth",
        category: "Periféricos",
        price: 350.00,
        image: "./images/headset.jpg",
        quantity: 2
}
];

// Guarda a porcentagem de desconto aplicada (0 por padrão)
let discountPercentage = 0;

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
}

function renderCartItems() {
  const cartItemsSection = document.getElementById('cart-items');
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
      <td>R$ ${product.price.toFixed(2)}</td>
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
      <td>R$ ${itemTotal.toFixed(2)}</td>
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

  // Formata para o padrão brasileiro (ex: R$ 3.000,00)
  const formattedValue = subtotal.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  if (subtotalElement) subtotalElement.textContent = formattedValue;
  if (totalElement) totalElement.textContent = formattedValue;

  // Calcula o valor final aplicando o desconto (se houver)
  const discountAmount = subtotal * discountPercentage;
  const finalTotal = subtotal - discountAmount;

  if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
  if (totalElement) totalElement.textContent = formatCurrency(finalTotal);
}

// Função para adicionar 1 à quantidade do produto
function increaseQuantity(id) {
  const product = products.find(item => item.id === id);
  if (product) {
    product.quantity += 1;
    renderCartItems(); // Re-renderiza a tabela atualizando o total do item
  }
}

// Função para subtrair 1 da quantidade do produto
function decreaseQuantity(id) {
  const product = products.find(item => item.id === id);
  // Impede que a quantidade seja menor que 1
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    renderCartItems(); // Re-renderiza a tabela atualizando o total do item
  }
}

function removeProduct(id) {
  const index = products.findIndex(item => item.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    renderCartItems();
  }
}

// Lógica da Modal e Validação do Cupom
function setupCouponModal() {
  const modal = document.getElementById('coupon-modal');
  const openBtn = document.getElementById('open-coupon-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const confirmBtn = document.getElementById('confirm-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  const feedbackMsg = document.getElementById('coupon-feedback');

  // Abre a modal
  openBtn.addEventListener('click', () => {
    couponInput.value = '';
    feedbackMsg.textContent = '';
    modal.classList.add('active');
    couponInput.focus();
  });

  // Fecha a modal no "X"
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Valida o cupom ao clicar em Confirmar
  confirmBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();

    if (code === 'SIMI') {
      discountPercentage = 0.05; // 5% de desconto
      feedbackMsg.textContent = 'Cupom SIMI aplicado com sucesso! (5% OFF)';
      feedbackMsg.className = 'feedback-msg success';
      
      // Atualiza os valores na tela
      renderCartItems();

      // Fecha a modal automaticamente após 1 segundo
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