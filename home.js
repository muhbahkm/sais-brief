let allBriefs = [];
let filteredBriefs = [];
let currentCategory = 'all';
let currentSort = 'newest';

async function loadBriefList() {
    const container = document.getElementById("brief-list");
    const emptyState = document.getElementById("emptyState");

    try {
        const res = await fetch("data/index.json");
        allBriefs = await res.json();
        filteredBriefs = [...allBriefs];
        
        renderBriefs();
        setupEventListeners();

    } catch (error) {
        container.innerHTML = "<p style='text-align:center;padding:30px;color:#d32f2f;'>⚠️ تعذر تحميل قائمة الموجزات.</p>";
    }
}

function renderBriefs() {
    const container = document.getElementById("brief-list");
    const emptyState = document.getElementById("emptyState");
    
    if (filteredBriefs.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = filteredBriefs.map(b => `
        <div class="brief-card ${b.featured ? 'featured' : ''}" data-aos="fade-up">
            ${b.featured ? '<span class="featured-badge">⭐ مميز</span>' : ''}
            <div class="brief-meta">
                <span class="category-badge category-${b.category}">${b.category || 'عام'}</span>
                <span class="date-badge">📅 ${formatDate(b.publishDate)}</span>
                ${b.readTime ? `<span class="read-time">⏱️ ${b.readTime}</span>` : ''}
            </div>
            <h2 class="brief-card-title">${b.title}</h2>
            <p class="brief-card-summary">${b.summary}</p>
            <a href="index.html?b=${b.id}" class="brief-button">قراءة الموجز ←</a>
        </div>
    `).join("");
}

function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        applyFilters(searchTerm, currentCategory, currentSort);
    });
    
    // الفلترة حسب الفئة
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            applyFilters(searchInput.value.toLowerCase().trim(), currentCategory, currentSort);
        });
    });
    
    // الترتيب
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters(searchInput.value.toLowerCase().trim(), currentCategory, currentSort);
    });
}

function applyFilters(searchTerm, category, sort) {
    filteredBriefs = allBriefs.filter(b => {
        // فلتر البحث
        const matchesSearch = !searchTerm || 
            b.title.toLowerCase().includes(searchTerm) ||
            b.summary.toLowerCase().includes(searchTerm);
        
        // فلتر الفئة
        const matchesCategory = category === 'all' || b.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // الترتيب
    filteredBriefs.sort((a, b) => {
        if (sort === 'newest') {
            return new Date(b.publishDate) - new Date(a.publishDate);
        } else if (sort === 'oldest') {
            return new Date(a.publishDate) - new Date(b.publishDate);
        } else if (sort === 'featured') {
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        return 0;
    });
    
    renderBriefs();
}

// تحميل عند بدء الصفحة
loadBriefList();

// إضافة تأثيرات الظهور التدريجي
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        [data-aos="fade-up"] {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-aos="fade-up"].aos-animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // تفعيل الأنيميشن
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach((el, i) => {
            setTimeout(() => el.classList.add('aos-animate'), i * 100);
        });
    }, 100);
});
