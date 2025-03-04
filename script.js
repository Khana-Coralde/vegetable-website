document.addEventListener('DOMContentLoaded', () => {
  // ✅ Profile navigation
  const profileIcon = document.getElementById('profileIcon');
  if (profileIcon) {
    profileIcon.addEventListener('click', (e) => {
      e.preventDefault();
      const user = localStorage.getItem('user');
      window.location.href = user ? 'profile.html' : 'login.html';
    });
  }

  // ✅ Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  }

  // ✅ Login
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      const storedUser = JSON.parse(localStorage.getItem(email));
      if (storedUser?.password === password) {
        localStorage.setItem('user', email);
        alert('Login successful!');
        window.location.href = 'vegetables.html';
      } else {
        alert('Invalid email or password.');
      }
    });
  }

  // ✅ Signup
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;

      if (username && email && password) {
        localStorage.setItem(email, JSON.stringify({ username, password }));
        alert('Sign up successful! Please log in.');
        window.location.href = 'login.html';
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
  
    // ✅ Add to Cart function
  function addToCart(name, price, image, quantity) {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cart.find(item => item.name === name && item.price === price);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, image, quantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
  }
  
  // ✅ Add to Cart buttons
  const addToCartButtons = document.querySelectorAll('.addToCartBtn');
  addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!localStorage.getItem('user')) {
      alert('Please log in to add items to your cart.');
      window.location.href = 'login.html';
      return;
    }

    const card = button.closest('.card');
    const name = button.getAttribute('data-name');
    const image = button.getAttribute('data-image');

    let price;
    const priceOption = card.querySelector('.price-option');

    if (priceOption) {
      // For "New Products" section (dropdown price selection)
      price = parseFloat(priceOption.value);
    } else {
      // For "Sales" section (direct data-price from button)
      price = parseFloat(button.getAttribute('data-price'));
    }

    if (isNaN(price)) {
      alert('Price not found!');
      return;
    }

    const quantity = 1;

    addToCart(name, price, image, quantity);
    alert(`${name} has been added to your cart.`);
  });
});



  // ✅ Cart page logic
  if (window.location.pathname.includes('cart.html')) {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

    function saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }

    function updateTotal() {
      totalPriceElement.textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }

    function renderCart() {
      cartItemsContainer.innerHTML = cart.length
        ? cart.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" width="50">
            <p>${item.name}</p>
            <p>₱ ${item.price.toFixed(2)}</p>
            <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-name="${item.name}">
            <p>₱ ${(item.price * item.quantity).toFixed(2)}</p>
            <button class="delete-btn" data-name="${item.name}">Delete</button>
          </div>
        `).join('') : '<p>Your cart is empty.</p>';

      updateTotal();
    }

    cartItemsContainer.addEventListener('input', (e) => {
      if (e.target.matches('.quantity-input')) {
        const item = cart.find(i => i.name === e.target.dataset.name);
        if (item) {
          item.quantity = Math.max(1, parseInt(e.target.value));
          saveCart();
          renderCart();
        }
      }
    });

    cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.matches('.delete-btn')) {
        cart = cart.filter(i => i.name !== e.target.dataset.name);
        saveCart();
        renderCart();
      }
    });

    checkoutBtn.addEventListener('click', () => {
      if (!cart.length) {
        alert('Your cart is empty!');
        return;
      }

      const userEmail = localStorage.getItem('user');
      if (!userEmail) {
        alert('Please log in to place an order.');
        window.location.href = 'login.html';
        return;
      }

      const orders = JSON.parse(localStorage.getItem('orders')) || {};
      (orders[userEmail] ||= []).push({ date: new Date().toLocaleString(), items: cart });

      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.removeItem('cartItems');

      alert('Order placed successfully!');
      location.reload();
    });

    renderCart();
  }
});