async function loadBrief() {
    const urlParams = new URLSearchParams(window.location.search);
    const briefId = urlParams.get("b") || "brief001";

    const container = document.getElementById("content");

    try {
        const res = await fetch(`data/${briefId}.json`);
        const data = await res.json();

        container.innerHTML = `
            <div class="brief-wrapper">
                <div class="brief-container">

                    <div class="title-block">
                        <h2 class="brief-title">${data.title}</h2>
                        <div class="analytic-divider"></div>
                    </div>

                    <div class="summary-box">${data.summary}</div>

                    ${data.audio ? `
                        <div class="audio-box">
                            <div class="audio-grid">
                                <div class="audio-meta">
                                    <h4 class="audio-title">تعليق خبير</h4>
                                    <p class="expert-name">${data.expertName || ''}</p>
                                    <audio controls>
                                        <source src="assets/placeholder-audio.mp3" type="audio/mpeg">
                                    </audio>
                                </div>
                                <img src="assets/placeholder-expert.jpg" class="audio-expert-photo" alt="expert">
                            </div>
                        </div>
                    ` : ""}

                    ${data.sections.map(sec => `
                        <div class="section-block">
                            <span class="section-badge">${sec.badge || sec.badgeText || 'Section'}</span>
                            <h3 class="section-title">${sec.title}</h3>
                            <p class="brief-text">${sec.text}</p>

                            ${sec.timeline ? `
                                <div class="timeline-card">
                                    ${sec.timeline.map(item => `
                                        <div class="timeline-item">
                                            <span class="timeline-time">${item.time}</span>
                                            <span class="timeline-event">${item.event}</span>
                                        </div>
                                    `).join("")}
                                </div>
                            ` : ""}

                            ${sec.points ? `
                                <ul class="key-points">
                                    ${sec.points.map(p => `<li>${p}</li>`).join("")}
                                </ul>
                            ` : ""}

                            ${sec.document ? `
                                <div class="document-card">
                                    <h4>نص البيان الرسمي</h4>
                                    <p>${sec.document}</p>
                                </div>
                            ` : ""}

                        </div>
                    `).join("")}

                </div>
            </div>
        `;
    }
    catch (e) {
        container.innerHTML = `<p style="padding:40px;text-align:center;">تعذّر تحميل الموجز.</p>`;
    }
}

loadBrief();
