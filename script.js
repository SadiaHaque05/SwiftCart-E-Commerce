const allProducts = []; // store products
const productGrid = document.getElementById('product-grid');
const productsSection = document.getElementById('products-section');
const homeContent = document.getElementById('home-content');
const filterButtons = document.querySelectorAll('.filter-btn');

// 🔴 Show products view
function showProductsView() {
  // hide homepage sections
  homeContent.classList.add('hidden');
  
  // show products section
  productsSection.classList.remove('hidden');

  // scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // load products only once
  if (allProducts.length === 0) {
    loadAllProducts();
  }
}

// 🔴 Load products from API
async function loadAllProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();
    products.forEach(p => allProducts.push(p));
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// 🔴 Render products
function renderProducts(products) {
  productGrid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow flex flex-col';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="h-48 object-contain mb-2">
      <h3 class="font-semibold truncate mb-1">${product.title}</h3>
      <p class="text-gray-700 mb-1">$${product.price}</p>
      <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded self-start mb-2">${product.category}</span>
      <p class="text-yellow-500 mb-2">⭐ ${product.rating.rate} (${product.rating.count})</p>
      <div class="mt-auto flex gap-2">
        <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="showDetails(${product.id})">Details</button>
        <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// 🔴 Filter products
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    if (category === 'all') {
      renderProducts(allProducts);
    } else {
      renderProducts(allProducts.filter(p => p.category === category));
    }
  });
});
