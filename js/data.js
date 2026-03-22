// Turlar Verisi
const toursData = [
    {
        id: 1,
        name: "Ankara Kapadokya VIP Tur",
        price: 15000,
        date: "Her Gün",
        featured: true,
        image: "kapadokya"
    },
    {
        id: 2,
        name: "Ankara Esenboğa - Çankaya Transfer",
        price: 3500,
        date: "7/24",
        featured: true,
        image: "transfer"
    },
    {
        id: 3,
        name: "Ankara İçi Günlük VIP Kiralama",
        price: 12000,
        date: "İsteğe Bağlı",
        featured: true,
        image: "ankara"
    }
];

// Müşteri Yorumları Verisi
const reviewsData = [
    {
        id: 1,
        name: "Adnan Ö",
        initial: "A",
        text: "Esenboğa havalimanından Çankaya'daki otelimize kadar mükemmel bir transfer oldu. Araç E-Class olup tertemizdi. Sürücü çok kibardı.",
        source: "Tripadvisor Yorumu",
        rating: 5
    },
    {
        id: 2,
        name: "Engin İ",
        initial: "E",
        text: "Şirket misafirlerimizi Bilkent'ten alıp havalimanına götürmeleri için VIP transfer talep ettik. BMW 5 Serisi ile zamanında geldiler. Fiyatlar 2026 yılına göre çok makul.",
        source: "Tripadvisor Yorumu",
        rating: 5
    },
    {
        id: 3,
        name: "Nadide G",
        initial: "N",
        text: "Ankara içi günlük araç kiraladık S-Class ile. Haydar Bey'e teşekkürler, çok profesyonel bir şoför.",
        source: "Tripadvisor Yorumu",
        rating: 5
    }
];

