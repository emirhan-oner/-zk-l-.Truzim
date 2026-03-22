# VIP Şoförlü Araç Kiralama Web Sitesi

3M Shuttle benzeri modern, responsive VIP transfer ve şoförlü araç kiralama web sitesi.

## Özellikler

✅ **Modern ve Responsive Tasarım**
- Mobil, tablet ve masaüstü uyumlu
- Modern UI/UX tasarımı
- Smooth scroll ve animasyonlar

✅ **Ana Bölümler**
- Hero section ile transfer sorgulama formu
- Turlar bölümü (dinamik kartlar)
- Müşteri yorumları (otomatik slider)
- "Neden Biz" özellikleri
- Blog yazıları bölümü
- Detaylı footer

✅ **Dinamik İçerik**
- Turlar, yorumlar ve blog yazıları JavaScript ile yönetiliyor
- Kolayca güncellenebilir veri yapısı
- Otomatik slider (5 saniyede bir değişir)

✅ **Form İşlevleri**
- Transfer sorgulama formu
- Şoförlü araç kiralama formu
- Form validasyonu

## Kullanım

1. `index.html` dosyasını tarayıcıda açın
2. İçeriği `js/data.js` dosyasından düzenleyebilirsiniz:
   - `toursData`: Turlar listesi
   - `reviewsData`: Müşteri yorumları
   - `blogData`: Blog yazıları

## Özelleştirme

### Renkler
`css/style.css` dosyasındaki CSS değişkenlerini düzenleyin:
```css
:root {
    --primary-color: #1a1a2e;
    --secondary-color: #16213e;
    --accent-color: #0f3460;
    --gold-color: #d4af37;
}
```

### İletişim Bilgileri
`index.html` dosyasındaki telefon ve e-posta bilgilerini güncelleyin.

### Logo
Header'daki logo metnini ve stilini değiştirebilirsiniz.

## Gelecek Geliştirmeler

- [ ] Gerçek API entegrasyonu (rezervasyon sistemi)
- [ ] Döviz kurları için canlı API
- [ ] Gerçek araç fotoğrafları
- [ ] Blog detay sayfaları
- [ ] İletişim formu backend entegrasyonu
- [ ] Admin paneli (içerik yönetimi)
- [ ] Çoklu dil desteği

## Teknolojiler

- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

## Notlar

- Site tamamen statik HTML/CSS/JS ile çalışıyor
- Backend entegrasyonu için form submit işlemlerini bir API'ye bağlamanız gerekecek
- Gerçek fotoğraflar için `images/` klasörüne görseller ekleyip HTML'de referans edin
