async function loadBriefList() {
    const container = document.getElementById("brief-list");

    try {
        const res = await fetch("data/index.json");
        const briefs = await res.json();

        container.innerHTML = briefs.map(b => `
            <div class="brief-card">
                <h2 class="brief-title">${b.title}</h2>
                <p class="brief-text">${b.summary}</p>
                <a href="index.html?b=${b.id}" class="brief-button">قراءة الموجز</a>
            </div>
        `).join("");

    } catch (error) {
        container.innerHTML = "<p style='text-align:center;padding:30px;'>تعذر تحميل قائمة الموجزات.</p>";
    }
}

loadBriefList();
