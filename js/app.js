// Global Currency State
let currentCurrency = 'TRY';
let exchangeRatesGlobal = { TRY: 1, USD: 0.03, EUR: 0.027, GBP: 0.023 };
let currencySymbols = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' };

let globalObserver; // Global observer for scroll animations

// Supabase Configuration
const SUPABASE_URL = 'https://utumakcczdgpwrwvcqhv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AG9IRVZBDXIXh31_taytgg_QdPTwYao';
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Initialize App
document.addEventListener('DOMContentLoaded', async function () {
    initTabs();
    
    // Start with static render
    renderTours();
    renderReviews();
    renderBlog();
    renderFleet();
    renderPriceList();
    renderGallery();

    // Apply Supabase dynamism
    if (supabaseClient) {
        await applySupabaseSettings();
        await syncFleetFromSupabase();
    }

    initVehicleModal();
    initStatsAnimation();
    initScrollAnimations();
    initMobileMenu();
    initFormHandlers();
    initPriceInquiryForm();
    initContactForm();
    initCurrencySelector();
    startAutoSlide();
});
async function applySupabaseSettings() {
    try {
        const { data: settings, error } = await supabaseClient.from('site_settings').select('*');
        if (error || !settings) return;

        settings.forEach(set => {
            const val = set.setting_value;
            switch (set.setting_key) {
                case 'welcome_bg':
                    const welcomeHero = document.getElementById('welcome-hero');
                    if (welcomeHero) welcomeHero.style.backgroundImage = `url('${val}')`;
                    break;
                case 'hero_bg':
                    const heroSec = document.getElementById('home');
                    if (heroSec) heroSec.style.backgroundImage = `url('${val}')`;
                    break;
                case 'welcome_title':
                    const luxTitle = document.querySelector('.luxury-title');
                    if (luxTitle) luxTitle.innerText = val;
                    // Also update logo alt
                    const logoImg = document.querySelector('.maybach-emblem img');
                    if(logoImg) logoImg.alt = val + ' Logo';
                    break;
                case 'welcome_slogan':
                    const slogan = document.querySelector('.welcome-slogan');
                    if (slogan) slogan.innerText = val;
                    break;
                case 'welcome_desc':
                    const desc = document.querySelector('.welcome-desc');
                    if (desc) desc.innerText = val;
                    break;
                case 'hero_title':
                    const hTitle = document.querySelector('.hero-title');
                    if (hTitle) hTitle.innerHTML = val;
                    break;
            }
        });
    } catch (e) {
        console.error("Supabase settings apply error:", e);
    }
}

async function syncFleetFromSupabase() {
    try {
        const { data: vehicles, error } = await supabaseClient.from('vehicles').select('*');
        if (error || !vehicles || vehicles.length === 0) return;

        // Map Supabase vehicles to fleetData format
        const remoteFleet = vehicles.map(v => ({
            id: v.id,
            name: v.name,
            type: v.type,
            images: [v.image_url],
            interior: v.features || [],
            price: v.daily_price || 8500
        }));

        // Merge or replace
        // For simplicity: replace fleetData if we have remote vehicles
        if (remoteFleet.length > 0) {
            fleetData = remoteFleet;
            renderFleet();
        }
    } catch (e) {
        console.error("Supabase fleet sync error:", e);
    }
}
// Tab Switching
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.booking-form');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Remove active class from all tabs and forms
            tabButtons.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and corresponding form
            btn.classList.add('active');
            document.getElementById(targetTab + 'Form').classList.add('active');
        });
    });
}

// Helper Formatting
function formatPrice(priceInTRY) {
    const converted = priceInTRY * exchangeRatesGlobal[currentCurrency];
    return converted.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ' + currencySymbols[currentCurrency];
}

