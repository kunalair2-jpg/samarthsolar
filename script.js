// ==========================================
// OUT-OF-THE-BOX 20+ YR VETERAN LOGIC CORE
// ==========================================

const products = [
    { id: 1, title: "Dry Robotic Solar Cleaner", desc: "Automated waterless array cleaning robot. AI obstacle avoidance.", price: 150000, category: "solar", image: "assets/dry_solar_robot_1775114525551.png", badge: "SYS.NOMINAL" },
    { id: 2, title: "Double Union UPVC Valve", desc: "High-grade industrial UPVC ball valve. Double union design.", price: 450, category: "valves", image: "assets/upvc_valve_1775114545754.png", badge: "" },
    { id: 3, title: "Flanged Ball Valve", desc: "Heavy-duty flanged ball valve for extreme pressure applications.", price: 1200, category: "valves", image: "assets/flanged_valve_1775114563090.png", badge: "PREMIUM" },
    { id: 4, title: "FRP Square Manhole Cover", desc: "Fiber Reinforced Plastic heavy-duty resilient manhole cover.", price: 1800, category: "frp", image: "assets/frp_manhole_1775114589215.png", badge: "CERT.PASS" },
    { id: 5, title: "PC Online Dripper", desc: "Pressure compensating online agricultural dripping module.", price: 12, category: "irrigation", image: "assets/pc_dripper_1775114609899.png", badge: "BULK.ONLY" },
    { id: 6, title: "FRP Floor Gratings", desc: "Anti-corrosive industrial structural gratings. Extreme durability.", price: 2100, category: "frp", image: "assets/frp_gratings_1775115908053.png", badge: "NEW.DEPLOY" }
];

let cart = [];

// DOM Mounts
const productContainer = document.getElementById('product-container');
const filterBtns = document.querySelectorAll('.pill');
const cartToggle = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-price');
const cartCountEl = document.querySelector('.cart-count');
const modal = document.getElementById('quickview-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

const formatPrice = p => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits:0 }).format(p);

// ==========================================
// 1. MAGNETIC BUTTON PHYSICS
// ==========================================
const initMagneticPhysics = () => {
    const magnetics = document.querySelectorAll('.magnetic');
    
    magnetics.forEach(mag => {
        mag.addEventListener('mousemove', (e) => {
            const bound = mag.getBoundingClientRect();
            const strength = mag.getAttribute('data-strength') || 20;
            const tx = ((e.clientX - bound.left) - (bound.width / 2)) / bound.width * strength;
            const ty = ((e.clientY - bound.top) - (bound.height / 2)) / bound.height * strength;
            
            mag.style.transform = `translate(${tx}px, ${ty}px)`;
        });
        
        mag.addEventListener('mouseleave', () => {
            mag.style.transform = `translate(0px, 0px)`;
            mag.style.transition = `transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)`;
            setTimeout(() => { mag.style.transition = ''; }, 500);
        });
        
        mag.addEventListener('mouseenter', () => {
             mag.style.transition = 'none';
        });
    });
};

// ==========================================
// 2. SPOTLIGHT TRACKING ENGINE
// ==========================================
const attachSpotlightEngine = () => {
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};

// ==========================================
// 3. HARDWARE CATALOG INJECTION
// ==========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if(e.isIntersecting) { e.target.classList.add('revealed'); revealObserver.unobserve(e.target); }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

const renderProducts = (category = 'all') => {
    productContainer.innerHTML = '';
    const items = category === 'all' ? products : products.filter(p => p.category === category);
        
    items.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'spotlight-card scroll-reveal';
        card.style.transitionDelay = `${idx * 0.1}s`;
        
        card.innerHTML = `
            <div class="spotlight-border"></div>
            <div class="card-inner">
                <div class="prd-img-wrap">
                    ${p.badge ? `<span class="prd-badge">${p.badge}</span>` : ''}
                    <button class="prd-eye magnetic" data-id="${p.id}" data-strength="15"><i class="ri-search-2-line"></i></button>
                    <img src="${p.image}" class="prd-img" alt="${p.title}">
                </div>
                <div class="prd-content">
                    <h3 class="prd-title font-syncopate">${p.title}</h3>
                    <p class="prd-desc">${p.desc}</p>
                    <div class="prd-foot">
                        <span class="prd-price">${formatPrice(p.price)}</span>
                        <button class="add-btn magnetic" data-id="${p.id}" data-strength="20"><i class="ri-add-line"></i></button>
                    </div>
                </div>
            </div>
        `;
        productContainer.appendChild(card);
        revealObserver.observe(card);
    });

    initMagneticPhysics();
    attachSpotlightEngine();
    bindHardwareActions();
};

