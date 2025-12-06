async function loadBrief() {
    const urlParams = new URLSearchParams(window.location.search);
    const briefId = urlParams.get("b") || "brief001";

    const container = document.getElementById("content");

    try {
        const res = await fetch(`data/${briefId}.json`);
        const data = await res.json();
        
        // تحديث SEO Meta Tags
        updateMetaTags(data, briefId);

        // حساب وقت القراءة
        const readTime = calculateReadTime(data);

        container.innerHTML = `
            <a href="home.html" class="back-button">← العودة للفهرس</a>
            
            <div class="brief-wrapper">
                <div class="brief-container">

                    <!-- Breadcrumb -->
                    <nav class="breadcrumb">
                        <a href="home.html">الرئيسية</a>
                        <span>/</span>
                        <span>الموجزات</span>
                        <span>/</span>
                        <span class="current">${briefId}</span>
                    </nav>

                    <div class="title-block">
                        <h1 class="brief-title">${data.title}</h1>
                        <div class="analytic-divider"></div>
                    </div>
                    
                    <!-- Metadata Bar -->
                    <div class="metadata-bar">
                        <span class="meta-item">📅 ${new Date().toLocaleDateString('ar-SA')}</span>
                        <span class="meta-item">⏱️ ${readTime} دقائق قراءة</span>
                        ${data.expertName ? `<span class="meta-item">👤 ${data.expertName}</span>` : ''}
                    </div>
                    
                    <!-- أزرار المشاركة -->
                    <div class="share-buttons">
                        <span class="share-label">شارك:</span>
                        <button onclick="shareTwitter()" class="share-btn twitter" title="مشاركة على تويتر">𝕏</button>
                        <button onclick="shareWhatsApp()" class="share-btn whatsapp" title="مشاركة على واتساب">📱</button>
                        <button onclick="shareTelegram()" class="share-btn telegram" title="مشاركة على تيليجرام">✈️</button>
                        <button onclick="copyLink()" class="share-btn copy" title="نسخ الرابط">🔗</button>
                        <button onclick="printBrief()" class="share-btn print" title="طباعة">🖨️</button>
                    </div>

                    <div class="summary-box">${data.summary}</div>

                    ${data.audio ? `
                        <div class="audio-box">
                            <div class="audio-grid">
                                <div class="audio-meta">
                                    <h4 class="audio-title">🎙️ تعليق خبير</h4>
                                    <p class="expert-name">${data.expertName || ''}</p>
                                    <audio controls controlsList="nodownload">
                                        <source src="assets/placeholder-audio.mp3" type="audio/mpeg">
                                        متصفحك لا يدعم تشغيل الصوت
                                    </audio>
                                </div>
                                <img src="assets/placeholder-expert.jpg" class="audio-expert-photo" alt="expert">
                            </div>
                        </div>
                    ` : ""}

                    ${data.sections.map((sec, idx) => `
                        <div class="section-block" id="section-${idx}">
                            <span class="section-badge">${sec.badge || 'قسم'}</span>
                            <h3 class="section-title">${sec.title}</h3>
                            <p class="brief-text">${sec.text}</p>

                            ${sec.timeline ? `
                                <div class="timeline-card">
                                    <h4 class="timeline-title">⏰ التسلسل الزمني</h4>
                                    ${sec.timeline.map(item => `
                                        <div class="timeline-item">
                                            <span class="timeline-time">${item.time}</span>
                                            <span class="timeline-event">${item.event}</span>
                                        </div>
                                    `).join("")}
                                </div>
                            ` : ""}

                            ${sec.points ? `
                                <div class="points-wrapper">
                                    <h4 class="points-title">🔹 النقاط الرئيسية</h4>
                                    <ul class="key-points">
                                        ${sec.points.map(p => `<li>${p}</li>`).join("")}
                                    </ul>
                                </div>
                            ` : ""}

                            ${sec.document ? `
                                <div class="document-card">
                                    <h4 class="document-title">📄 نص البيان الرسمي</h4>
                                    <p class="document-text">${sec.document}</p>
                                </div>
                            ` : ""}

                        </div>
                    `).join("")}
                    
                    <!-- Related Briefs -->
                    <div id="relatedBriefs" class="related-section"></div>

                </div>
            </div>
        `;
        
        loadRelatedBriefs(briefId);
        setupProgressBar();
        
    }
    catch (e) {
        container.innerHTML = `
            <a href="home.html" class="back-button">← العودة للفهرس</a>
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h2>تعذّر تحميل الموجز</h2>
                <p>الرجاء المحاولة مرة أخرى أو العودة للصفحة الرئيسية</p>
                <a href="home.html" class="brief-button">العودة للرئيسية</a>
            </div>
        `;
    }
}

function calculateReadTime(data) {
    let wordCount = data.title.split(' ').length + data.summary.split(' ').length;
    data.sections.forEach(sec => {
        wordCount += sec.title.split(' ').length + sec.text.split(' ').length;
    });
    return Math.ceil(wordCount / 200); // متوسط 200 كلمة/دقيقة
}

function updateMetaTags(data, briefId) {
    document.getElementById('pageTitle').textContent = `${data.title} | موجزات سائس`;
    document.getElementById('pageDescription').content = data.summary;
    document.getElementById('ogTitle').content = data.title;
    document.getElementById('ogDescription').content = data.summary;
    document.getElementById('ogUrl').content = `${window.location.origin}${window.location.pathname}?b=${briefId}`;
    document.getElementById('twitterTitle').content = data.title;
    document.getElementById('twitterDescription').content = data.summary;
}

async function loadRelatedBriefs(currentId) {
    try {
        const res = await fetch('data/index.json');
        const allBriefs = await res.json();
        const related = allBriefs.filter(b => b.id !== currentId).slice(0, 3);
        
        if (related.length > 0) {
            document.getElementById('relatedBriefs').innerHTML = `
                <h3 class="related-title">📚 موجزات ذات صلة</h3>
                <div class="related-grid">
                    ${related.map(b => `
                        <a href="index.html?b=${b.id}" class="related-card">
                            <span class="related-category">${b.category || 'عام'}</span>
                            <h4>${b.title}</h4>
                            <p>${b.summary.substring(0, 100)}...</p>
                        </a>
                    `).join('')}
                </div>
            `;
        }
    } catch (e) {
        console.log('لم يتم تحميل الموجزات المرتبطة');
    }
}

function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// دوال المشاركة
function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.querySelector('.brief-title').textContent);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&via=SAISBrief`, '_blank');
}

function shareWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.querySelector('.brief-title').textContent);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareTelegram() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.querySelector('.brief-title').textContent);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('✅ تم نسخ الرابط بنجاح');
    });
}

function printBrief() {
    window.print();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

loadBrief();