// Galeri Fotoğrafları
const galleryImages = [
    { url: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600", title: "Lüks Filomuz" },
    { url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600", title: "Havalimanı Transfer" },
    { url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600", title: "Şoförlü Kiralama" }
];

// Blog Yazıları Verisi
const blogData = [
    {
        id: 1,
        title: "Ankara Esenboğa Havalimanı (ESB) VIP Transfer",
        excerpt: "Esenboğa Havalimanından Çankaya, Bilkent, İncek ve Ümitköy'e lüks segment transfer hizmetleri. 2026 güncel fiyatlar ile kesintisiz konfor.",
        fullContent: "Ankara Esenboğa Havalimanı (ESB) transfer hizmetlerimiz ile başkentin en prestijli noktalarına (Atakule, Gaziosmanpaşa, Beysukent, Ümitköy, İncek) VIP ulaşım sağlıyoruz. Mercedes E/S Class, BMW 5/7 Serisi, Audi A6/A8 ve Range Rover araçlarımızla 2026 fiyat listemiz çerçevesinde hizmet vermekteyiz.",
        date: "15.02.2026",
        image: "esenboga"
    },
    {
        id: 2,
        title: "Ankara Şoförlü Lüks Araç Kiralama",
        excerpt: "Başkentte profesyonel şoförlü VIP kiralama seçenekleri. Günlük 8.000 TL - 25.000 TL aralığında.",
        fullContent: "Şoförlü lüks araç kiralama hizmetimizle günlük veya saatlik olarak Ankara içi ulaşım ihtiyaçlarınızı karşılıyoruz. İş yemekleri, toplantılar, büyükelçilik transferleri için Mercedes S-Class veya BMW 7 Serisi gibi prestijli araçlarımızla profesyonel şoförlerimiz eşliğinde konforu hissedin.",
        date: "10.02.2026",
        image: "chauffeur"
    }
];

// Filo Verisi (Yeni Gerçekçi Lüks Sınıf)
const fleetData = [
    {
        id: 1,
        name: "Mercedes-Benz S-Class",
        type: "sedan",
        icon: "fas fa-gem",
        images: [
            "images/vito.jpg",
            "images/vito.jpg"
        ],
        interior: [
            "Burmester 3D Surround Sistem",
            "Arka koltuk eğlence paketi",
            "Isıtmalı ve havalandırmalı masajlı koltuklar",
            "Panoramik cam tavan",
            "MBUX akıllı asistan",
            "Nappa Deri"
        ]
    },
    {
        id: 2,
        name: "Mercedes-Benz E-Class",
        type: "sedan",
        icon: "fas fa-car",
        images: [
            "images/passat.jpg",
            "images/passat.jpg"
        ],
        interior: [
            "Dijital Kokpit (Widescreen)",
            "Ambient aydınlatma (64 renk)",
            "Konfor odaklı süspansiyon",
            "Gelişmiş güvenlik asistanları",
            "Deri döşeme",
            "Çok bölgeli klima"
        ]
    },
    {
        id: 3,
        name: "BMW 7 Serisi",
        type: "sedan",
        icon: "fas fa-gem",
        images: [
            "images/passat2.jpg",
            "images/passat2.jpg"
        ],
        interior: [
            "BMW Theater Screen (Arka ekran)",
            "Executive Lounge oturma düzeni",
            "Bowers & Wilkins Diamond Ses Sistemi",
            "Panoramik Cam Tavan (Sky Lounge)",
            "Masaj ve havalandırma",
            "Isıtmalı kol dayamalar"
        ]
    },
    {
        id: 4,
        name: "BMW 5 Serisi",
        type: "sedan",
        icon: "fas fa-car",
        images: [
            "images/d09803810737f61b8bf3ba4735068bcc.jpg",
            "images/d09803810737f61b8bf3ba4735068bcc.jpg"
        ],
        interior: [
            "BMW Curved Display",
            "Premium Harman/Kardon Ses Sistemi",
            "Arka koltuk konfor paketi",
            "İklimlendirmeli deri koltuklar",
            "Sürüş asistanı Professional"
        ]
    },
    {
        id: 5,
        name: "Audi A8 L",
        type: "sedan",
        icon: "fas fa-gem",
        images: [
            "images/passat.jpg",
            "images/passat2.jpg"
        ],
        interior: [
            "Genişletilmiş arka diz mesafesi (Long)",
            "Bang & Olufsen 3D Advanced Ses Sistemi",
            "Arka ayak masaj fonksiyonu",
            "Matriks LED okuma ışıkları",
            "Valcona deri kaplama",
            "Hava iyonizeri ve parfümlendirme"
        ]
    },
    {
        id: 6,
        name: "Range Rover Autobiography",
        type: "suv",
        icon: "fas fa-car-side",
        images: [
            "images/vito.jpg",
            "images/vito.jpg"
        ],
        interior: [
            "Meridian Signature 1600W Ses Sistemi",
            "Executive Class arka koltuklar",
            "Soğutmalı/Isıtmalı bardaklıklar",
            "Aktif gürültü engelleme sistemi",
            "Dört bölgeli klima",
            "Pivi Pro 13.1 inç kavisli ekran"
        ]
    }
];

// Transfer Fiyat Listesi (Sadece Ankara)
// Fiyatlar 2026 şartlarına göre 8K - 25K civarı. Transferler 3K-8K
const priceListData = [
    { route: "Esenboğa (ESB) - Çankaya Merkez", es_class: 3500, s_class: 6000 },
    { route: "Esenboğa (ESB) - Gaziosmanpaşa (GOP)", es_class: 3500, s_class: 6000 },
    { route: "Esenboğa (ESB) - Bilkent", es_class: 4000, s_class: 7000 },
    { route: "Esenboğa (ESB) - İncek", es_class: 4500, s_class: 7500 },
    { route: "Esenboğa (ESB) - Ümitköy / Çayyolu", es_class: 4500, s_class: 7500 },
    { route: "Günlük Tahsis (Ankara İçi - 100km / 12 Saat)", es_class: 12000, s_class: 22000 },
    { route: "Yarım Gün Tahsis (Ankara İçi - 50km / 6 Saat)", es_class: 8000, s_class: 14000 }
];

// Döviz Kurları (2026 örnek)
const exchangeRates = {
    usd: 55.40,
    eur: 60.15
};