// Render Tours
function renderTours() {
    const toursGrid = document.getElementById('toursGrid');
    if (!toursGrid) return;

    toursGrid.innerHTML = toursData.map((tour, index) => `
        <div class="tour-card fade-in-up" style="transition-delay: ${index * 0.1}s">
            <div class="tour-image">
                <i class="fas fa-map-marked-alt"></i>
                ${tour.featured ? '<span class="tour-badge">Önerilen</span>' : ''}
            </div>
            <div class="tour-content">
                <div class="tour-price">${formatPrice(tour.price)}</div>
                <h3 class="tour-name">${tour.name}</h3>
                <div class="tour-date">
                    <i class="fas fa-calendar"></i>
                    ${tour.date}
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers to tour cards
    document.querySelectorAll('.tour-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            // Scroll to contact form or show booking modal
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        });
        // Re-observe if global observer exists
        if (globalObserver) globalObserver.observe(card);
    });
}

// Render Reviews
function renderReviews() {
    const reviewsSlider = document.getElementById('reviewsSlider');
    if (!reviewsSlider) return;

    const reviewsContainer = document.createElement('div');
    reviewsContainer.className = 'reviews-container';

    reviewsContainer.innerHTML = reviewsData.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${review.initial}</div>
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <div class="review-source">
                        <i class="fab fa-tripadvisor"></i>
                        ${review.source}
                    </div>
                </div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');

    reviewsSlider.appendChild(reviewsContainer);

    // Slider Controls
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
            updateReviewSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex + 1) % reviewsData.length;
            updateReviewSlider();
        });
    }
}

// Update Review Slider
function updateReviewSlider() {
    const container = document.querySelector('.reviews-container');
    if (container) {
        container.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
    }
}

// Auto Slide Reviews
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentReviewIndex = (currentReviewIndex + 1) % reviewsData.length;
        updateReviewSlider();
    }, 5000); // Change every 5 seconds
}

// Stop auto slide on hover
document.addEventListener('DOMContentLoaded', () => {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
        reviewsSection.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        reviewsSection.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
});

// Render Blog (açılabilir blog kartları)
function renderBlog() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    blogGrid.innerHTML = blogData.map((blog, index) => `
        <div class="blog-card" data-index="${index}">
            <div class="blog-image">
                <i class="fas fa-newspaper"></i>
                <span class="blog-expand-icon"><i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <p class="blog-date"><i class="fas fa-calendar"></i> ${blog.date}</p>
                <div class="blog-full-content" style="display:none;">
                    <p>${blog.fullContent || blog.excerpt}</p>
                    <button class="blog-close-btn"><i class="fas fa-times"></i> Kapat</button>
                </div>
            </div>
        </div>
    `).join('');

    // Blog aç/kapa
    document.querySelectorAll('.blog-card').forEach((card) => {
        const index = parseInt(card.dataset.index);
        const fullContent = card.querySelector('.blog-full-content');
        const excerpt = card.querySelector('.blog-excerpt');
        const expandIcon = card.querySelector('.blog-expand-icon');
        const closeBtn = card.querySelector('.blog-close-btn');

        card.querySelector('.blog-content').addEventListener('click', (e) => {
            if (e.target.closest('.blog-close-btn')) return;
            if (fullContent.style.display === 'none') {
                fullContent.style.display = 'block';
                excerpt.style.display = 'none';
                if (expandIcon) expandIcon.innerHTML = '<i class="fas fa-chevron-up"></i>';
                card.classList.add('expanded');
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fullContent.style.display = 'none';
                excerpt.style.display = 'block';
                if (expandIcon) expandIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
                card.classList.remove('expanded');
            });
        }
    });
}

// Render Fleet (6 araç) - Mobilde slider, desktop'ta grid
function renderFleet() {
    const fleetGrid = document.getElementById('fleetGrid');
    if (!fleetGrid || typeof fleetData === 'undefined') return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobilde slider
        fleetGrid.className = 'fleet-slider';
        fleetGrid.innerHTML = `
            <div class="fleet-slider-track">
                ${fleetData.map((car, index) => `
                    <div class="fleet-card" data-id="${car.id}">
                        <div class="fleet-image ${car.type}" style="background-image: url('${car.images[0]}'); background-size: cover; background-position: center;">
                            <div class="fleet-image-overlay"></div>
                            <span class="fleet-badge">${car.type === 'maybach' ? 'Maybach' : 'Passat'}</span>
                        </div>
                        <div class="fleet-content">
                            <h3>${car.name}</h3>
                            <p class="fleet-cta"><i class="fas fa-info-circle"></i> Detayları görmek için tıklayın</p>
                            <a href="vehicle-detail.html?id=${car.id}" class="fleet-detail-link">Detaylı Bilgi</a>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="fleet-slider-controls">
                <button class="fleet-slider-btn prev" aria-label="Önceki">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="fleet-slider-dots"></div>
                <button class="fleet-slider-btn next" aria-label="Sonraki">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        initFleetSlider();
    } else {
        // Desktop'ta grid
        fleetGrid.className = 'fleet-grid';
        fleetGrid.innerHTML = fleetData.map((car, index) => `
            <div class="fleet-card fade-in-up" data-id="${car.id}" style="transition-delay: ${index * 0.1}s">
                <div class="fleet-image ${car.type}" style="background-image: url('${car.images[0]}'); background-size: cover; background-position: center;">
                    <div class="fleet-image-overlay"></div>
                    <span class="fleet-badge">${car.type === 'maybach' ? 'Maybach' : 'Passat'}</span>
                </div>
                <div class="fleet-content">
                    <h3>${car.name}</h3>
                    <p class="fleet-cta"><i class="fas fa-info-circle"></i> Detayları görmek için tıklayın</p>
                    <a href="vehicle-detail.html?id=${car.id}" class="fleet-detail-link">Detaylı Bilgi</a>
                </div>
            </div>
        `).join('');
    }

    document.querySelectorAll('.fleet-card').forEach(card => {
        if (globalObserver) globalObserver.observe(card);
        const carId = parseInt(card.dataset.id);
        card.addEventListener('click', () => {
            window.location.href = `vehicle-detail.html?id=${carId}`;
        });
    });
}

// Fleet Slider (Mobil)
let currentFleetSlide = 0;
function initFleetSlider() {
    const track = document.querySelector('.fleet-slider-track');
    const prevBtn = document.querySelector('.fleet-slider-btn.prev');
    const nextBtn = document.querySelector('.fleet-slider-btn.next');
    const dotsContainer = document.querySelector('.fleet-slider-dots');

    if (!track || !prevBtn || !nextBtn) return;

    const totalSlides = fleetData.length;

    // Dots oluştur
    if (dotsContainer) {
        dotsContainer.innerHTML = fleetData.map((_, i) =>
            `<span class="fleet-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>`
        ).join('');
    }

    function updateSlider() {
        const cardWidth = track.querySelector('.fleet-card').offsetWidth;
        const gap = 16;
        const translateX = -(currentFleetSlide * (cardWidth + gap));
        track.style.transform = `translateX(${translateX}px)`;

        // Dots güncelle
        document.querySelectorAll('.fleet-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentFleetSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentFleetSlide = (currentFleetSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentFleetSlide = (currentFleetSlide + 1) % totalSlides;
        updateSlider();
    });

    // Dots tıklama
    document.querySelectorAll('.fleet-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentFleetSlide = i;
            updateSlider();
        });
    });

    // Touch swipe
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                currentFleetSlide = (currentFleetSlide + 1) % totalSlides;
            } else {
                currentFleetSlide = (currentFleetSlide - 1 + totalSlides) % totalSlides;
            }
            updateSlider();
        }
    });

    // Resize'da güncelle
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                updateSlider();
            } else {
                // Desktop'a geçildiğinde fleet'i yeniden render et
                const fleetGrid = document.getElementById('fleetGrid');
                if (fleetGrid && fleetGrid.classList.contains('fleet-slider')) {
                    renderFleet();
                }
            }
        }, 250);
    });
}

