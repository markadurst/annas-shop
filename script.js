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
    
    // Create checkout page content
    const checkoutContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Checkout - Anna's Sweet Crafts</title>
            <link rel="stylesheet" href="styles.css">
            <link href="https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">
        </head>
        <body>
            <header class="header">
                <div class="container">
                    <div class="logo">
                        <img src="images/logo.jpg" alt="Anna's Sweet Crafts Logo" class="logo-img">
                        <h1>Anna's Sweet Crafts</h1>
                    </div>
                    <nav class="nav">
                        <a href="index.html" class="nav-link">Home</a>
                        <a href="index.html#products" class="nav-link">Products</a>
                        <a href="index.html#about" class="nav-link">About</a>
                        <a href="index.html#contact" class="nav-link">Contact</a>
                    </nav>
                </div>
            </header>

            <section class="checkout-page">
                <div class="container">
                    <div class="checkout-container">
                        <div class="checkout-header">
                            <h1>Checkout 🛒</h1>
                            <p>Almost ready to get your cute crafts!</p>
                            <p style="background: #fff3cd; padding: 1rem; border-radius: 10px; margin: 1rem 0; border-left: 4px solid #ffc107;">
                                <strong>📧 After placing your order:</strong> We'll email you at <strong>annassweetcrafts@gmail.com</strong> with payment and delivery options!
                            </p>
                        </div>
                        
                        <div class="checkout-content">
                            <div class="checkout-form">
                                <h2>Shipping Information</h2>
                                <form id="checkoutForm">
                                    <div class="form-group">
                                        <label for="name">Full Name</label>
                                        <input type="text" id="name" name="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="email" id="email" name="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Phone Number</label>
                                        <input type="tel" id="phone" name="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="address">Address</label>
                                        <textarea id="address" name="address" rows="3" required></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="city">City</label>
                                        <input type="text" id="city" name="city" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="zip">ZIP Code</label>
                                        <input type="text" id="zip" name="zip" required>
                                    </div>
                                </form>
                            </div>
                            
                            <div class="order-summary">
                                <h2>Order Summary</h2>
                                <div id="orderItems">
                                    <!-- Order items will be populated here -->
                                </div>
                                <div class="order-total">
                                    Total: $<span id="orderTotal">0.00</span>
                                </div>
                                <button class="place-order-btn" onclick="placeOrder()">
                                    Place Order 💕
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="footer">
                <div class="container">
                    <p>&copy; 2024 Anna's Sweet Crafts. Made with 💕 for friends everywhere!</p>
                </div>
            </footer>

            <script>
                // Load cart from localStorage
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Display order items
                function displayOrderItems() {
                    const orderItems = document.getElementById('orderItems');
                    const orderTotal = document.getElementById('orderTotal');
                    
                    if (cart.length === 0) {
                        orderItems.innerHTML = '<p>No items in cart</p>';
                        return;
                    }
                    
                    orderItems.innerHTML = cart.map(item => \`
                        <div class="order-item">
                            <div>
                                <strong>\${item.name}</strong><br>
                                <small>Qty: \${item.quantity}</small>
                            </div>
                            <div>\$\${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    \`).join('');
                    
                    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    orderTotal.textContent = total.toFixed(2);
                }
                
                // Send customer confirmation email
                function sendCustomerConfirmation(orderData) {
                    // Send a separate email to the customer
                    fetch('https://formspree.io/f/mvgbngya', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: orderData.name,
                            email: orderData.email,
                            phone: orderData.phone,
                            address: orderData.address,
                            city: orderData.city,
                            zip: orderData.zip,
                            message: `Order Confirmation - Anna's Sweet Crafts\n\nDear ${orderData.name},\n\nThank you for your order! We're so excited to create these beautiful crafts just for you! 💕\n\nYour Order Details:\n${orderData.items}\n\nTotal: $${orderData.total}\n\nWhat happens next?\n1. Anna will contact you within 24 hours to discuss payment and delivery options\n2. Once payment is arranged, your handmade crafts will be carefully packaged and shipped\n3. You'll receive tracking information when your order ships\n\nIf you have any questions, please don't hesitate to contact us at annassweetcrafts@gmail.com\n\nThank you for supporting Anna's Sweet Crafts!\n\nWith love,\nAnna 💕`
                        })
                    })
                    .catch(error => {
                        console.error('Customer confirmation email failed:', error);
                        // Don't show error to customer, just log it
                    });
                }
                
                // Place order
                function placeOrder() {
                    const form = document.getElementById('checkoutForm');
                    if (!form.checkValidity()) {
                        form.reportValidity();
                        return;
                    }
                    
                    // Collect order data
                    const orderData = {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('address').value,
                        city: document.getElementById('city').value,
                        zip: document.getElementById('zip').value,
                        items: cart.map(item => `${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n'),
                        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
                    };
                    
                    // Send email using Formspree
                    fetch('https://formspree.io/f/mvgbngya', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: orderData.name,
                            email: orderData.email,
                            phone: orderData.phone,
                            address: orderData.address,
                            city: orderData.city,
                            zip: orderData.zip,
                            message: `New Order from Anna's Sweet Crafts!\n\nItems:\n${orderData.items}\n\nTotal: $${orderData.total}\n\nWe will contact you soon for payment and delivery options! 💕`
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            // Send customer confirmation email
                            sendCustomerConfirmation(orderData);
                            
                            // Redirect to confirmation page
                            const confirmationUrl = `order-confirmation.html?name=${encodeURIComponent(orderData.name)}&total=${orderData.total}&items=${cart.length}`;
                            window.location.href = confirmationUrl;
                        } else {
                            throw new Error('Failed to send order');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Still redirect to confirmation page even if email fails
                        const confirmationUrl = `order-confirmation.html?name=${encodeURIComponent(orderData.name)}&total=${orderData.total}&items=${cart.length}`;
                        window.location.href = confirmationUrl;
                    });
                }
                
                // Initialize checkout page
                document.addEventListener('DOMContentLoaded', function() {
                    displayOrderItems();
                });
            </script>
        </body>
        </html>
    `;
    
    // Open checkout in new window
    const checkoutWindow = window.open('', '_blank');
    checkoutWindow.document.write(checkoutContent);
    checkoutWindow.document.close();
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
