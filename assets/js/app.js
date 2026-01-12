const API_URL = "https://dummyjson.com/products";
const grid = document.getElementById("productGrid");
const loader = document.getElementById("loader");
const modal = document.getElementById("productModal");
const form = document.getElementById("productForm");

// Global array to store products
let productsArray = [];

async function loadProducts() {
    try {
        const res = await fetch(API_URL + "?limit=16");
        const data = await res.json();
        productsArray = data.products; // Store in array
        displayProducts(productsArray);
    } catch {
        alert("Failed to load products");
    } finally {
        loader.style.display = "none";
    }
}

function displayProducts(products) {
    grid.innerHTML = "";
  
    products.forEach(function (p) {
      grid.innerHTML += `
        <div id="product-${p.id}"
          class="product-card rounded-xl overflow-hidden shadow-lg">
          
          <img src="${p.thumbnail}" class="h-48 w-full object-cover">
  
          <div class="p-4 space-y-2">
            <h3 class="font-bold text-lg">${p.title}</h3>
  
            <!-- Description -->
            <p class="text-sm text-gray-600 line-clamp-2">
              ${p.description ? p.description : "No description available."}
            </p>
  
            <p class="text-indigo-600 font-semibold">$${p.price}</p>
  
            <span class="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
              ${p.category}
            </span>

            <!-- Stock Count -->
            <div class="flex items-center gap-2 text-sm">
              <span class="font-medium">Stock:</span>
              <span class="${p.stock > 0 ? 'text-green-600' : 'text-red-600'}">
                ${p.stock !== undefined ? p.stock : 'N/A'}
              </span>
            </div>

            <!-- Warranty Information -->
            <div class="text-sm text-gray-700">
              <span class="font-medium">Warranty:</span>
              <span>${p.warrantyInformation || 'No warranty information'}</span>
            </div>
  
            <div class="flex gap-2 mt-4">
              <button onclick='openEditModal(${JSON.stringify(p)})'
                class="buttonEdit flex-1 hover:bg-yellow-500 rounded-lg py-1 transition">
                Edit
              </button>
  
              <button onclick="deleteProduct(${p.id})"
                class="buttonDelete flex-1 hover:bg-red-600 text-white rounded-lg py-1 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    });
}

function openAddModal() {
    form.reset();
    productId.value = "";
    modalTitle.innerText = "Add Product";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function openEditModal(product) {
    modalTitle.innerText = "Edit Product";
    productId.value = product.id;
    title.value = product.title;
    description.value = product.description || "";
    price.value = product.price;
    category.value = product.category;
    image.value = product.thumbnail;
    stock.value = product.stock || 0;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function closeModal() {
    modal.classList.add("hidden");
}

form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const id = productId.value;

    const product = {
        title: title.value,
        description: description.value,
        price: price.value,
        category: category.value,
        thumbnail: image.value,
        stock: parseInt(stock.value) || 0
    };

    try {
        if (id) {
            await fetch(API_URL + "/" + id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });
            // Update in array
            const index = productsArray.findIndex(function(p) {
                return p.id == id;
            });
            if (index !== -1) {
                productsArray[index] = { ...productsArray[index], ...product };
            }
            alert("Product Updated");
        } else {
            const res = await fetch(API_URL + "/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });
            const newProduct = await res.json();
            // Add to array
            productsArray.unshift(newProduct);
            alert("Product Added");
        }
        closeModal();
        displayProducts(productsArray); // Display from array
    } catch {
        alert("Save failed");
    }
});

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(API_URL + "/" + id, { method: "DELETE" });
    // Remove from array
    productsArray = productsArray.filter(function(p) {
        return p.id !== id;
    });
    document.getElementById("product-" + id).remove();
}

loadProducts();