// Render Gallery
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || typeof galleryImages === 'undefined') return;

    galleryGrid.innerHTML = galleryImages.map((img, index) => `
        <div class="gallery-item" style="background-image: url('${img.url}');" data-index="${index}" data-supabase-key="gallery_${index + 1}">
            <div class="gallery-overlay">
                <span>${img.title}</span>
            </div>
        </div>
    `).join('');

    // Re-observe if global observer exists
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (globalObserver) globalObserver.observe(item);
    });
}

// Render Price List
function renderPriceList() {
    const tbody = document.getElementById('priceTableBody');
    if (!tbody || typeof priceListData === 'undefined') return;

    tbody.innerHTML = priceListData.map(row => `
        <tr>
            <td>${row.route}</td>
            <td><strong>${formatPrice(row.es_class)}</strong></td>
            <td><strong>${formatPrice(row.s_class)}</strong></td>
        </tr>
    `).join('');
}

// Vehicle Modal
function initVehicleModal() {
    const modal = document.getElementById('vehicleModal');
    const closeBtn = document.getElementById('modalClose');
    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

function openVehicleModal(carId) {
    const car = fleetData.find(c => c.id === carId);
    if (!car) return;

    const modal = document.getElementById('vehicleModal');
    const body = document.getElementById('vehicleModalBody');
    if (!modal || !body) return;

    body.innerHTML = `
        <h2 class="modal-title">${car.name}</h2>
        <p class="modal-subtitle">İç Donanım Özellikleri</p>
        <ul class="vehicle-features-list">
            ${car.interior.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
    `;
    modal.classList.add('active');
}

// Price Inquiry Form
function initPriceInquiryForm() {
    const form = document.getElementById('priceInquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const from = document.getElementById('inquiryFrom')?.value;
        const to = document.getElementById('inquiryTo')?.value;
        const car = document.getElementById('inquiryCar')?.value;
        alert('Fiyat sorgulamanız alınmıştır! En kısa sürede WhatsApp veya telefon ile dönüş yapacağız.');
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mesajınız alınmıştır! En kısa sürede size dönüş yapacağız.');
    });
}

