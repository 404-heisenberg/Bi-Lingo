// ========== Dashboard Page Logic ==========

document.addEventListener('DOMContentLoaded', function() {
    const profile = getLearnerProfile();

    if (!profile || !profile.completed) {
        window.location.href = 'onboarding.html';
        return;
    }

    updateStudyStreak();

    const heading = document.getElementById('welcome-heading');
    const contextInfo = document.getElementById('context-info');
    const welcomeTitle = document.getElementById('welcome-title');
    const learnerName = profile.firstName ? profile.firstName : 'Learner';

    welcomeTitle.textContent = `Dashboard - Grade ${profile.grade}`;
    heading.textContent = `Welcome back, ${learnerName}!`;
    contextInfo.textContent = `Grade ${profile.grade} • ${profile.languageName || profile.language}`;

    populateBuiltInLessons();
    populateQuizzes();
    updateStats();
});

function populateBuiltInLessons() {
    const lessonGrid = document.getElementById('lesson-grid');
    const lessons = [
        {
            id: 'idioms',
            title: 'Understanding Idioms',
            topic: 'English Language',
            difficulty: 'Medium',
            duration: '14 min',
            progress: 60,
            status: 'In progress',
            snippet: 'Last time you explored why idioms cannot be translated word-for-word.'
        },
        {
            id: 'math-foundations',
            title: 'Math Foundations',
            topic: 'High-Level Concepts',
            difficulty: 'Medium',
            duration: '12 min',
            progress: 0,
            status: 'New',
            snippet: 'Start with core ideas like probability and Pythagorean theorem.'
        }
    ];

    lessonGrid.innerHTML = lessons.map(function(lesson) {
        const buttonLabel = lesson.progress > 0 ? 'Continue Lesson' : 'Start Lesson';
        return `
            <div class="card lesson-card">
                <div class="lesson-header">
                    <div>
                        <div class="lesson-title">${lesson.title}</div>
                        <div class="lesson-topic">${lesson.topic}</div>
                    </div>
                    <span class="badge ${getDifficultyBadge(lesson.difficulty)}">${lesson.difficulty}</span>
                </div>
                <div class="lesson-meta">
                    <div class="lesson-meta-item">
                        <span>⏱</span>
                        <span>${lesson.duration}</span>
                    </div>
                    <div class="lesson-meta-item">
                        <span>📌</span>
                        <span>${lesson.status}</span>
                    </div>
                </div>
                <p style="color: var(--fg-dim); font-size: 13px; margin: 0 0 1rem;">${lesson.snippet}</p>
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${lesson.progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${lesson.progress}%;"></div>
                    </div>
                </div>
                <div class="card-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <a href="lesson.html?id=${lesson.id}" class="btn btn-primary btn-sm">${buttonLabel}</a>
                    <a href="tutor.html?lessonId=${lesson.id}" class="btn btn-outline">Ask Tutor</a>
                </div>
            </div>
        `;
    }).join('');
}

function populateQuizzes() {
    var quizzes = getSavedQuizzes();
    var grid = document.getElementById('quiz-grid');
    var empty = document.getElementById('quiz-empty');

    if (!quizzes || quizzes.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';

    grid.innerHTML = quizzes.map(function(quiz) {
        var score = getQuizScore(quiz.id);
        var statusHtml = score !== null
            ? '<span class="badge badge-success" style="display:inline-flex;">Score: ' + score.pct + '%</span>'
            : '<span class="badge badge-info" style="display:inline-flex;">Ready</span>';
        var dateStr = new Date(quiz.createdAt).toLocaleDateString();

        return `
            <div class="card lesson-card">
                <div class="lesson-header">
                    <div>
                        <div class="lesson-title">${escapeHtml(quiz.topic)}</div>
                        <div class="lesson-topic">${quiz.questions.length} questions · ${dateStr}</div>
                    </div>
                    ${statusHtml}
                </div>
                <p style="color: var(--fg-dim); font-size: 13px; margin: 1rem 0;">Generated from your tutor session</p>
                <div class="card-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <a href="tutor.html?quizId=${quiz.id}" class="btn btn-primary btn-sm">${score !== null ? 'Retake Quiz' : 'Take Quiz'}</a>
                    <button onclick="deleteQuizConfirm('${quiz.id}')" class="btn btn-ghost btn-sm" style="color:var(--fg-mute);">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteQuizConfirm(quizId) {
    if (!confirm('Delete this quiz?')) return;
    deleteQuiz(quizId);
    populateQuizzes();
    updateStats();
}

function getDifficultyBadge(difficulty) {
    switch ((difficulty || '').toLowerCase()) {
        case 'easy': return 'badge-success';
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-danger';
        default: return 'badge-info';
    }
}

function updateStats() {
    var quizzes = getSavedQuizzes();
    var quizData = getQuizData();
    var totalQuizzes = quizzes.length;
    var quizzesTaken = quizData.attempts ? quizData.attempts.length : 0;
    var dailyCount = getDailyQuizCount();
    var streak = getStudyStreak();

    document.getElementById('total-lessons').textContent = totalQuizzes;
    document.getElementById('completed-lessons').textContent = quizzesTaken;
    document.getElementById('daily-count').textContent = dailyCount + '/10';
    document.getElementById('streak-count').textContent = streak + '🔥';
}
