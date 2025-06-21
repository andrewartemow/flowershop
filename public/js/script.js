import { fetchProducts } from './fetchProducts.js';
import { renderProducts } from './renderProducts.js';
import { fetchSingleProduct } from './fetchSingleProduct.js';
import { renderSingleProduct } from './renderSinglePorduct.js';
import {
  addToCart,
  renderCartItems,
  renderTotalPrice,
  isCartEmpty,
} from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const header = document.getElementById('header');
  const cartButton = document.getElementById('cart-button');
  const cartButtonMobile = document.getElementById('cart-button-mobile');
  const checkoutBtn = document.getElementById('cart-btn-checkout');
  const cart = document.getElementById('cart');
  const preloader = document.getElementById('preloader');

  renderCartItems('cart-list');
  renderTotalPrice('cart-total-price');
  isCartEmpty();

  checkoutBtn.addEventListener('click', async () => {
    const cartItems = JSON.parse(localStorage.getItem('cartList'));
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cartItems }),
    });

    const { url } = await response.json();
    window.location.href = url;
  });

  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });

  cartButton.addEventListener('click', () => {
    cart.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  cartButtonMobile.addEventListener('click', () => {
    sidebar.classList.remove('active');
    cart.classList.add('active');
    overlay.classList.add('active');
  });

  // Hide sidebar on outside click
  document.addEventListener('click', (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickToggle = menuToggle.contains(event.target);
    const isClickCart = cartButton.contains(event.target);
    const isClickInsideCart = cart.contains(event.target);

    if (
      !isClickInsideSidebar &&
      !isClickToggle &&
      !isClickCart &&
      !isClickInsideCart
    ) {
      sidebar.classList.remove('active');
      cart.classList.remove('active');
      overlay.classList.remove('active');
    }
  });

  document.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (window.location.pathname.includes('shop.html')) {
    const products = await fetchProducts();
    renderProducts(products, 'shop_wrapper');
  }

  if (window.location.pathname.includes('single-product.html')) {
    const singleProduct = await fetchSingleProduct();
    const similarProducts = await fetchProducts(6);
    renderSingleProduct(singleProduct, 'single-product');
    renderProducts(similarProducts, 'similar-products_wrapper');

    const sideImages = document.querySelectorAll(
      '.single-product-images__other-images_item'
    );

    const mainImage = document.querySelector(
      '.single-product-images__main-image__item'
    );

    const checkoutBtnSingle = document.getElementById('btn-checkout-single');

    singleProduct[0].quantity = 1;

    checkoutBtnSingle.addEventListener('click', async () => {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: singleProduct }),
      });

      const { url } = await response.json();
      window.location.href = url;
    });

    sideImages.forEach((image) => {
      image.addEventListener('click', () => {
        mainImage.src = image.src;
      });
    });

    document.addEventListener('click', (event) => {
      if (event.target && event.target.id === 'add-to-cart-btn') {
        addToCart({
          id: singleProduct[0].id,
          image: singleProduct[0].images[0],
          name: singleProduct[0].name,
          price: singleProduct[0].price,
          quantity: 1,
        });

        cart.classList.add('active');
        overlay.classList.add('active');
      }
    });
  }

  if (
    window.location.pathname.includes('index.html') ||
    window.location.pathname === '/'
  ) {
    const popularCollectionProducts = await fetchProducts(6);
    renderProducts(popularCollectionProducts, 'popular-collection_wrapper');

    const swiper = new Swiper('.swiper', {
      slidesPerView: 2,
      spaceBetween: 20,
      mousewheel: {
        forceToAxis: true,
      },
      // Optional parameters
      direction: 'horizontal',
      autoplay: true,
      loop: true,

      breakpoints: {
        // when window width is >= 320px
        1150: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  }

  preloader.classList.remove('active');
});
