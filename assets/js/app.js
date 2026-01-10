const API_URL = "https://dummyjson.com/products";
const grid = document.getElementById("productGrid");
const loader = document.getElementById("loader");
const modal = document.getElementById("productModal");
const form = document.getElementById("productForm");

// Load products
async function loadProducts() {
    try {
        const res = await fetch(API_URL + "?limit=16");
        const data = await res.json();
        displayProducts(data.products);
    } catch {
        alert("Failed to load products");
    } finally {
        loader.style.display = "none";
    }
}

// Display products
function displayProducts(products) {
    grid.innerHTML = "";
    products.forEach(p => {
        grid.innerHTML += `
      <div id="product-${p.id}"
        class="product-card bg-white rounded-xl overflow-hidden shadow-lg">
        <img src="${p.thumbnail}" class="h-48 w-full object-cover">
        <div class="p-4">
          <h3 class="font-bold text-lg">${p.title}</h3>
          <p class="text-indigo-600 font-semibold">$${p.price}</p>
          <span class="text-sm bg-gray-200 px-2 py-1 rounded">${p.category}</span>

          <div class="flex gap-2 mt-4">
            <button onclick='openEditModal(${JSON.stringify(p)})'
              class="flex-1 bg-yellow-400 rounded-lg py-1">Edit</button>
            <button onclick="deleteProduct(${p.id})"
              class="flex-1 bg-red-500 text-white rounded-lg py-1">Delete</button>
          </div>
        </div>
      </div>
    `;
    });
}



// Init
loadProducts();
