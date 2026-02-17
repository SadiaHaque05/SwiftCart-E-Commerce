document.addEventListener("DOMContentLoaded", () => {
  const allProducts = [];
  const productGrid = document.getElementById("product-grid");
  const productsSection = document.getElementById("products-section");
  const homeContent = document.getElementById("home-content");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const trendingGrid = document.getElementById("trending");

  window.showProductsView = function () {
    if (homeContent) homeContent.classList.add("hidden");
    if (productsSection) productsSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (allProducts.length === 0) loadAllProducts();
  };

  async function loadAllProducts() {
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("hidden");
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const products = await res.json();
      products.forEach((p) => allProducts.push(p));
      renderProducts(allProducts);
      renderTrending(allProducts);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      spinner.classList.add("hidden"); 
    }
  }

  function renderProducts(products) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow flex flex-col";
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

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      if (category === "all") renderProducts(allProducts);
      else renderProducts(allProducts.filter((p) => p.category === category));
    });
  });

  function renderTrending(products) {
    if (!trendingGrid) return;
    trendingGrid.innerHTML = "";

    let trendingProducts =
      products && products.length >= 3
        ? [...products]
            .sort((a, b) => b.rating.rate - a.rating.rate)
            .slice(0, 3)
        : [
            {
              id: 101,
              title: "Leather Jacket",
              price: 99.99,
              category: "men's clothing",
              image: "https://via.placeholder.com/150",
              rating: { rate: 4.7, count: 120 },
            },
            {
              id: 102,
              title: "Wireless Earbuds",
              price: 59.99,
              category: "electronics",
              image: "https://via.placeholder.com/150",
              rating: { rate: 4.5, count: 80 },
            },
            {
              id: 103,
              title: "Diamond Ring",
              price: 199.99,
              category: "jewelery",
              image: "https://via.placeholder.com/150",
              rating: { rate: 4.9, count: 50 },
            },
          ];

    trendingProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow flex flex-col";
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
      trendingGrid.appendChild(card);
    });
  }

  window.showDetails = async function (id) {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const product = await res.json();
      const modal = document.getElementById("product-modal");
      if (!modal) return;
      modal.querySelector("#modal-img").src = product.image;
      modal.querySelector("#modal-title").textContent = product.title;
      modal.querySelector("#modal-desc").textContent = product.description;
      modal.querySelector("#modal-price").textContent = `$${product.price}`;
      modal.querySelector("#modal-rating").textContent =
        `⭐ ${product.rating.rate} (${product.rating.count})`;
      modal.classList.remove("hidden");
    } catch {}
  };

  const backHomeBtn = document.getElementById("back-home");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      if (productsSection) productsSection.classList.add("hidden");
      if (homeContent) homeContent.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const closeModalBtn = document.getElementById("close-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      const modal = document.getElementById("product-modal");
      if (modal) modal.classList.add("hidden");
    });
  }
});
