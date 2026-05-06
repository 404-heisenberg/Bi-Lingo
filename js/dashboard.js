// ========== Dashboard Page Logic ==========

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has completed onboarding
    const profile = getLearnerProfile();
    
    if (!profile || !profile.completed) {
        // Not onboarded, redirect to onboarding
        window.location.href = 'onboarding.html';
        return;
    }

    // Update welcome heading
    const heading = document.getElementById('welcome-heading');
    const contextInfo = document.getElementById('context-info');
    const welcomeTitle = document.getElementById('welcome-title');
    
    welcomeTitle.textContent = `Dashboard - Grade ${profile.grade}`;
    heading.textContent = `Welcome back, Learner!`;
    contextInfo.textContent = `Grade ${profile.grade} • ${getSubjectName(profile.subject)} • ${profile.languageName || profile.language}`;

    // Populate lesson cards
    populateLessons(profile);

    // Populate quick questions
    populateQuickQuestions();

    // Update stats
    updateStats(profile);
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
        const progress = lesson.progress || 0;
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
    const completed = lessons.filter(l => l.progress >= 100).length;
    const total = lessons.length;
    const avgProgress = total > 0 
        ? Math.round(lessons.reduce((sum, l) => sum + (l.progress || 0), 0) / total)
        : 0;

    document.getElementById('total-lessons').textContent = total;
    document.getElementById('completed-lessons').textContent = completed;
    document.getElementById('confidence-score').textContent = `${avgProgress}%`;
}
