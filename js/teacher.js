document.addEventListener('DOMContentLoaded', function () {
    const data = BiLingoData.teacher;
    if (!data) return;

    renderStats(data.stats);
    renderAlert(data.languageAlert);
    renderRoster(data.learners);
    renderSupportCards(data.supportCards);
});

function renderStats(stats) {
    const container = document.getElementById('teacher-stats');
    const items = [
        { value: stats.totalLearners, label: 'Total Learners' },
        { value: stats.needLanguageSupport, label: 'Need Language Support' },
        { value: stats.topicsNeedingAttention, label: 'Topics Needing Attention' },
        { value: stats.onTrack, label: 'On Track' }
    ];
    container.innerHTML = items.map(s => `
        <div class="stat-card">
            <div class="stat-value">${s.value}</div>
            <div class="stat-label">${s.label}</div>
        </div>
    `).join('');
}

function renderAlert(alert) {
    const container = document.getElementById('teacher-alert');
    container.innerHTML = `
        <div class="alert-card">
            <div>
                <strong>${alert.headline}</strong>
                <p style="margin: 0.5rem 0 0; font-size: 14px; color: var(--fg-dim);">${alert.message}</p>
            </div>
        </div>
    `;
}

function renderRoster(learners) {
    const container = document.getElementById('learner-roster');
    container.innerHTML = learners.map(l => `
        <div class="card learner-card">
            <div class="confidence-indicator">
                <span class="confidence-dot ${l.confidence}"></span>
            </div>
            <div class="learner-info">
                <div class="learner-name">${l.name}</div>
                <div class="learner-meta">Grade ${l.grade} · ${l.subject} · Active ${l.lastActive}</div>
                ${l.struggleTopic ? `<div class="learner-struggle">⚠ ${l.struggleTopic} — ${l.suggestion}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderSupportCards(cards) {
    const container = document.getElementById('support-grid');
    container.innerHTML = cards.map(c => `
        <div class="stat-card support-card">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${c.icon}</div>
            <strong style="font-size: 15px;">${c.title}</strong>
            <p style="font-size: 13px; color: var(--fg-dim); margin: 0.5rem 0 0;">${c.message}</p>
        </div>
    `).join('');
}
