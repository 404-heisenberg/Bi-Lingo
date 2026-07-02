// ========== Lesson Detail Page Logic ==========

let currentLesson = null;
let currentLanguage = 'english';
let isCustomLesson = false;
let quizState = {
    currentQuestion: 0,
    score: 0,
    answersGiven: 0,
    finished: false
};

document.addEventListener('DOMContentLoaded', function() {
    const profile = getLearnerProfile();
    if (!profile || !profile.completed) {
        window.location.href = 'onboarding.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');

    if (!lessonId) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Check if custom lesson
    if (lessonId.startsWith('custom-')) {
        isCustomLesson = true;
        var customLesson = getCustomLessonById(lessonId);
        if (!customLesson) {
            window.location.href = 'dashboard.html';
            return;
        }
        currentLesson = customLesson;
        populateCustomLesson();
    } else if (BiLingoData.lessonDetails[lessonId]) {
        currentLesson = BiLingoData.lessonDetails[lessonId];
        populateLesson();
        setupLanguageTabs();
    } else {
        window.location.href = 'dashboard.html';
        return;
    }

    // Check for quiz hash
    if (window.location.hash === '#quiz' && isCustomLesson && currentLesson.quiz) {
        setTimeout(startQuiz, 500);
    }
});

// ========== Built-in Lesson Rendering ==========

function populateLesson() {
    document.title = currentLesson.title + ' — Bi-Lingo';
    document.getElementById('lesson-title').textContent = currentLesson.title;
    document.getElementById('lesson-heading').textContent = currentLesson.title;

    const metaContainer = document.getElementById('lesson-meta');
    metaContainer.innerHTML = `
        <div class="lesson-meta-item"><span>📚</span><span>${currentLesson.subject}</span></div>
        <div class="lesson-meta-item"><span>🎓</span><span>Grade ${currentLesson.grade}</span></div>
    `;

    const difficultyBadge = document.getElementById('difficulty-badge');
    difficultyBadge.textContent = 'Medium';
    difficultyBadge.className = 'badge badge-warning';

    document.getElementById('explanation-english').innerHTML = formatExplanation(currentLesson.englishExplanation);
    document.getElementById('explanation-isizulu').innerHTML = formatExplanation(currentLesson.isizuluExplanation);
    document.getElementById('explanation-sesotho').innerHTML = formatExplanation(currentLesson.sesothoExplanation);

    renderLocalizedLessonContent();
    renderTutorNotes();
    renderMathTutor();
}

function formatExplanation(text) {
    return text.split('\n\n').map(function(para) { return '<p>' + para + '</p>'; }).join('');
}

function setupLanguageTabs() {
    var tabs = document.querySelectorAll('#language-tabs .tab');
    var contents = document.querySelectorAll('.tab-content');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var lang = this.dataset.lang;
            currentLanguage = lang;

            tabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');

            contents.forEach(function(content) { content.classList.remove('active'); });
            document.getElementById('content-' + lang).classList.add('active');

            renderLocalizedLessonContent();
            renderTutorNotes();
            if (typeof updateMathResponseLanguage === 'function') updateMathResponseLanguage();
        });
    });
}

