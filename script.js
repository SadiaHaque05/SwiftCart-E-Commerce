const categoryContainer = document.getElementById('categories');
const productGrid = document.getElementById('product-grid');
const trendingGrid = document.getElementById('trending');

const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalRating = document.getElementById('modal-rating');

async function loadCategories() {
  try {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const categories = await res.json();

    categories.forEach(category => {
      const btn = document.createElement('button');
      btn.className = 'bg-white px-4 py-2 rounded shadow hover:bg-blue-100 capitalize';
      btn.innerText = category;
      btn.addEventListener('click', () => loadProducts(category)); 
      categoryContainer.appendChild(btn); 
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadProducts(category) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    const products = await res.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

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

async function loadTrending() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();
    const top3 = products.sort((a,b) => b.rating.rate - a.rating.rate).slice(0,3);
    trendingGrid.innerHTML = '';
    top3.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow flex flex-col';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="h-48 object-contain mb-2">
        <h3 class="font-semibold truncate mb-1">${product.title}</h3>
        <p class="text-gray-700 mb-1">$${product.price}</p>
        <p class="text-yellow-500 mb-2">⭐ ${product.rating.rate}</p>
      `;
      trendingGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading trending products:', error);
  }
}

async function showDetails(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();

    modalImg.src = product.image;
    modalTitle.innerText = product.title;
    modalDesc.innerText = product.description;
    modalPrice.innerText = `$${product.price}`;
    modalRating.innerText = `⭐ ${product.rating.rate} (${product.rating.count})`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } catch (error) {
    console.error('Error loading product details:', error);
  }
}

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

loadCategories();
loadProducts('electronics'); 
loadTrending();