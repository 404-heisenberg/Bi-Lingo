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

    // Populate key points
    const keyPointsContainer = document.getElementById('key-points');
    keyPointsContainer.innerHTML = `
        <div class="key-points-list">
            ${currentLesson.keyPoints.map((point, index) => `
                <div class="key-point">
                    <div class="point-number">${index + 1}</div>
                    <div>${point}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Populate practice question
    if (currentLesson.practiceQuestion) {
        populatePracticeQuestion(currentLesson.practiceQuestion);
    } else {
        document.getElementById('practice-section').style.display = 'none';
    }
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
        });
    });
}

function populatePracticeQuestion(pq) {
    const practiceCard = document.getElementById('practice-card');
    practiceCard.innerHTML = `
        <div class="practice-question">${pq.question}</div>
        <div class="practice-options" id="practice-options">
            ${pq.options.map((option, index) => `
                <div class="practice-option" data-index="${index}">
                    ${String.fromCharCode(65 + index)}. ${option}
                </div>
            `).join('')}
        </div>
        <button class="btn btn-primary btn-check" id="check-answer" style="display: none;">Check Answer</button>
        <div class="practice-feedback" id="practice-feedback"></div>
    `;

    // Update lesson progress when viewing lesson
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    if (lessonId) {
        updateLessonProgress(lessonId, 50); // Mark as 50% complete when viewed
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
                <strong>✓ Correct!</strong><br>
                ${pq.explanation}
            `;
        } else {
            feedback.className = 'practice-feedback incorrect show';
            feedback.innerHTML = `
                <strong>✗ Not quite right.</strong><br>
                ${pq.explanation}
            `;
        }

        checkBtn.style.display = 'none';
    });
}
