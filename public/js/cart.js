let cartItems = JSON.parse(localStorage.getItem('cartList'));

export function isCartEmpty() {
  const checkoutBtn = document.getElementById('cart-btn-checkout');
  const cartDetails = document.getElementById('cart-empty-details');
  if (cartItems.length !== 0) {
    checkoutBtn.disabled = false;
    cartDetails.classList.remove('active');
  } else {
    checkoutBtn.disabled = true;
    cartDetails.classList.add('active');
  }
}

export function renderCartItems(containerID) {
  const container = document.getElementById(containerID);

  container.innerHTML = '';

  console.log(cartItems);

  cartItems.forEach((item) => {
    const li = document.createElement('li');

    // Создаем элементы
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = 'image';

    const div = document.createElement('div');

    const title = document.createElement('p');
    title.classList.add('product-title');
    title.textContent = item.name;

    const price = document.createElement('p');
    price.classList.add('product-price');
    price.textContent = `${item.price}$`;

    const quantityDiv = document.createElement('div');
    quantityDiv.textContent = 'quantity ';

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      removeOneFromCart(item.id);
    });

    const quantity = document.createTextNode(item.quantity);

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';

    plusBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      addOneToCart(item.id);
    });

    // Собираем все:
    quantityDiv.appendChild(minusBtn);
    quantityDiv.appendChild(quantity);
    quantityDiv.appendChild(plusBtn);

    div.appendChild(title);
    div.appendChild(price);
    div.appendChild(quantityDiv);

    li.appendChild(img);
    li.appendChild(div);

    container.appendChild(li);
  });
}

function calculateTotal() {
  let sum = 0;
  cartItems.forEach((item) => {
    sum = sum + item.price * item.quantity;
  });

  return sum.toFixed(2);
}

export function renderTotalPrice(containerID) {
  const container = document.getElementById(containerID);

  container.innerText = calculateTotal() + '$';
}

export function addToCart({ id, image, name, price, quantity }) {
  const cartItemIndex = cartItems.findIndex((item) => item.id === id);

  if (cartItemIndex !== -1) {
    cartItems[cartItemIndex].quantity = cartItems[cartItemIndex].quantity + 1;
    calculateTotal();
    renderTotalPrice('cart-total-price');
    localStorage.setItem('cartList', JSON.stringify(cartItems));
    renderCartItems('cart-list');
    return;
  }

  cartItems.push({
    id: id,
    image: image,
    name: name,
    price: price,
    quantity: quantity,
  });

  calculateTotal();
  renderTotalPrice('cart-total-price');
  localStorage.setItem('cartList', JSON.stringify(cartItems));
  isCartEmpty();
  renderCartItems('cart-list');
  return;
}

export function addOneToCart(id) {
  const cartItemIndex = cartItems.findIndex((item) => item.id === id);
  const currentItem = cartItems[cartItemIndex];

  currentItem.quantity = currentItem.quantity + 1;
  calculateTotal();
  renderTotalPrice('cart-total-price');
  localStorage.setItem('cartList', JSON.stringify(cartItems));
  renderCartItems('cart-list');
}

export function removeOneFromCart(id) {
  const cartItemIndex = cartItems.findIndex((item) => item.id === id);
  const currentItem = cartItems[cartItemIndex];

  if (currentItem.quantity > 1) {
    currentItem.quantity = currentItem.quantity - 1;
    calculateTotal();
    renderTotalPrice('cart-total-price');
    localStorage.setItem('cartList', JSON.stringify(cartItems));
    isCartEmpty();
    renderCartItems('cart-list');
    return;
  }

  cartItems = cartItems.filter((item) => item.id !== currentItem.id);
  calculateTotal();
  renderTotalPrice('cart-total-price');
  localStorage.setItem('cartList', JSON.stringify(cartItems));
  isCartEmpty();
  renderCartItems('cart-list');
}
