export const fetchSingleProduct = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');

  const response = await fetch(`api/single-product?id=${idParam}`);
  const singleProduct = await response.json();

  return singleProduct;
};
