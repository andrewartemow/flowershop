export const fetchProducts = async (limit) => {
  const response = await fetch(`api/products?limit=${limit}`);
  const products = await response.json();

  return products;
};
