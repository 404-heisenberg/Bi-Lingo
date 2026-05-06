// ========== Teacher Dashboard Logic ==========

document.addEventListener('DOMContentLoaded', function() {
    const teacherData = BiLingoData.teacherData;
    
    // Update class info
    document.getElementById('class-info').textContent = `${teacherData.className} • ${teacherData.totalLearners} learners`;
    
    // Update stats
    updateStats(teacherData);
    
    // Populate learners list
    populateLearners(teacherData.learners);
    
    // Show language barrier alert
    showLanguageAlert(teacherData.learners);
    
    // Populate interventions
    populateInterventions(teacherData.learners);
});

function updateStats(data) {
    document.getElementById('total-learners').textContent = data.totalLearners;
    document.getElementById('struggling-count').textContent = data.strugglingCount;
    document.getElementById('avg-confidence').textContent = `${data.avgConfidence}%`;
}

function populateLearners(learners) {
    const container = document.getElementById('learners-list');
    
    container.innerHTML = learners.map(learner => {
        const confidence = getConfidenceLevel(learner.confidence);
        
        return `
            <div class="learner-card">
                <div class="learner-header">
                    <div>
                        <div class="learner-name">${learner.name}</div>
                    </div>
                    <div class="confidence-indicator">
                        <div class="confidence-dot ${confidence.class}" 
                             style="background: ${confidence.color};"
                             title="${confidence.text} Confidence"></div>
                        <span style="font-size: 12px; color: var(--fg-mute); font-family: var(--f-mono);">
                            ${learner.confidence}%
                        </span>
                    </div>
                </div>
                
                <div class="learner-meta">
                    <div class="learner-meta-item">
                        <span>🎓</span>
                        <span>Grade ${learner.grade}</span>
                    </div>
                    <div class="learner-meta-item">
                        <span>🗣️</span>
                        <span>${learner.language}</span>
                    </div>
                    <div class="learner-meta-item">
                        <span>⏱</span>
                        <span>${learner.lastActive}</span>
                    </div>
                </div>
                
                <div class="learner-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${learner.progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${learner.progress}%; background: linear-gradient(90deg, ${learner.confidence >= 70 ? '#4ade80' : learner.confidence >= 50 ? '#fbbf24' : '#ff6b6b'}, ${learner.confidence >= 70 ? '#22c55e' : learner.confidence >= 50 ? '#eab308' : '#ef4444'});"></div>
                    </div>
                </div>
                
                ${learner.strugglingTopic !== 'None' ? `
                    <div class="learner-struggle">
                        <strong>⚠️ Struggling:</strong> ${learner.strugglingTopic}
                        ${learner.language !== 'English' ? `<div style="margin-top: 0.3rem; font-size: 12px; color: var(--fg-mute);">Potential language barrier — concept may need explanation in ${learner.language}</div>` : ''}
                    </div>
                ` : ''}
                
                <div class="learner-actions">
                    <button class="btn btn-secondary btn-sm" onclick="showLearnerDetail(${learner.id})">View Details</button>
                    <button class="btn btn-primary btn-sm" onclick="suggestSupport(${learner.id})">Suggest Support</button>
                </div>
            </div>
        `;
    }).join('');
}

function showLanguageAlert(learners) {
    const alertContainer = document.getElementById('language-alert');
    const nonEnglishLearners = learners.filter(l => l.language !== 'English' && l.language !== 'Afrikaans');
    const strugglingLangLearners = nonEnglishLearners.filter(l => l.confidence < 60);
    
    if (strugglingLangLearners.length > 0) {
        alertContainer.className = 'alert-bar danger';
        alertContainer.innerHTML = `
            <div class="alert-icon">⚠️</div>
            <div>
                <strong>Language Barrier Alert:</strong> ${strugglingLangLearners.length} learner(s) may be struggling due to language barriers. Consider providing additional support in their home language (${strugglingLangLearners.map(l => l.language).join(', ')}).
            </div>
        `;
    } else if (nonEnglishLearners.length > 0) {
        alertContainer.className = 'alert-bar warning';
        alertContainer.innerHTML = `
            <div class="alert-icon">💡</div>
            <div>
                <strong>Multilingual Classroom:</strong> ${nonEnglishLearners.length} learner(s) prefer non-English languages (${[...new Set(nonEnglishLearners.map(l => l.language))].join(', ')}). Bi-Lingo is helping bridge the language gap!
            </div>
        `;
    } else {
        alertContainer.style.display = 'none';
    }
}

function populateInterventions(learners) {
    const container = document.getElementById('interventions-list');
    const struggling = learners.filter(l => l.confidence < 60 || l.strugglingTopic !== 'None');
    
    if (struggling.length === 0) {
        container.innerHTML = '<div style="color: var(--fg-dim); font-size: 14px;">All learners are on track! 🎉</div>';
        return;
    }
    
    container.innerHTML = struggling.map(learner => {
        const priority = learner.confidence < 50 ? 'high' : 'medium';
        return `
            <div class="intervention-card">
                <div class="intervention-priority ${priority}">
                    ${priority === 'high' ? '🔴 High Priority' : '🟡 Medium Priority'}
                </div>
                <div class="intervention-learner">${learner.name} (Grade ${learner.grade})</div>
                <div class="intervention-action">
                    ${getInterventionText(learner)}
                </div>
            </div>
        `;
    }).join('');
}

function getInterventionText(learner) {
    if (learner.language !== 'English' && learner.confidence < 60) {
        return `🗣️ <strong>Language Support:</strong> Allow learner to use Bi-Lingo's ${learner.language} explanations for ${learner.strugglingTopic}. The language barrier may be impacting understanding.`;
    }
    
    if (learner.confidence < 50) {
        return `📚 <strong>Remedial Support:</strong> Schedule one-on-one session to review ${learner.strugglingTopic}. Consider breaking down concepts into smaller parts.`;
    }
    
    return `📖 <strong>Review:</strong> Provide additional practice materials for ${learner.strugglingTopic}. Learner may benefit from visual aids and examples.`;
}

function showLearnerDetail(id) {
    const learner = BiLingoData.teacherData.learners.find(l => l.id === id);
    if (!learner) return;
    
    alert(`Learner Details: ${learner.name}\n\nGrade: ${learner.grade}\nLanguage: ${learner.language}\nConfidence: ${learner.confidence}%\nProgress: ${learner.progress}%\nStruggling Topic: ${learner.strugglingTopic}\nLast Active: ${learner.lastActive}`);
}

function suggestSupport(id) {
    const learner = BiLingoData.teacherData.learners.find(l => l.id === id);
    if (!learner) return;
    
    const intervention = getInterventionText(learner);
    alert(`Suggested Support for ${learner.name}:\n\n${intervention.replace(/<[^>]*>/g, '')}`);
}
