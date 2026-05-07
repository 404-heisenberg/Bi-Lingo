// ========== Lesson Detail Page Logic ==========

let currentLesson = null;
let currentLanguage = 'english';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has completed onboarding
    const profile = getLearnerProfile();
    if (!profile || !profile.completed) {
        window.location.href = 'onboarding.html';
        return;
    }

    // Get lesson ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');

    if (!lessonId || !BiLingoData.lessonDetails[lessonId]) {
        // No valid lesson ID, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }

    currentLesson = BiLingoData.lessonDetails[lessonId];

    // Populate page
    populateLesson();
    setupLanguageTabs();
});

function populateLesson() {
    // Update page title
    document.title = `${currentLesson.title} — Bi-Lingo`;
    document.getElementById('lesson-title').textContent = currentLesson.title;
    document.getElementById('lesson-heading').textContent = currentLesson.title;

    // Update meta info
    const metaContainer = document.getElementById('lesson-meta');
    metaContainer.innerHTML = `
        <div class="lesson-meta-item">
            <span>📚</span>
            <span>${currentLesson.subject}</span>
        </div>
        <div class="lesson-meta-item">
            <span>🎓</span>
            <span>Grade ${currentLesson.grade}</span>
        </div>
    `;

    // Update difficulty badge
    const difficultyBadge = document.getElementById('difficulty-badge');
    difficultyBadge.textContent = 'Medium'; // Default, can be dynamic
    difficultyBadge.className = 'badge badge-warning';

    // Populate explanations
    document.getElementById('explanation-english').innerHTML = formatExplanation(currentLesson.englishExplanation);
    document.getElementById('explanation-isizulu').innerHTML = formatExplanation(currentLesson.isizuluExplanation);
    document.getElementById('explanation-sesotho').innerHTML = formatExplanation(currentLesson.sesothoExplanation);

    renderLocalizedLessonContent();

    renderTutorNotes();
    renderMathTutor();
}

function formatExplanation(text) {
    // Split into paragraphs and format
    return text
        .split('\n\n')
        .map(para => `<p>${para}</p>`)
        .join('');
}

function setupLanguageTabs() {
    const tabs = document.querySelectorAll('#language-tabs .tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const lang = this.dataset.lang;
            currentLanguage = lang;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding content
            contents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`content-${lang}`).classList.add('active');

            renderLocalizedLessonContent();
            renderTutorNotes();
            updateMathResponseLanguage();
        });
    });
}

function renderLocalizedLessonContent() {
    const headings = BiLingoData.lessonUiText[currentLanguage] || BiLingoData.lessonUiText.english;
    const keyPointsHeading = document.getElementById('key-points-heading');
    const practiceHeading = document.getElementById('practice-heading');
    const practiceSubheading = document.getElementById('practice-subheading');
    if (keyPointsHeading) keyPointsHeading.textContent = headings.keyPointsHeading;
    if (practiceHeading) practiceHeading.textContent = headings.practiceHeading;
    if (practiceSubheading) practiceSubheading.textContent = headings.practiceSubheading;

    // Populate key points
    const keyPointsContainer = document.getElementById('key-points');
    const keyPoints = getLocalizedValue(currentLesson.keyPoints, currentLanguage) || [];
    keyPointsContainer.innerHTML = `
        <div class="key-points-list">
            ${keyPoints.map((point, index) => `
                <div class="key-point">
                    <div class="point-number">${index + 1}</div>
                    <div>${point}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Populate practice question
    const practiceQuestion = getLocalizedPracticeQuestion(currentLesson.practiceQuestion, currentLanguage);
    if (practiceQuestion) {
        populatePracticeQuestion(practiceQuestion);
    } else {
        document.getElementById('practice-section').style.display = 'none';
    }
}

function getLocalizedValue(value, lang) {
    if (!value) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') {
        return value[lang] || value.english || null;
    }
    return value;
}

function getLocalizedPracticeQuestion(pq, lang) {
    if (!pq) return null;
    if (pq.question) return pq;
    return pq[lang] || pq.english || null;
}

