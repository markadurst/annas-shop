// Product data
const products = [
    // Friendship Bracelets
    {
        id: 1,
        name: "Pink Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/pink.jpeg",
        description: "A beautiful pink friendship bracelet made with love. Perfect for sharing with your best friend!",
        colors: ["Pink"],
        materials: "High-quality cotton thread"
    },
    {
        id: 2,
        name: "Blue Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/blue.jpeg",
        description: "A lovely blue friendship bracelet that matches the sky. Great for ocean lovers!",
        colors: ["Blue"],
        materials: "High-quality cotton thread"
    },
    {
        id: 3,
        name: "Green Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/green.jpeg",
        description: "A fresh green friendship bracelet that reminds you of nature. Perfect for outdoor adventures!",
        colors: ["Green"],
        materials: "High-quality cotton thread"
    },
    {
        id: 4,
        name: "Purple Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/purple.jpeg",
        description: "A magical purple friendship bracelet that sparkles with friendship magic!",
        colors: ["Purple"],
        materials: "High-quality cotton thread"
    },
    {
        id: 5,
        name: "Orange Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/orange.jpeg",
        description: "A bright orange friendship bracelet that brings sunshine to your day!",
        colors: ["Orange"],
        materials: "High-quality cotton thread"
    },
    {
        id: 6,
        name: "Yellow Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/yellow.jpeg",
        description: "A cheerful yellow friendship bracelet that spreads happiness wherever you go!",
        colors: ["Yellow"],
        materials: "High-quality cotton thread"
    },
    {
        id: 7,
        name: "Black Friendship Bracelet",
        category: "bracelets",
        price: 5.00,
        image: "images/black.jpeg",
        description: "A stylish black friendship bracelet that goes with everything. Perfect for any outfit!",
        colors: ["Black"],
        materials: "High-quality cotton thread"
    },
    // Keychain Holders
    {
        id: 8,
        name: "Rainbow Keychain Holder",
        category: "keychains",
        price: 7.00,
        image: "images/all_bracelets.jpeg",
        description: "A colorful rainbow keychain holder that keeps your keys organized and adds a pop of color to your bag!",
        colors: ["Rainbow"],
        materials: "Soft fabric with metal ring"
    },
    {
        id: 9,
        name: "Pink Heart Keychain Holder",
        category: "keychains",
        price: 7.00,
        image: "images/pink.jpeg",
        description: "An adorable pink heart-shaped keychain holder that shows your love for organization!",
        colors: ["Pink"],
        materials: "Soft fabric with metal ring"
    },
    {
        id: 10,
        name: "Blue Star Keychain Holder",
        category: "keychains",
        price: 7.00,
        image: "images/blue.jpeg",
        description: "A twinkling blue star keychain holder that makes your keys shine bright!",
        colors: ["Blue"],
        materials: "Soft fabric with metal ring"
    },
    {
        id: 11,
        name: "Green Leaf Keychain Holder",
        category: "keychains",
        price: 7.00,
        image: "images/green.jpeg",
        description: "A nature-inspired green leaf keychain holder that brings the outdoors with you!",
        colors: ["Green"],
        materials: "Soft fabric with metal ring"
    },
    {
        id: 12,
        name: "Purple Unicorn Keychain Holder",
        category: "keychains",
        price: 7.00,
        image: "images/purple.jpeg",
        description: "A magical purple unicorn keychain holder that adds a touch of fantasy to your everyday!",
        colors: ["Purple"],
        materials: "Soft fabric with metal ring"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
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
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" onclick="goToProduct(${product.id})" style="cursor: pointer;">
            <h3 class="product-title" onclick="goToProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart 🛒
            </button>
        </div>
    `).join('');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();
    saveCart();
    showAddToCartAnimation(productId);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty! Add some cute crafts! 💕</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
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