function renderLocalizedLessonContent() {
    var headings = BiLingoData.lessonUiText[currentLanguage] || BiLingoData.lessonUiText.english;
    var keyPointsHeading = document.getElementById('key-points-heading');
    var practiceHeading = document.getElementById('practice-heading');
    var practiceSubheading = document.getElementById('practice-subheading');
    if (keyPointsHeading) keyPointsHeading.textContent = headings.keyPointsHeading;
    if (practiceHeading) practiceHeading.textContent = headings.practiceHeading;
    if (practiceSubheading) practiceSubheading.textContent = headings.practiceSubheading;

    var keyPointsContainer = document.getElementById('key-points');
    var keyPoints = getLocalizedValue(currentLesson.keyPoints, currentLanguage) || [];
    keyPointsContainer.innerHTML = '<div class="key-points-list">' + keyPoints.map(function(point, index) {
        return '<div class="key-point"><div class="point-number">' + (index + 1) + '</div><div>' + point + '</div></div>';
    }).join('') + '</div>';

    var practiceQuestion = getLocalizedPracticeQuestion(currentLesson.practiceQuestion, currentLanguage);
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
    var practiceCard = document.getElementById('practice-card');
    var labels = pq.labels || {};
    var checkLabel = labels.check || 'Check Answer';
    var correctLabel = labels.correct || '✓ Correct!';
    var incorrectLabel = labels.incorrect || '✗ Not quite right.';

    practiceCard.innerHTML = `
        <div class="practice-question">${pq.question}</div>
        <div class="practice-options" id="practice-options">
            ${pq.options.map(function(option, index) {
                return '<div class="practice-option" data-index="' + index + '">' + String.fromCharCode(65 + index) + '. ' + option + '</div>';
            }).join('')}
        </div>
        <button class="btn btn-primary btn-check" id="check-answer" style="display:none;">${checkLabel}</button>
        <div class="practice-feedback" id="practice-feedback"></div>
    `;

    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    if (lessonId && lessonId === 'idioms') {
        updateLessonProgress(lessonId, 60);
    }

    var options = document.querySelectorAll('.practice-option');
    var checkBtn = document.getElementById('check-answer');
    var selectedIndex = null;

    options.forEach(function(option) {
        option.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) return;
            options.forEach(function(opt) { opt.classList.remove('selected'); });
            this.classList.add('selected');
            selectedIndex = parseInt(this.dataset.index);
            checkBtn.style.display = 'inline-flex';
        });
    });

    checkBtn.addEventListener('click', function() {
        if (selectedIndex === null) return;
        var correct = selectedIndex === pq.correctAnswer;
        var feedback = document.getElementById('practice-feedback');

        options.forEach(function(opt, index) {
            if (index === pq.correctAnswer) opt.classList.add('correct');
            else if (index === selectedIndex && !correct) opt.classList.add('incorrect');
        });

        if (correct) {
            feedback.className = 'practice-feedback correct show';
            feedback.innerHTML = '<strong>' + correctLabel + '</strong><br>' + pq.explanation;
        } else {
            feedback.className = 'practice-feedback incorrect show';
            feedback.innerHTML = '<strong>' + incorrectLabel + '</strong><br>' + pq.explanation;
        }
        checkBtn.style.display = 'none';
    });
}

function renderTutorNotes() {
    var section = document.getElementById('tutor-notes-section');
    var container = document.getElementById('tutor-notes');
    if (!section || !container) return;

    if (!currentLesson.tutorNotes || currentLesson.id !== 'idioms') {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    var notes = currentLesson.tutorNotes[currentLanguage] || [];
    container.innerHTML = '<div class="tutor-notes-list">' + notes.map(function(note) {
        return '<div class="tutor-note"><div class="note-question">' + note.question + '</div><div class="note-answer">' + note.answer + '</div></div>';
    }).join('') + '</div>';
}

function renderMathTutor() {
    var section = document.getElementById('math-tutor-section');
    var quickContainer = document.getElementById('math-quick-questions');
    var responseEl = document.getElementById('math-response');
    var input = document.getElementById('math-question-input');
    var askBtn = document.getElementById('math-ask-btn');
    if (!section || !quickContainer) return;

    if (currentLesson.id !== 'math-foundations') {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    // Populate demo quick questions
    quickContainer.innerHTML = BiLingoData.mathTutorQuickQuestions.map(function(item) {
        return '<button type="button" class="quick-question-btn" data-id="' + item.id + '">' + item.text + '</button>';
    }).join('');

    quickContainer.querySelectorAll('button').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            var match = BiLingoData.mathTutorQuickQuestions.find(function(q) { return q.id === id; });
            if (!match) return;
            responseEl.innerHTML = '<div class="language-content" style="margin-top:0.5rem;">' +
                '<div class="lang-label">' + currentLanguage + '</div>' +
                '<div>' + formatAnswer(match.responses[currentLanguage]) + '</div></div>';
        });
    });

    // Handle custom question input — redirect to live tutor
    if (askBtn && input) {
        askBtn.onclick = function() {
            var text = input.value.trim();
            if (!text) return;
            responseEl.innerHTML = '<div class="card" style="padding:1rem;margin-top:0.75rem;text-align:center;border:1px dashed var(--accent);">' +
                '<p style="font-size:14px;color:var(--fg-dim);margin-bottom:0.75rem;">That\'s a good question — this is a demo. Start your own lesson where I can answer it for you.</p>' +
                '<a href="tutor.html" class="btn btn-primary btn-sm">Start your own lesson →</a>' +
                '</div>';
            input.value = '';
        };
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') askBtn.onclick();
        });
    }
}

