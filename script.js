// ---------- signup form ----------
(function wireSignup() {
    // Replace this with your Formspree endpoint (https://formspree.io/f/XXXXXXXX)
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvarprp";

    const form = document.getElementById("signup-form");
    if (!form) return;

    function shake() {
        form.style.animation = "none";
        form.offsetHeight;
        form.style.animation = "shake 0.4s";
    }

    function escapeForHTML(s) {
        return s.replace(
            /[<>&"']/g,
            (c) =>
                ({
                    "<": "&lt;",
                    ">": "&gt;",
                    "&": "&amp;",
                    '"': "&quot;",
                    "'": "&#39;",
                })[c],
        );
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailInput = form.querySelector(
            'input[name="email"]',
        );
        const nameInput = form.querySelector('input[name="name"]');
        const email = emailInput.value.trim();
        const name = nameInput.value.trim();
        if (!name) {
            nameInput.focus();
            shake();
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.focus();
            shake();
            return;
        }

        const btn = form.querySelector("button");
        const originalLabel = btn.textContent;
        btn.textContent = "Adding you…";
        btn.disabled = true;

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name, email: email }),
            });
            if (!res.ok)
                throw new Error(
                    "Formspree responded " + res.status,
                );

            const success = document.createElement("div");
            success.className = "signup-success";
            success.innerHTML =
                '<div class="check">✓</div>' +
                "<div>" +
                "<strong>You're on the list, " +
                escapeForHTML(name.split(" ")[0]) +
                ".</strong>" +
                "<small>We'll reach out as soon as the pilot opens.</small>" +
                "</div>";
            form.replaceWith(success);
        } catch (err) {
            console.error("Signup failed:", err);
            btn.textContent = originalLabel;
            btn.disabled = false;
            // Show an inline error so the user knows to try again or email directly
            let errEl =
                form.parentNode.querySelector(".signup-error");
            if (!errEl) {
                errEl = document.createElement("p");
                errEl.className = "signup-error";
                errEl.style.cssText =
                    "max-width:560px;margin:0.9rem auto 0;font-family:var(--f-mono);font-size:13px;color:#ff8888;text-align:center;";
                form.insertAdjacentElement("afterend", errEl);
            }
            errEl.textContent =
                "Something went wrong on our side. Please try again, or email us directly.";
        }
    });
})();

// ---------- typewriter (languages section) ----------
(function wireTyper() {
    const el = document.getElementById("typer-text");
    const label = document.getElementById("typer-label");
    const en = document.getElementById("typer-en");
    const track = document.getElementById("typer-ticker-track");
    if (!el || !label) return;

    const LINES = [
        { lang: "English", line: "I want to understand." },
        { lang: "isiZulu", line: "Ngifuna ukuqonda." },
        { lang: "isiXhosa", line: "Ndifuna ukuqonda." },
        { lang: "Afrikaans", line: "Ek wil verstaan." },
        { lang: "Sesotho", line: "Ke batla ho utlwisisa." },
        { lang: "Setswana", line: "Ke batla go tlhaloganya." },
        { lang: "Sepedi", line: "Ke nyaka go kwešiša." },
        { lang: "Xitsonga", line: "Ndzi lava ku twisisa." },
        { lang: "Tshivenda", line: "Ndi ṱoḓa u pfesesa." },
        { lang: "siSwati", line: "Ngifuna kucondza." },
        { lang: "isiNdebele", line: "Ngifuna ukuzwisisa." },
    ];

    // build ticker (duplicated for seamless loop)
    if (track) {
        const items = LINES.map(
            (l, i) =>
                '<span class="typer-ticker-item" data-i="' +
                i +
                '">' +
                l.lang +
                "</span>",
        ).join("");
        track.innerHTML = items + items;
    }

    function markActive(i) {
        if (!track) return;
        track
            .querySelectorAll(".typer-ticker-item")
            .forEach((n) => {
                n.classList.toggle("active", +n.dataset.i === i);
            });
    }

    // respect reduced-motion: snap to a static line instead of looping
    const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
        const l = LINES[0];
        label.textContent = l.lang;
        el.textContent = l.line;
        markActive(0);
        return;
    }

    let idx = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    async function loop() {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const l = LINES[idx];
            label.textContent = l.lang;
            markActive(idx);
            en.textContent = "";
            for (let i = 0; i <= l.line.length; i++) {
                el.textContent = l.line.slice(0, i);
                await sleep(55);
            }
            await sleep(1600);
            for (let i = l.line.length; i >= 0; i--) {
                el.textContent = l.line.slice(0, i);
                await sleep(22);
            }
            await sleep(200);
            idx = (idx + 1) % LINES.length;
        }
    }
    loop();
})();