function populatePracticeQuestion(pq) {
    const practiceCard = document.getElementById('practice-card');
    const labels = pq.labels || {};
    const checkLabel = labels.check || 'Check Answer';
    const correctLabel = labels.correct || '✓ Correct!';
    const incorrectLabel = labels.incorrect || '✗ Not quite right.';
    practiceCard.innerHTML = `
        <div class="practice-question">${pq.question}</div>
        <div class="practice-options" id="practice-options">
            ${pq.options.map((option, index) => `
                <div class="practice-option" data-index="${index}">
                    ${String.fromCharCode(65 + index)}. ${option}
                </div>
            `).join('')}
        </div>
        <button class="btn btn-primary btn-check" id="check-answer" style="display: none;">${checkLabel}</button>
        <div class="practice-feedback" id="practice-feedback"></div>
    `;

    // Update lesson progress when viewing lesson
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    if (lessonId) {
        if (lessonId === 'idioms') {
            updateLessonProgress(lessonId, 60);
        }
    }


    const options = document.querySelectorAll('.practice-option');
    const checkBtn = document.getElementById('check-answer');
    let selectedIndex = null;

    options.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
                return; // Already answered
            }

            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedIndex = parseInt(this.dataset.index);
            checkBtn.style.display = 'inline-flex';
        });
    });

    checkBtn.addEventListener('click', function() {
        if (selectedIndex === null) return;

        const correct = selectedIndex === pq.correctAnswer;
        const feedback = document.getElementById('practice-feedback');

        options.forEach((opt, index) => {
            if (index === pq.correctAnswer) {
                opt.classList.add('correct');
            } else if (index === selectedIndex && !correct) {
                opt.classList.add('incorrect');
            }
        });

        if (correct) {
            feedback.className = 'practice-feedback correct show';
            feedback.innerHTML = `
                <strong>${correctLabel}</strong><br>
                ${pq.explanation}
            `;
        } else {
            feedback.className = 'practice-feedback incorrect show';
            feedback.innerHTML = `
                <strong>${incorrectLabel}</strong><br>
                ${pq.explanation}
            `;
        }

        checkBtn.style.display = 'none';
    });
}

function renderTutorNotes() {
    const section = document.getElementById('tutor-notes-section');
    const container = document.getElementById('tutor-notes');
    if (!section || !container) return;

    if (currentLesson.id !== 'idioms' || !currentLesson.tutorNotes) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    const notes = currentLesson.tutorNotes[currentLanguage] || [];
    container.innerHTML = `
        <div class="tutor-notes-list">
            ${notes.map(note => `
                <div class="tutor-note">
                    <div class="note-question">${note.question}</div>
                    <div class="note-answer">${note.answer}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMathTutor() {
    const section = document.getElementById('math-tutor-section');
    const quickContainer = document.getElementById('math-quick-questions');
    const response = document.getElementById('math-response');
    const input = document.getElementById('math-question-input');
    const askBtn = document.getElementById('math-ask-btn');
    const toggle = document.getElementById('live-mode-toggle');
    const badge = document.getElementById('live-mode-badge');
    if (!section || !quickContainer || !response || !input || !askBtn) return;

    if (currentLesson.id !== 'math-foundations') {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    quickContainer.innerHTML = BiLingoData.mathTutorQuickQuestions.map(item => `
        <button type="button" data-id="${item.id}">${item.text}</button>
    `).join('');

    quickContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const match = BiLingoData.mathTutorQuickQuestions.find(q => q.id === id);
            if (!match) return;
            response.dataset.currentId = id;
            response.textContent = match.responses[currentLanguage];
        });
    });

    if (toggle && badge) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                badge.textContent = 'Live mode enabled';
                input.placeholder = 'Ask a math question (live AI response)';
            } else {
                badge.textContent = 'Demo responses';
                input.placeholder = 'Ask a math question (demo responses)';
            }
        });
    }

    askBtn.onclick = () => {
        const text = input.value.trim();
        if (!text) return;
        response.dataset.currentId = '';
        response.textContent = BiLingoData.mathTutorGenericResponse[currentLanguage];
        input.value = '';
    };
}

function updateMathResponseLanguage() {
    const response = document.getElementById('math-response');
    if (!response || currentLesson.id !== 'math-foundations') return;
    const id = response.dataset.currentId;
    if (!id) {
        response.textContent = BiLingoData.mathTutorGenericResponse[currentLanguage];
        return;
    }
    const match = BiLingoData.mathTutorQuickQuestions.find(q => q.id === id);
    if (match) {
        response.textContent = match.responses[currentLanguage];
    }
}
