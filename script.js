async function loadBrief() {
    const urlParams = new URLSearchParams(window.location.search);
    const briefId = urlParams.get("b") || "brief001";

    const container = document.getElementById("content");

    try {
        const res = await fetch(`data/${briefId}.json`);
        const data = await res.json();

        container.innerHTML = `
            <div class="brief-container">
                <h2 class="brief-title">${data.title}</h2>
                <p class="brief-text">${data.summary}</p>

                ${data.audio ? `
                    <div class="audio-box">
                        <img src="assets/placeholder-expert.jpg" class="audio-expert-photo">
                        <p>${data.expertName}</p>
                        <audio controls>
                            <source src="assets/placeholder-audio.mp3" type="audio/mpeg">
                        </audio>
                    </div>
                ` : ""}

                ${data.sections.map(sec => `
                    <h3 class="section-title">${sec.title}</h3>
                    <p class="brief-text">${sec.text}</p>
                `).join("")}
            </div>
        `;
    }
    catch (e) {
        container.innerHTML = `<p style="padding:40px;text-align:center;">تعذّر تحميل الموجز.</p>`;
    }
}

loadBrief();
