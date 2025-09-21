// Product data
const products = [
    // Friendship Bracelets
    {
        id: 1,
        name: "Friendship Bracelet",
        category: "bracelets",
        price: 3.00,
        image: "images/all_bracelets.jpeg",
        description: "Beautiful handmade friendship bracelets made with love. Perfect for sharing with your best friend! Choose from 7 vibrant colors.",
        colors: [
            "Pink",
            "Blue", 
            "Green",
            "Purple",
            "Orange",
            "Yellow",
            "Black"
        ],
        materials: "High-quality cotton thread"
    },
    // Keychain Holders
    {
        id: 8,
        name: "Keychain Holder",
        category: "keychains",
        price: 5.00,
        image: "images/keychains.jpg",
        description: "A stylish keychain holder that keeps your keys organized and adds personality to your bag! Choose from 9 fun designs.",
        designs: [
            "Cat Party",
            "Noir Owl", 
            "Midnight Llama",
            "Love Birds",
            "Elephant Parade",
            "Sloth Party",
            "Dog Party",
            "Wild Jungle",
            "Neon Shark"
        ],
        materials: "Soft fabric with metal ring"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements - will be set when DOM is loaded
let productsGrid, cartCount, cartSidebar, cartOverlay, cartItems, cartTotal;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    productsGrid = document.getElementById('productsGrid');
    cartCount = document.getElementById('cartCount');
    cartSidebar = document.getElementById('cartSidebar');
    cartOverlay = document.getElementById('cartOverlay');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    
    // Reload cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Only display products if we're on the main page
    if (productsGrid) {
        displayProducts('all');
    }
    updateCartDisplay();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            displayProducts(category);
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Display products based on category
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    // Only update productsGrid if it exists (not on product page)
    if (productsGrid) {
        productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" onclick="goToProduct(${product.id})" style="cursor: pointer;">
            <h3 class="product-title" onclick="goToProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">Click to view options and add to cart</p>
        </div>
    `).join('');
    }
}

// Add product to cart
function addToCart(productId) {
    console.log('Adding to cart:', productId);
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.log('Product not found:', productId);
        return;
    }

    // For keychain holders, redirect to product page for design selection
    if (product.designs) {
        window.location.href = `product.html?id=${productId}`;
        return;
    }

    // For bracelets with multiple colors, redirect to product page for color selection
    if (product.colors && product.colors.length > 1) {
        window.location.href = `product.html?id=${productId}`;
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity:', existingItem.quantity);
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        console.log('Added new item to cart:', product.name);
    }

    // Save to localStorage immediately
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update display if DOM elements are ready
    if (cartCount && cartItems && cartTotal) {
        updateCartDisplay();
    }
    
    showAddToCartAnimation(productId);
}

// Remove product from cart
function removeFromCart(cartKey) {
    cart = cart.filter(item => {
        const itemKey = item.selectedDesign ? `${item.id}-${item.selectedDesign}` : 
                       item.selectedColor ? `${item.id}-${item.selectedColor}` : item.id;
        return itemKey !== cartKey;
    });
    updateCartDisplay();
    saveCart();
}

// Update quantity
function updateQuantity(cartKey, change) {
    const item = cart.find(item => {
        const itemKey = item.selectedDesign ? `${item.id}-${item.selectedDesign}` : 
                       item.selectedColor ? `${item.id}-${item.selectedColor}` : item.id;
        return itemKey === cartKey;
    });
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(cartKey);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    // Check if cart elements exist
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty! Add some cute crafts! 💕</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const itemKey = item.selectedDesign ? `${item.id}-${item.selectedDesign}` : 
                           item.selectedColor ? `${item.id}-${item.selectedColor}` : item.id;
            return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.displayName || item.name}</div>
                    ${item.selectedDesign ? `<div class="cart-item-design">Design: ${item.selectedDesign}</div>` : ''}
                    ${item.selectedColor ? `<div class="cart-item-color">Color: ${item.selectedColor}</div>` : ''}
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${itemKey}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${itemKey}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${itemKey}')">Remove</button>
                </div>
            </div>
        `;
        }).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    if (!cartSidebar || !cartOverlay) return;
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : 'auto';
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show add to cart animation
function showAddToCartAnimation(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.style.transform = 'scale(1.05)';
        productCard.style.boxShadow = '0 15px 40px rgba(255, 107, 157, 0.4)';
        setTimeout(() => {
            productCard.style.transform = '';
            productCard.style.boxShadow = '';
        }, 300);
    }
}

// Go to product page
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty! Add some items first! 💕');
        return;
    }
    
    // Redirect to a simple checkout page
    window.location.href = 'checkout.html';
}

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    if (e.target === cartOverlay) {
        toggleCart();
    }
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});