// ---------- phone hero language cycle ----------
(function wirePhoneCycle() {
    const sub = document.getElementById("phone-sub");
    const placeholder =
        document.getElementById("phone-placeholder");
    const qText = document.querySelector("#phone-q .bubble-text");
    const aText = document.querySelector("#phone-a .bubble-text");
    if (!sub || !placeholder || !qText || !aText) return;

    // Same conversation, four languages. The English meaning underneath the
    // tutor reply stays constant — that's what the dashed-underline line is for.
    // Translation provenance: isiZulu and Sesotho lines are composed by analogy
    // and need native-speaker review before production. Afrikaans and English
    // are reliable.
    const TURNS = [
        {
            sub: "isiZulu · Grade 7 science",
            placeholder: "Buza noma ini…",
            q: "Angiqondi ukuthi i-photosynthesis yenziwa kanjani.",
            a: "Cabanga ngeqabunga njengompheki omncane osebenza ngelanga — uhlanganisa amanzi nomoya ukuze enze ukudla kwesihlahla.",
        },
        {
            sub: "Afrikaans · Graad 7 wetenskap",
            placeholder: "Vra enigiets…",
            q: "Ek verstaan nie hoe fotosintese werk nie.",
            a: "Dink aan \u2019n blaar soos \u2019n klein sjef wat deur sonlig aangedryf word — dit meng water en lug om die boom se kos te maak.",
        },
        {
            sub: "Sesotho · Sehlopha sa 7 saense",
            placeholder: "Botsa eng kapa eng…",
            q: "Ha ke utlwisise hore na photosynthesis e sebetsa jwang.",
            a: "Nahana ka lekare jwalo ka moapehi e monyane ya tsamaiswang ke letsatsi — o kopanya metsi le moya ho etsa dijo tsa sefate.",
        },
        {
            sub: "English · Grade 7 science",
            placeholder: "Ask anything…",
            q: "I don\u2019t understand how photosynthesis works.",
            a: "Think of a leaf like a tiny chef powered by sunlight — it mixes water and air to make the tree\u2019s food.",
        },
    ];

    // Render the first turn immediately so the page never shows empty bubbles.
    const fades = [sub, placeholder, qText, aText];
    function paint(turn) {
        sub.textContent = turn.sub;
        placeholder.textContent = turn.placeholder;
        qText.textContent = turn.q;
        aText.textContent = turn.a;
    }
    paint(TURNS[0]);

    // Reduced motion: leave the first turn on screen, don't cycle.
    const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    // Cycle. Fade everything out together, swap text mid-fade, fade back in.
    // Pause on hover so a curious reader can dwell on a language.
    let idx = 0;
    let paused = false;
    const phone = document.querySelector(".hero-visual");
    if (phone) {
        phone.addEventListener("mouseenter", () => {
            paused = true;
        });
        phone.addEventListener("mouseleave", () => {
            paused = false;
        });
    }

    const HOLD_MS = 5200; // time each language stays on screen
    const FADE_MS = 350; // matches CSS transition

    setInterval(() => {
        if (paused) return;
        if (document.hidden) return; // don't churn in a backgrounded tab
        fades.forEach((el) => el.classList.add("is-out"));
        setTimeout(() => {
            idx = (idx + 1) % TURNS.length;
            paint(TURNS[idx]);
            fades.forEach((el) => el.classList.remove("is-out"));
        }, FADE_MS);
    }, HOLD_MS);
})();
