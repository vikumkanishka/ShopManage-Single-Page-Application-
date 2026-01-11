const API_URL = "https://dummyjson.com/products";
const grid = document.getElementById("productGrid");
const loader = document.getElementById("loader");
const modal = document.getElementById("productModal");
const form = document.getElementById("productForm");

// Global array to store products
let productsArray = [];

async function loadProducts() {
    loader.style.display = "flex"; // Show loader
    grid.innerHTML = ""; // Clear grid
    
    try {
        const res = await fetch(API_URL + "?limit=16");
        const data = await res.json();
        productsArray = data.products; // Store in array
        displayProducts(productsArray);
    } catch (error) {
        console.error("Error loading products:", error);
        alert("Failed to load products");
        grid.innerHTML = '<div class="col-span-full text-center text-white text-xl">Failed to load products. Please try again.</div>';
    } finally {
        loader.style.display = "none";
    }
}

function displayProducts(products) {
    grid.innerHTML = "";
  
    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-white text-xl">No products available.</div>';
        return;
    }

    products.forEach(function (p) {
      const productCard = `
        <div id="product-${p.id}"
          class="product-card rounded-xl overflow-hidden shadow-lg h-[500px] w-full flex flex-col">
          
          <img src="${p.thumbnail}" alt="${p.title}" class="h-48 w-full object-cover flex-shrink-0">
  
          <div class="p-4 flex-1 flex flex-col text-white">
            <div class="space-y-2 flex-1">
              <h3 class="font-bold text-lg">${p.title}</h3>
    
              <!-- Description -->
              <p class="text-sm text-gray-200 line-clamp-2">
                ${p.description ? p.description : "No description available."}
              </p>
    
              <p class="text-emerald-400 font-semibold">$${p.price}</p>
    
              <span class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded w-fit">
                ${p.category}
              </span>
  
              <!-- Stock Count -->
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Stock:</span>
                <span class="${p.stock > 0 ? 'text-green-400' : 'text-red-400'}">
                  ${p.stock !== undefined ? p.stock : 'N/A'}
                </span>
              </div>
  
              <!-- Warranty Information -->
              <div class="text-sm text-gray-200">
                <span class="font-medium">Warranty:</span>
                <span>${p.warrantyInformation || 'No warranty information'}</span>
              </div>
            </div>
  
            <div class="flex gap-2 pt-4 flex-shrink-0">
              <button onclick='openEditModal(${JSON.stringify(p).replace(/'/g, "&apos;")})'
                class="buttonEdit flex-1 text-white hover:bg-yellow-500 rounded-lg py-1 transition">
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
      
      grid.innerHTML += productCard;
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
        thumbnail: image.value
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
