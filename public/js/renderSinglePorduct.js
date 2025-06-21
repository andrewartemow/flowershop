export const renderSingleProduct = (product, containerId) => {
  let mainImageUrl = product[0].images[0];

  const images = product[0].images
    .map((imageUrl, index) => {
      return `<img class="single-product-images__other-images_item" src="${product[0].images[index]}" alt="bouquet">`;
    })
    .join('');

  const container = document.getElementById(containerId);
  container.innerHtml = '';

  const div = document.createElement('div');
  div.className = 'container';
  div.innerHTML = `
                <div class="single-product-wrapper" id="single-product-wrapper">
                    <div class="single-product-images">
                        <div class="single-product-images__other-images">
                            ${images}
                        </div>
                        <div class="single-product-images__main-image">
                            <img class="single-product-images__main-image__item" src="${mainImageUrl}" alt="bouquet">
                        </div>
                    </div>
                    <div class="single-product-details">
                        <p class="product-title">${product[0].name}</p>
                        <p class="product-price">${product[0].price}$</p>
                        <p class="product-description">${product[0].description}</p>
                        <div class="delivery-returns-details">
                            <ul>
                                <li>
                                    <img src="./assets/icons/check.svg" alt="">
                                    Free delivery on qualifying orders
                                </li>
                                <li>
                                    <img src="./assets/icons/check.svg" alt="">
                                    Free Returns
                                </li>
                            </ul>
                        </div>
                        <a href="policies.html">View our Delivery & Returns Policy</a>
                        <div class="buttons-group">
                            <button class="btn-default" id="add-to-cart-btn">Add To Bag</button>
                            <button class="btn-default-white" id="btn-checkout-single">Checkout</button>
                        </div>
                    </div>
                </div>
  `;

  container.appendChild(div);
};
