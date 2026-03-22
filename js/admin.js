/**
 * Admin Panel & Search Logic
 * Includes dynamic injection of Admin Dashboard and Supabase integration logic.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Search Overlay Logic ---
    const searchBtn = document.getElementById('headerSearchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if(searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.style.display = 'block';
            setTimeout(() => searchInput.focus(), 100); // give time to display
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.style.display = 'none';
        });

        // Close on clicking outside
        searchOverlay.addEventListener('click', (e) => {
            if(e.target === searchOverlay) {
                searchOverlay.style.display = 'none';
            }
        });
    }

    // --- Admin Login Logic ---
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginClose = document.getElementById('adminLoginClose');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginSubmit = document.getElementById('adminLoginSubmit');
    const adminLoginError = document.getElementById('adminLoginError');

    const ADMIN_PASSWORD = "829615"; 

    // Listen to Search Input for magic keyword
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            if(e.target.value.toLowerCase().trim() === 'yönetici') {
                e.target.value = ''; // clear
                searchOverlay.style.display = 'none';
                
                // Show admin login modal
                adminLoginModal.style.display = 'flex';
                adminPasswordInput.value = '';
                adminLoginError.style.display = 'none';
                setTimeout(() => adminPasswordInput.focus(), 100);
            }
        });
    }

    if(adminLoginModal) {
        adminLoginClose.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
        });

        adminLoginSubmit.addEventListener('click', handleAdminLogin);
        adminPasswordInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleAdminLogin();
        });

        function handleAdminLogin() {
            if(adminPasswordInput.value === ADMIN_PASSWORD) {
                adminLoginModal.style.display = 'none';
                openAdminPanel();
            } else {
                adminLoginError.style.display = 'block';
            }
        }
    }

    // --- Admin Panel Dashboard Rendering ---
    function openAdminPanel() {
        const container = document.getElementById('adminDashboardContainer');
        if(!container) return;

        // Render full screen admin panel overlay
        container.innerHTML = `
        <div id="adminPanelOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:var(--bg-dark); z-index:9999; overflow-y:auto; font-family:var(--font-primary);">
            
            <div style="background:var(--gray-900); padding: 1rem 2rem; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--gold);">
                <h2 style="color:var(--gold); margin:0;"><i class="fas fa-cogs"></i> Yönetici Paneli</h2>
                <div>
                    <span style="color:var(--gray-400); margin-right: 1rem;">SUPABASE BAĞLANTISI GEREKLİ</span>
                    <button id="closeAdminPanelBtn" style="background:transparent; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
                </div>
            </div>

            <div style="display:flex; height: calc(100vh - 70px);">
                <!-- Sidebar -->
                <div style="width: 250px; background:var(--bg-dark); border-right:1px solid var(--gray-800); padding: 1rem;">
                    <ul style="list-style:none; padding:0; margin:0;">
                        <li style="margin-bottom: 0.5rem;"><a href="#" class="admin-tab active" data-tab="cars" style="color:var(--gold); text-decoration:none; display:block; padding:0.5rem;"><i class="fas fa-car"></i> Araçları Yönet</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#" class="admin-tab" data-tab="prices" style="color:var(--text-color); text-decoration:none; display:block; padding:0.5rem;"><i class="fas fa-tags"></i> Fiyatları Yönet</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#" class="admin-tab" data-tab="texts" style="color:var(--text-color); text-decoration:none; display:block; padding:0.5rem;"><i class="fas fa-images"></i> Görsel ve Metinler</a></li>
                    </ul>
                </div>

                <!-- Main Content -->
                <div style="flex:1; padding: 2rem; overflow-y:auto; background: #000;">
                    
                    <!-- Cars Tab -->
                    <div id="tab-cars" class="admin-content-section" style="display:block;">
                        <h3 style="color:var(--gold); margin-bottom: 1rem;">Araçlar (Mevcut Görsel ve Fiyatlar)</h3>
                        <p style="color:var(--gray-400); margin-bottom: 1rem;">Buradan siteye ekli araç fotolarını değiştirebilirsiniz (Supabase Storage bağlantısı yapılandıktan sonra çalışacaktır).</p>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                            <!-- Mocked Cars from data.js -->
                            ${fleetData.map(car => `
                                <div style="background:var(--gray-900); border:1px solid var(--gray-800); border-radius:8px; overflow:hidden;">
                                    <img src="${car.images[0]}" style="width:100%; height:180px; object-fit:cover;">
                                    <div style="padding: 1rem;">
                                        <h4 style="color:white; margin:0 0 0.5rem 0;">${car.name}</h4>
                                        <button style="background:var(--gold); color:black; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer; width:100%;">Düzenle / Fotoğraf Değiştir</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Prices Tab -->
                    <div id="tab-prices" class="admin-content-section" style="display:none;">
                        <h3 style="color:var(--gold); margin-bottom: 1rem;">Hizmet Bölgeleri ve Fiyatlandırma</h3>
                        <p style="color:var(--gray-400); margin-bottom: 1rem;">Ankara içi (Esenboğa, Çankaya vb.) VIP transfer ve kiralama fiyatları (2026).</p>
                        <table style="width:100%; border-collapse: collapse; text-align:left;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--gray-800);">
                                    <th style="padding: 1rem; color:var(--gold);">Güzergah / Hizmet</th>
                                    <th style="padding: 1rem; color:var(--gold);">Mercedes E-Class</th>
                                    <th style="padding: 1rem; color:var(--gold);">Mercedes S-Class</th>
                                    <th style="padding: 1rem; color:var(--gold);">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${priceListData.map(p => `
                                    <tr style="border-bottom: 1px solid var(--gray-800);">
                                        <td style="padding: 1rem; color:white;">${p.route}</td>
                                        <td style="padding: 1rem; color:white;">${p.es_class} TL</td>
                                        <td style="padding: 1rem; color:white;">${p.s_class} TL</td>
                                        <td style="padding: 1rem;"><button style="background:#2ecc71; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Güncelle</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Texts Tab -->
                    <div id="tab-texts" class="admin-content-section" style="display:none;">
                        <!-- Will be dynamically loaded from Supabase -->
                        <h3 style="color:var(--gold); margin-bottom: 1rem;">Site Görselleri ve Metinleri</h3>
                        <p style="color:var(--gray-400); margin-bottom: 1rem;">Site üzerindeki tüm fotoğraf ve yazıları güncelleyebilirsiniz.</p>
                        <p style="color:var(--gold); padding:2rem; text-align:center;">Veriler Supabase'den yükleniyor...</p>
                    </div>

                </div>
            </div>
        </div>
        `;

        // Functionality for closing Admin panel
        document.getElementById('closeAdminPanelBtn').addEventListener('click', () => {
            container.innerHTML = '';
        });

        // Tab Switching Logic
        const tabs = container.querySelectorAll('.admin-tab');
        const sections = container.querySelectorAll('.admin-content-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                // Update tabs
                tabs.forEach(t => {
                    t.style.color = 'var(--text-color)';
                    t.classList.remove('active');
                });
                tab.style.color = 'var(--gold)';
                tab.classList.add('active');

                // Update sections
                const target = tab.getAttribute('data-tab');
                sections.forEach(sec => {
                    if(sec.id === 'tab-' + target) {
                        sec.style.display = 'block';
                    } else {
                        sec.style.display = 'none';
                    }
                });

                // Trigger dynamic loads
                if(target === 'texts') loadSettingsTab();
                if(target === 'cars') loadCarsTab();
                if(target === 'prices') loadPricesTab();
            });
        });

        // Initial Load
        loadCarsTab();
    }

    // --- Supabase Setup (Placeholders) ---
    /* 
    LÜTFEN AŞAĞIDAKİ BİLGİLERİ KENDİ SUPABASE PROJENİZE GÖRE DOLDURUN:
    */
    const SUPABASE_URL = 'https://utumakcczdgpwrwvcqhv.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_AG9IRVZBDXIXh31_taytgg_QdPTwYao';
    
    // Yalnızca URL ve Key girildiğinde Supabase'i başlatıyoruz.
    let supabaseClient = null;
    if(SUPABASE_URL !== 'SENIN_SUPABASE_URL_BURAYA' && typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // --- Helper for Supabase Storage Upload ---
    async function uploadToSupabase(file, folder = 'fleet') {
        if(!supabaseClient) {
            alert("Supabase client not initialized.");
            return null;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabaseClient.storage
            .from('images') // Assumes a bucket named 'images' exists
            .upload(filePath, file);

        if (error) {
            console.error("Upload error:", error);
            alert("Upload failed: " + error.message);
            return null;
        }

        const { data: { publicUrl } } = supabaseClient.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    }

    // Örnek Supabase Fonksiyonları
    async function fetchVehiclesFromSupabase() {
        if(!supabaseClient) return null;
        const { data, error } = await supabaseClient
            .from('vehicles')
            .select('*');
        if(error) {
            console.error("Supabase Error fetching vehicles:", error);
            return null;
        }
        return data;
    }

    async function fetchSettingsFromSupabase() {
        if(!supabaseClient) return null;
        const { data, error } = await supabaseClient
            .from('site_settings')
            .select('*');
        if(error) {
            console.error("Supabase Error fetching settings:", error);
            return null;
        }
        return data;
    }

    async function loadCarsTab() {
        const container = document.getElementById('tab-cars');
        if(!container) return;
        
        container.innerHTML = '<h3 style="color:var(--gold); margin-bottom: 1rem;">Araçlar (Mevcut Görsel ve Fiyatlar)</h3><p style="color:var(--gold); text-align:center; padding:2rem;">Araçlar yükleniyor...</p>';

        const vehicles = await fetchVehiclesFromSupabase();
        
        let html = '<h3 style="color:var(--gold); margin-bottom: 1rem;">Araçlar (Mevcut Görsel ve Fiyatlar)</h3>';
        html += '<p style="color:var(--gray-400); margin-bottom: 1rem;">Buradan araç görsellerini ve donanımlarını güncelleyebilirsiniz.</p>';
        
        if(!vehicles || vehicles.length === 0) {
            html += '<p style="color:var(--gray-400);">Henüz araç eklenmemiş veya veritabanı boş. (SQL scriptini çalıştırdığınızdan emin olun).</p>';
        } else {
            html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">';
            vehicles.forEach(car => {
                html += `
                    <div style="background:var(--gray-900); border:1px solid var(--gray-800); border-radius:8px; overflow:hidden;">
                        <img src="${car.image_url}" style="width:100%; height:180px; object-fit:cover;">
                        <div style="padding: 1rem;">
                            <h4 style="color:white; margin:0 0 0.5rem 0;">${car.name}</h4>
                            <p style="color:var(--gray-400); font-size:0.8rem; margin-bottom:1rem;">ID: ${car.id}</p>
                            
                            <label style="display:block; color:var(--gray-400); margin-bottom:0.2rem; font-size:0.8rem;">Görsel URL</label>
                            <input type="text" id="car_img_${car.id}" value="${car.image_url}" style="width:100%; padding:0.5rem; background:black; border:1px solid var(--gray-800); color:white; border-radius:4px; margin-bottom:0.5rem;">
                            
                            <div style="margin-bottom:1rem;">
                                <label style="display:block; color:var(--gray-400); margin-bottom:0.2rem; font-size:0.8rem;">Veya Dosya Yükle</label>
                                <input type="file" id="car_file_${car.id}" accept="image/*" style="width:100%; color:white; font-size:0.8rem;">
                            </div>

                            <button onclick="window.updateCarImage('${car.id}')" style="background:var(--gold); color:black; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer; width:100%; font-weight:bold;">Değişiklikleri Kaydet</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        container.innerHTML = html;
    }

    async function loadPricesTab() {
        const container = document.getElementById('tab-prices');
        if(!container) return;
        
        container.innerHTML = '<h3 style="color:var(--gold); margin-bottom: 1rem;">Hizmet Bölgeleri ve Fiyatlandırma</h3><p style="color:var(--gold); text-align:center; padding:2rem;">Fiyatlar yükleniyor...</p>';
        
        // Bu örnekte fiyatlar statik data.js'den gelmeye devam ediyor ama burayı da Supabase tablosu yapabiliriz.
        // Şimdilik kullanıcıya veri çektiğimizi simüle edelim veya data.js'den renderlayalım.
        let html = '<h3 style="color:var(--gold); margin-bottom: 1rem;">Hizmet Bölgeleri ve Fiyatlandırma</h3>';
        html += '<p style="color:var(--gray-400); margin-bottom: 1rem;">Ankara içi (Esenboğa, Çankaya vb.) VIP transfer fiyatları (2026).</p>';
        html += '<table style="width:100%; border-collapse: collapse; text-align:left;">';
        html += '<thead><tr style="border-bottom: 1px solid var(--gray-800);"><th style="padding: 1rem; color:var(--gold);">Güzergah / Hizmet</th><th style="padding: 1rem; color:var(--gold);">Mercedes E-Class</th><th style="padding: 1rem; color:var(--gold);">Mercedes S-Class</th></tr></thead><tbody>';
        
        priceListData.forEach(p => {
            html += `
                <tr style="border-bottom: 1px solid var(--gray-800);">
                    <td style="padding: 1rem; color:white;">${p.route}</td>
                    <td style="padding: 1rem; color:white;">${p.es_class} TL</td>
                    <td style="padding: 1rem; color:white;">${p.s_class} TL</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    window.updateCarImage = async function(carId) {
        if(!supabaseClient) return;
        const input = document.getElementById(`car_img_${carId}`);
        const fileInput = document.getElementById(`car_file_${carId}`);
        const btn = input.closest('div').querySelector('button');
        const oldText = btn.innerText;
        
        let finalUrl = input.value;

        // Check for file upload
        if (fileInput.files && fileInput.files[0]) {
            btn.innerText = 'Fotoğraf Yükleniyor...';
            const uploadedUrl = await uploadToSupabase(fileInput.files[0], 'fleet');
            if (uploadedUrl) {
                finalUrl = uploadedUrl;
            } else {
                btn.innerText = oldText;
                return;
            }
        }

        btn.innerText = 'Veritabanı Güncelleniyor...';
        const { error } = await supabaseClient
            .from('vehicles')
            .update({ image_url: finalUrl })
            .eq('id', carId);

        if(error) {
            alert('Hata: ' + error.message);
        } else {
            alert('Araç görseli güncellendi!');
            loadCarsTab();
        }
        btn.innerText = oldText;
    };

    async function loadSettingsTab() {
        const container = document.getElementById('tab-texts');
        if(!container) return;
        
        if(!supabaseClient) {
            container.innerHTML = '<p style="color:red; padding:2rem;">Supabase Client başlatılamadı!</p>';
            return;
        }

        const settings = await fetchSettingsFromSupabase();
        
        if(!settings || settings.length === 0) {
            container.innerHTML = '<p style="color:red; margin-top:2rem;">Veriler çekilemedi. Lütfen Supabase SQL scriptini çalıştırdığınıza ve tabloları oluşturduğunuza emin olun.</p>';
            return;
        }

        const grouped = settings.reduce((acc, curr) => {
            if(!acc[curr.setting_group]) acc[curr.setting_group] = [];
            acc[curr.setting_group].push(curr);
            return acc;
        }, {});

        let html = '<h3 style="color:var(--gold); margin-bottom: 1rem;">Site Görselleri ve Metinleri</h3>';
        html += '<p style="color:var(--gray-400); margin-bottom: 1rem;">Site üzerindeki tüm fotoğraf ve yazıları bölüm bölüm buradan güncelleyebilirsiniz.</p>';

        Object.keys(grouped).forEach(groupName => {
            html += `<div style="background:var(--gray-900); padding:1rem; border-radius:8px; margin-bottom:1.5rem; border-left: 4px solid var(--gold);">
                <h4 style="color:white; margin-bottom:1rem;">${groupName}</h4>`;
            
            grouped[groupName].forEach(set => {
                const isImage = set.setting_key.includes('bg') || set.setting_key.includes('logo') || set.setting_value.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
                
                html += `
                    <label style="display:block; color:var(--gray-400); margin-bottom:0.5rem;">${set.description}</label>
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:1.5rem; background:rgba(0,0,0,0.3); padding:1rem; border-radius:5px;">
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="setting_in_${set.setting_key}" value="${set.setting_value.replace(/"/g, '&quot;')}" style="flex:1; padding:0.8rem; background:black; border:1px solid var(--gray-800); color:white; border-radius:4px;">
                            <button onclick="window.updateSetting('${set.setting_key}')" style="background:var(--gold); color:black; border:none; padding:0 1rem; border-radius:4px; font-weight:bold; cursor:pointer;">Metni/URL'yi Güncelle</button>
                        </div>
                        ${isImage ? `
                            <div style="display:flex; align-items:center; gap:15px; border-top:1px solid #222; padding-top:10px; margin-top:5px;">
                                <span style="color:var(--gray-500); font-size:0.8rem;">Veya bilgisayarından yükle:</span>
                                <input type="file" id="setting_file_${set.setting_key}" accept="image/*" onchange="window.uploadSettingFile('${set.setting_key}')" style="color:white; font-size:0.8rem;">
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            html += `</div>`;
        });

        container.innerHTML = html;
    }

    window.updateSetting = async function(key, newValue = null) {
        if(!supabaseClient) return;
        const input = document.getElementById(`setting_in_${key}`);
        const val = newValue !== null ? newValue : input.value;
        
        let btn = null;
        let oldText = "";
        if (input) {
            btn = input.nextElementSibling;
            oldText = btn.innerText;
            btn.innerText = 'Yükleniyor...';
        }
        
        const { error } = await supabaseClient
            .from('site_settings')
            .update({ setting_value: val })
            .eq('setting_key', key);
            
        if(error) {
            alert('Güncelleme hatası:\n' + error.message);
        } else {
            alert('Başarıyla kaydedildi!');
            if (input) input.value = val;
            if(window.applySupabaseSettings) window.applySupabaseSettings();
        }
        if (btn) btn.innerText = oldText;
    };

    window.uploadSettingFile = async function(key) {
        const fileInput = document.getElementById(`setting_file_${key}`);
        if (!fileInput.files || !fileInput.files[0]) return;

        const container = fileInput.parentElement;
        const originalContent = container.innerHTML;
        container.innerHTML = '<span style="color:var(--gold);">Görsel Yükleniyor...</span>';

        const publicUrl = await uploadToSupabase(fileInput.files[0], 'settings');
        if (publicUrl) {
            await window.updateSetting(key, publicUrl);
        }
        
        loadSettingsTab(); // Refresh to restore UI state
    };

    // --- 5-Click Secret Image Editor ---
    let clickCount = 0;
    let lastClickedElement = null;
    let lastClickTime = 0;

    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-supabase-key]') || e.target.closest('.fleet-image') || e.target.closest('.gallery-item');
        if(!target) {
            clickCount = 0;
            return;
        }

        const now = Date.now();
        if(target === lastClickedElement && (now - lastClickTime) < 1000) {
            clickCount++;
        } else {
            clickCount = 1;
        }

        lastClickedElement = target;
        lastClickTime = now;

        if(clickCount === 5) {
            clickCount = 0; // reset
            handleSecretEdit(target);
        }
    });

    async function handleSecretEdit(element) {
        const password = prompt("Yönetici Şifresini Girin:");
        if(password !== ADMIN_PASSWORD) {
            alert("Şifre yanlış!");
            return;
        }

        const choice = confirm("Görseli değiştirmek için:\nTAMAM (OK) -> Bilgisayardan dosya seç\nİPTAL (CANCEL) -> URL yapıştır");

        let newUrl = "";
        if (choice) {
            // File upload
            // We'll create a temporary file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = async (e) => {
                if (e.target.files && e.target.files[0]) {
                    const uploadedUrl = await uploadToSupabase(e.target.files[0], 'express');
                    if (uploadedUrl) {
                        saveUpdatedUrl(element, uploadedUrl);
                    }
                }
            };
            fileInput.click();
            return; // Exit and wait for onchange
        } else {
            // URL prompt
            let currentUrl = "";
            if(element.tagName === 'IMG') {
                currentUrl = element.src;
            } else {
                const bg = window.getComputedStyle(element).backgroundImage;
                currentUrl = bg.replace(/url\(["']?|["']?\)/g, '');
            }
            newUrl = prompt("Yeni Görsel URL'sini Yapıştırın:", currentUrl);
            if(!newUrl || newUrl === currentUrl) return;
            saveUpdatedUrl(element, newUrl);
        }
    }

    async function saveUpdatedUrl(element, newUrl) {
        const supabaseKey = element.getAttribute('data-supabase-key') || element.parentElement.getAttribute('data-supabase-key');
        
        if(supabaseKey) {
            if(!supabaseClient) { alert("Supabase bağlantısı yok!"); return; }
            const { error } = await supabaseClient
                .from('site_settings')
                .update({ setting_value: newUrl })
                .eq('setting_key', supabaseKey);
            
            if(error) {
                alert("Hata: " + error.message);
            } else {
                alert("Görsel başarıyla güncellendi!");
                location.reload(); 
            }
        } else if(element.closest('.fleet-card')) {
            const fleetCard = element.closest('.fleet-card');
            const carId = fleetCard.getAttribute('data-id');
            if(carId && supabaseClient) {
                const { error } = await supabaseClient
                    .from('vehicles')
                    .update({ image_url: newUrl })
                    .eq('id', carId);
                if(error) alert("Hata: " + error.message);
                else {
                    alert("Araç görseli güncellendi!");
                    location.reload();
                }
            } else {
                alert("Bu görselin ID'si bulunamadı veya Supabase bağlı değil.");
            }
        }
    }

});