function formatAnswer(answer) {
    return answer
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// ========== Custom Lesson Rendering ==========

function populateCustomLesson() {
    document.title = currentLesson.title + ' — Bi-Lingo';
    document.getElementById('lesson-title').textContent = currentLesson.title;
    document.getElementById('lesson-heading').textContent = currentLesson.title;

    var metaContainer = document.getElementById('lesson-meta');
    metaContainer.innerHTML = `
        <div class="lesson-meta-item"><span>📚</span><span>${escapeHtml(currentLesson.subject)}</span></div>
        <div class="lesson-meta-item"><span>📂</span><span>${escapeHtml(currentLesson.topic)}</span></div>
        <div class="lesson-meta-item"><span>⭐</span><span>Your lesson</span></div>
    `;

    var difficultyBadge = document.getElementById('difficulty-badge');
    difficultyBadge.textContent = currentLesson.difficulty || 'Medium';
    difficultyBadge.className = 'badge badge-' + ((currentLesson.difficulty || '').toLowerCase() === 'easy' ? 'success' : (currentLesson.difficulty || '').toLowerCase() === 'hard' ? 'danger' : 'warning');

    // Show single language (English) for custom lessons
    document.getElementById('explanation-english').innerHTML = '<p>' + escapeHtml(currentLesson.explanation).replace(/\n/g, '<br>') + '</p>';
    document.getElementById('content-english').classList.add('active');

    // Hide other language tabs and content
    var tabs = document.querySelectorAll('#language-tabs .tab');
    tabs.forEach(function(t) {
        if (t.dataset.lang !== 'english') t.style.display = 'none';
    });
    var contents = document.querySelectorAll('.tab-content');
    contents.forEach(function(c) {
        if (c.id !== 'content-english') c.style.display = 'none';
    });

    // Hide built-in lesson sections
    document.getElementById('practice-section').style.display = 'none';
    document.getElementById('tutor-notes-section').style.display = 'none';
    document.getElementById('math-tutor-section').style.display = 'none';

    // Show custom quiz section if quiz exists
    if (currentLesson.quiz && currentLesson.quiz.questions && currentLesson.quiz.questions.length > 0) {
        var quizSection = document.getElementById('custom-quiz-section');
        quizSection.style.display = 'block';
        setupQuiz();
    }

    // Populate key points
    var keyPointsContainer = document.getElementById('key-points');
    var keyPoints = currentLesson.keyPoints || [];
    keyPointsContainer.innerHTML = '<div class="key-points-list">' + keyPoints.map(function(point, index) {
        return '<div class="key-point"><div class="point-number">' + (index + 1) + '</div><div>' + escapeHtml(point) + '</div></div>';
    }).join('') + '</div>';

    // Update progress
    var lessonId = currentLesson.id;
    if (lessonId) updateLessonProgress(lessonId, 50);

    // Hide lang tabs heading
    document.getElementById('language-tabs').style.display = 'none';
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ========== Quiz Logic ==========

function setupQuiz() {
    var dailyCount = getDailyQuizCount();
    var counterEl = document.getElementById('quiz-counter');

    if (dailyCount >= 10) {
        counterEl.textContent = '⚠️ You\'ve used all 10 questions today. Come back tomorrow!';
        document.getElementById('quiz-start-btn').disabled = true;
        return;
    }

    var totalQuestions = currentLesson.quiz.questions.length;
    document.getElementById('quiz-available').textContent = totalQuestions;
    counterEl.textContent = 'Today: ' + dailyCount + '/10 questions used';

    document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
}

function startQuiz() {
    quizState = { currentQuestion: 0, score: 0, answersGiven: 0, finished: false };

    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';

    var dailyCount = getDailyQuizCount();
    if (dailyCount >= 10) {
        showQuizError('You\'ve reached the daily limit of 10 questions. Come back tomorrow!');
        return;
    }

    showQuestion();
}

function showQuestion() {
    var questions = currentLesson.quiz.questions;
    var content = document.getElementById('quiz-content');

    if (quizState.currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }

    var q = questions[quizState.currentQuestion];
    var letters = ['A', 'B', 'C', 'D'];

    content.innerHTML = `
        <div class="quiz-progress" style="font-size:12px;color:var(--fg-mute);font-family:var(--f-mono);margin-bottom:1rem;">
            Question ${quizState.currentQuestion + 1} of ${questions.length}
        </div>
        <div class="practice-question" style="margin-bottom:1.25rem;">${escapeHtml(q.question)}</div>
        <div class="practice-options" id="quiz-options">
            ${q.options.map(function(opt, idx) {
                return '<div class="practice-option" data-index="' + idx + '">' + letters[idx] + '. ' + escapeHtml(opt) + '</div>';
            }).join('')}
        </div>
        <button class="btn btn-primary btn-check" id="quiz-submit" style="display:none;margin-top:1rem;">Submit Answer</button>
        <div class="practice-feedback" id="quiz-feedback" style="margin-top:0.75rem;"></div>
        <button class="btn btn-outline" id="quiz-next" style="display:none;margin-top:1rem;">Next Question</button>
    `;

    var options = document.querySelectorAll('#quiz-options .practice-option');
    var submitBtn = document.getElementById('quiz-submit');
    var selectedIndex = null;

    options.forEach(function(opt) {
        opt.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) return;
            options.forEach(function(o) { o.classList.remove('selected'); });
            this.classList.add('selected');
            selectedIndex = parseInt(this.dataset.index);
            submitBtn.style.display = 'inline-flex';
        });
    });

    submitBtn.addEventListener('click', function() {
        if (selectedIndex === null) return;
        var correct = selectedIndex === q.correctAnswer;
        var feedback = document.getElementById('quiz-feedback');

        options.forEach(function(opt, idx) {
            if (idx === q.correctAnswer) opt.classList.add('correct');
            else if (idx === selectedIndex && !correct) opt.classList.add('incorrect');
        });

        submitBtn.style.display = 'none';

        if (correct) {
            quizState.score++;
            var correctMsg = '✓ Correct!';
            feedback.className = 'practice-feedback correct show';
            feedback.innerHTML = '<strong>' + correctMsg + '</strong><br>' + escapeHtml(q.explanation || '');
        } else {
            var incorrectMsg = '✗ Not quite. The correct answer was ' + letters[q.correctAnswer] + '.';
            feedback.className = 'practice-feedback incorrect show';
            feedback.innerHTML = '<strong>' + incorrectMsg + '</strong><br>' + escapeHtml(q.explanation || '');
        }

        quizState.answersGiven++;
        incrementQuizCounter();

        var nextBtn = document.getElementById('quiz-next');
        nextBtn.style.display = 'inline-flex';
        nextBtn.onclick = function() {
            quizState.currentQuestion++;
            showQuestion();
        };
    });
}