// Stats Animation
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navClose = document.getElementById('navClose');

    if (mobileMenuToggle && mainNav) {
        const toggleMenu = (e) => {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        };

        mobileMenuToggle.addEventListener('click', toggleMenu);
        if (navClose) navClose.addEventListener('click', toggleMenu);

        // Kategori linklerine tıklayınca kapat
        mainNav.querySelectorAll('.m-nav-cat, .nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Mobil dropdown - ana linke tıklayınca aç/kapa
        mainNav.querySelectorAll('.nav-list .dropdown > a').forEach(dropdownLink => {
            dropdownLink.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.parentElement.classList.toggle('active');
                }
            });
        });

        // Dışarı tıklayınca kapat
        document.addEventListener('click', function (e) {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}


// Scroll Animations - Sadece desktop ve istatistikler için
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px'
    };

    globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Sadece istatistik kartlarına animasyon ekle (mobilde de çalışır)
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((el) => {
        el.classList.add('fade-in-up');
        globalObserver.observe(el);
    });

    // Desktop için diğer elementler
    if (window.innerWidth > 768) {
        const animatedElements = document.querySelectorAll('.tour-card, .feature-card, .fleet-card, .blog-card, .service-card, .vision-mission-card');
        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in-up');
            globalObserver.observe(el);
        });

        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach((el, index) => {
            el.classList.add('fade-in-up');
            globalObserver.observe(el);
        });
    }
}

// Form Handlers
function initFormHandlers() {
    const transferForm = document.getElementById('transferForm');
    const chauffeurForm = document.getElementById('chauffeurForm');

    if (transferForm) {
        transferForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(transferForm);
            console.log('Transfer form submitted:', Object.fromEntries(formData));
            alert('Rezervasyon talebiniz alınmıştır! En kısa sürede sizinle iletişime geçeceğiz.');
        });
    }

    if (chauffeurForm) {
        chauffeurForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(chauffeurForm);
            console.log('Chauffeur form submitted:', Object.fromEntries(formData));
            alert('Rezervasyon talebiniz alınmıştır! En kısa sürede sizinle iletişime geçeceğiz.');
        });
    }
}

// Currency & Exchange Rates
function initCurrencySelector() {
    // Fetch live rates
    fetch('https://api.exchangerate-api.com/v4/latest/TRY')
        .then(res => res.json())
        .then(data => {
            exchangeRatesGlobal = {
                TRY: 1,
                USD: data.rates.USD,
                EUR: data.rates.EUR,
                GBP: data.rates.GBP
            };
            // re-render if loaded
            renderTours();
            renderPriceList();
        })
        .catch(err => console.error("Could not fetch exchange rates", err));

    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector) {
        currencySelector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            renderTours();
            renderPriceList();
        });
    }

    // Update old ticker if present
    const usdRate = document.getElementById('usdRate');
    const eurRate = document.getElementById('eurRate');
    if (usdRate) usdRate.textContent = (1 / exchangeRatesGlobal.USD).toFixed(2);
    if (eurRate) eurRate.textContent = (1 / exchangeRatesGlobal.EUR).toFixed(2);
}

// Smooth Scroll for Anchor Links
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

// Add scroll effect to header
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Load image logic here
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

