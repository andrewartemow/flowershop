export function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);

  products.forEach((product) => {
    const a = document.createElement('a');
    a.className = 'shop_item';
    a.href = `/single-product.html?id=${product.id}`;
    a.innerHTML = `
                    <div class="shop_item_image_wrapper">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="shop__product-details">
                        <div>
                            <p class="product-title">${product.name}</p>
                            <p class="product-price">${product.price}$</p>
                        </div>
                        <p class="product-description">${product.description.slice(
                          0,
                          80
                        )}...</p>                        
                    </div>
                    `;
    container.appendChild(a);
  });
}
