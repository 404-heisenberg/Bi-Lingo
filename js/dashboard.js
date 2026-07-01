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

    populateLessons();
    updateStats();
});

function populateLessons() {
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

    lessonGrid.innerHTML = lessons.map(lesson => {
        const buttonLabel = lesson.progress > 0 ? 'Continue Lesson →' : 'Start Lesson →';
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
                    <a href="tutor.html?lessonId=${lesson.id}" class="btn btn-outline">Ask Tutor →</a>
                </div>
            </div>
        `;
    }).join('');
}

function getDifficultyBadge(difficulty) {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'badge-success';
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-danger';
        default: return 'badge-info';
    }
}
function updateStats() {
    const total = 2;
    const completed = 0;
    const avgProgress = 30;
    const streak = getStudyStreak();

    document.getElementById('total-lessons').textContent = total;
    document.getElementById('completed-lessons').textContent = completed;
    document.getElementById('confidence-score').textContent = `${avgProgress}%`;
    document.getElementById('streak-count').textContent = `${streak}🔥`;
}