function finishQuiz() {
    var content = document.getElementById('quiz-content');
    content.style.display = 'none';

    var result = document.getElementById('quiz-result');
    result.style.display = 'block';

    var total = currentLesson.quiz.questions.length;
    var pct = Math.round(quizState.score / total * 100);

    // Update tutor memory with result
    updateTutorMemory(currentLesson.title + ' (' + currentLesson.subject + ')', pct);

    // Save attempt
    saveQuizAttempt(currentLesson.id, quizState.score, total);

    result.innerHTML = `
        <div style="text-align:center;padding:1.5rem;">
            <div style="font-size:3rem;font-weight:700;margin-bottom:0.5rem;${pct >= 60 ? 'color:#4ade80;' : 'color:#fbbf24;'}">${quizState.score}/${total}</div>
            <div style="font-size:14px;color:var(--fg-dim);margin-bottom:1.5rem;">${pct >= 80 ? 'Excellent work! 🌟' : pct >= 60 ? 'Good job! Keep practising.' : 'Keep at it — practice makes perfect.'}</div>
            <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="retryQuiz()">Retry Quiz</button>
                <a href="create-lesson.html" class="btn btn-outline">Create New Lesson</a>
                <a href="dashboard.html" class="btn btn-outline">Dashboard</a>
            </div>
        </div>
    `;

    quizState.finished = true;
}

function retryQuiz() {
    quizState = { currentQuestion: 0, score: 0, answersGiven: 0, finished: false };
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    showQuestion();
}

function showQuizError(msg) {
    var content = document.getElementById('quiz-content');
    content.innerHTML = '<div style="text-align:center;padding:1.5rem;color:#ff6b6b;">' + msg + '</div>';
}