const bindHardwareActions = () => {
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', e => { addToCart(parseInt(e.currentTarget.getAttribute('data-id'))); });
    });
    document.querySelectorAll('.prd-eye').forEach(btn => {
        btn.addEventListener('click', e => { openQuickView(parseInt(e.currentTarget.getAttribute('data-id'))); });
    });
};

filterBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts(e.target.getAttribute('data-filter'));
    });
});

// ==========================================
// 4. ABSTRACT QUEUE & MODAL
// ==========================================
const addToCart = (id) => {
    const p = products.find(x => x.id === id);
    const ex = cart.find(x => x.id === id);
    if(ex) ex.qty++; else cart.push({...p, qty: 1});
    updateCart();
    
    // Abstract pulse on cart
    cartToggle.style.backgroundColor = 'var(--neon)';
    setTimeout(() => cartToggle.style.backgroundColor = '', 500);
};

const updateCart = () => {
    cartCountEl.textContent = cart.reduce((s,i) => s+i.qty, 0);
    cartItemsContainer.innerHTML = '';
    
    if(!cart.length){
        cartItemsContainer.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--muted); font-family:'Syncopate'; font-size:0.8rem;">[ QUEUE EMPTY ]</div>`;
        cartTotalEl.textContent = '₹0';
        return;
    }
    
    let total = 0;
    cart.forEach(i => {
        total += i.price * i.qty;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${i.image}" class="cart-item-img">
                <div class="cart-info">
                    <div class="cart-title">${i.title}</div>
                    <div class="cart-price">${formatPrice(i.price)}</div>
                    <div class="qty-box">
                        <button onclick="changeQty(${i.id}, -1)">-</button>
                        <input type="text" value="${i.qty}" readonly>
                        <button onclick="changeQty(${i.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });
    cartTotalEl.textContent = formatPrice(total);
};

window.changeQty = (id, c) => {
    let item = cart.find(i => i.id === id);
    if(!item) return;
    item.qty += c;
    if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
    updateCart();
};

const openQuickView = (id) => {
    const p = products.find(x => x.id === id);
    modalBody.innerHTML = `
        <div class="modal-img"><img src="${p.image}"></div>
        <div class="modal-data">
            ${p.badge ? `<span style="font-family:'Syncopate'; color:var(--neon); font-size:0.75rem; margin-bottom:1rem; letter-spacing:2px;">[ ${p.badge} ]</span>` : ''}
            <h2 class="font-syncopate" style="font-size:2rem; margin-bottom:1rem;">${p.title}</h2>
            <p style="color:var(--muted); font-size:1.1rem; margin-bottom:3rem;">${p.desc}</p>
            <h3 class="font-syncopate" style="font-size:2rem; color:var(--text); margin-bottom:2rem;">${formatPrice(p.price)}</h3>
            <button class="btn btn-magnetic magnetic" onclick="addToCart(${p.id}); closeModal()"><span class="btn-text">APPEND TO QUEUE</span></button>
        </div>
    `;
    modal.classList.add('active');
    initMagneticPhysics(); // Rebind modal btn
};

const closeModal = () => modal.classList.remove('active');
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });

cartToggle.addEventListener('click', () => { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); });
const closeSide = () => { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); };
closeCartBtn.addEventListener('click', closeSide);
cartOverlay.addEventListener('click', closeSide);

// ==========================================
// 5. GLOBAL INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor tracking
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; });
    
    // Hover invert physics
    document.querySelectorAll('a, button, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));
    
    renderProducts();
    updateCart();
    attachSpotlightEngine();
    initMagneticPhysics();
});
