// ========== Dashboard Page Logic ==========

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has completed onboarding
    const profile = getLearnerProfile();
    
    if (!profile || !profile.completed) {
        // Not onboarded, redirect to onboarding
        window.location.href = 'onboarding.html';
        return;
    }

    // Update study streak
    updateStudyStreak();

    // Update welcome heading
    const heading = document.getElementById('welcome-heading');
    const contextInfo = document.getElementById('context-info');
    const welcomeTitle = document.getElementById('welcome-title');
    
    welcomeTitle.textContent = `Dashboard - Grade ${profile.grade}`;
    heading.textContent = `Welcome back, Learner!`;
    contextInfo.textContent = `Grade ${profile.grade} • ${getSubjectName(profile.subject)} • ${profile.languageName || profile.language}`;

    // Populate recommended lesson
    populateRecommendedLesson(profile);

    // Populate lesson cards
    populateLessons(profile);

    // Populate quick questions
    populateQuickQuestions();

    // Update stats
    updateStats(profile);

    // Set up search and filter
    setupSearchAndFilter();
});

function getSubjectName(subjectCode) {
    const subject = BiLingoData.subjects.find(s => s.code === subjectCode);
    return subject ? subject.name : subjectCode;
}

function populateLessons(profile) {
    const lessonGrid = document.getElementById('lesson-grid');
    const lessons = BiLingoData.lessons[profile.subject] || BiLingoData.lessons['science'];

    if (lessons.length === 0) {
        lessonGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <p>No lessons available for this subject yet.</p>
            </div>
        `;
        return;
    }

    lessonGrid.innerHTML = lessons.map(lesson => {
        const progress = getLessonProgress(lesson.id);
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
                        <span>📖</span>
                        <span>${lesson.concepts.length} concepts</span>
                    </div>
                </div>
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="lesson.html?id=${lesson.id}" class="btn btn-secondary btn-sm">View Lesson</a>
                    <a href="tutor.html?question=${lesson.id}" class="btn btn-primary btn-sm">Ask Tutor</a>
                </div>
            </div>
        `;
    }).join('');
}

function getDifficultyBadge(difficulty) {
    switch(difficulty.toLowerCase()) {
        case 'easy': return 'badge-success';
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-danger';
        default: return 'badge-info';
    }
}

function populateQuickQuestions() {
    const quickQuestions = document.getElementById('quick-questions');
    const questions = BiLingoData.quickQuestions;

    quickQuestions.innerHTML = questions.map(q => `
        <a href="tutor.html?question=${q.id}" class="quick-question-btn">
            ${q.text}
        </a>
    `).join('');
}

function updateStats(profile) {
    const lessons = BiLingoData.lessons[profile.subject] || BiLingoData.lessons['science'];
    const total = lessons.length;
    
    // Calculate real progress from profile
    let totalProgress = 0;
    let completed = 0;
    lessons.forEach(lesson => {
        const progress = getLessonProgress(lesson.id);
        totalProgress += progress;
        if (progress >= 100) completed++;
    });
    
    const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;
    const streak = getStudyStreak();

    document.getElementById('total-lessons').textContent = total;
    document.getElementById('completed-lessons').textContent = completed;
    document.getElementById('confidence-score').textContent = `${avgProgress}%`;
    document.getElementById('streak-count').textContent = `${streak}🔥`;
}

function populateRecommendedLesson(profile) {
    const recommended = getRecommendedLesson(profile.subject);
    const container = document.getElementById('recommended-lesson');
    
    if (!recommended) {
        container.innerHTML = '<p style="color: var(--fg-dim);">No lessons available.</p>';
        return;
    }
    
    const progress = getLessonProgress(recommended.id);
    
    container.innerHTML = `
        <div class="card lesson-card" style="border-color: var(--accent);">
            <div class="lesson-header">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">⭐</span>
                        <div class="lesson-title">${recommended.title}</div>
                    </div>
                    <div class="lesson-topic">${recommended.topic}</div>
                </div>
                <span class="badge ${getDifficultyBadge(recommended.difficulty)}">${recommended.difficulty}</span>
            </div>
            <div class="lesson-meta">
                <div class="lesson-meta-item">
                    <span>⏱</span>
                    <span>${recommended.duration}</span>
                </div>
                <div class="lesson-meta-item">
                    <span>📖</span>
                    <span>${recommended.concepts.length} concepts</span>
                </div>
            </div>
            <div class="progress-section">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${progress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
            </div>
            <div class="card-actions">
                <a href="lesson.html?id=${recommended.id}" class="btn btn-primary" style="flex: 1; justify-content: center;">
                    ${progress > 0 ? 'Continue Lesson →' : 'Start Lesson →'}
                </a>
            </div>
        </div>
    `;
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('lesson-search');
    const difficultyFilter = document.getElementById('difficulty-filter');
    
    searchInput.addEventListener('input', filterLessons);
    difficultyFilter.addEventListener('change', filterLessons);
}

function filterLessons() {
    const profile = getLearnerProfile();
    if (!profile) return;
    
    const searchTerm = document.getElementById('lesson-search').value.toLowerCase();
    const difficultyValue = document.getElementById('difficulty-filter').value;
    
    const lessons = BiLingoData.lessons[profile.subject] || BiLingoData.lessons['science'];
    const lessonGrid = document.getElementById('lesson-grid');
    
    const filtered = lessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm) ||
                            lesson.topic.toLowerCase().includes(searchTerm) ||
                            lesson.concepts.some(c => c.toLowerCase().includes(searchTerm));
        
        const matchesDifficulty = !difficultyValue || lesson.difficulty === difficultyValue;
        
        return matchesSearch && matchesDifficulty;
    });
    
    if (filtered.length === 0) {
        lessonGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🔍</div>
                <p>No lessons found. Try a different search or filter.</p>
            </div>
        `;
        return;
    }
    
    lessonGrid.innerHTML = filtered.map(lesson => {
        const progress = getLessonProgress(lesson.id);
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
                        <span>📖</span>
                        <span>${lesson.concepts.length} concepts</span>
                    </div>
                </div>
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="lesson.html?id=${lesson.id}" class="btn btn-secondary btn-sm">View Lesson</a>
                    <a href="tutor.html?question=${lesson.id}" class="btn btn-primary btn-sm">Ask Tutor</a>
                </div>
            </div>
        `;
    }).join('');
}
