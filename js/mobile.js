document.addEventListener('DOMContentLoaded', () => {
    // Sadece mobilde çalışacak SPA mantığı
    if (window.innerWidth > 768) return;

    const body = document.body;
    const mobileBackBtn = document.getElementById('mobileBackBtn');
    const bottomNavItems = document.querySelectorAll('.m-nav-item');
    const categoryCards = document.querySelectorAll('.m-cat-card');
    const header = document.querySelector('.header');
    const welcomeHero = document.getElementById('welcome-hero');
    const mobileCategories = document.getElementById('mobile-categories');

    // Gizlenecek tüm ana bölümler (Anasayfa içeriği hariç)
    const sections = [
        'about', 'fleet-page', 'price-list', 'price-inquiry',
        'tours-section', 'reviews-section', 'stats-section',
        'why-us-section', 'services', 'contact', 'references',
        'gallery', 'blog'
    ];

    // Başlangıçta tüm bölümleri mobilde gizle (SPA modu)
    function hideAllSections() {
        sections.forEach(secId => {
            const el = document.getElementById(secId) || document.querySelector(`.${secId}`);
            if (el) el.style.display = 'none';
        });
    }

    // Ana sayfayı (Hub) göster
    function showHome() {
        hideAllSections();
        if (welcomeHero) welcomeHero.style.display = 'flex';
        if (mobileCategories) mobileCategories.style.display = 'block';
        if (header) header.style.display = 'block';
        if (mobileBackBtn) mobileBackBtn.classList.remove('active');

        // Update Bottom Nav
        updateBottomNav('welcome-hero');
        window.scrollTo(0, 0);
    }

    // Belirli bir bölümü göster
    function showSection(targetId) {
        hideAllSections();

        // Anasayfa elementlerini gizle
        if (welcomeHero) welcomeHero.style.display = 'none';
        if (mobileCategories) mobileCategories.style.display = 'none';

        // Header'ı gizle (daha temiz bir "App" görünümü için)
        if (header) header.style.display = 'none';

        // İlgili bölümü göster
        const targetEl = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
        if (targetEl) {
            targetEl.style.display = 'block';
            targetEl.style.paddingTop = '60px'; // Back button boşluğu
        }

        // Geri butonunu göster
        if (mobileBackBtn) mobileBackBtn.classList.add('active');

        updateBottomNav(targetId);
        window.scrollTo(0, 0);
    }

    function updateBottomNav(targetId) {
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.nav === targetId) {
                item.classList.add('active');
            }
        });
    }

    // Başlangıç durumu
    hideAllSections();
    showHome();

    // Event Listeners
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const target = card.dataset.target;
            showSection(target);
        });
    });

    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('whatsapp')) return; // WhatsApp linkine dokunma
            e.preventDefault();
            const target = item.dataset.nav;
            if (target === 'welcome-hero') {
                showHome();
            } else {
                showSection(target);
            }
        });
    });

    if (mobileBackBtn) {
        mobileBackBtn.addEventListener('click', showHome);
    }
});
