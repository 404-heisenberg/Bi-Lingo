// ========== Onboarding Page Logic ==========

document.addEventListener('DOMContentLoaded', function() {
    // Check if user already has a profile
    const existingProfile = getLearnerProfile();
    if (existingProfile && existingProfile.completed) {
        // Already onboarded, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }

    // Populate language grid
    const languageGrid = document.getElementById('language-grid');
    BiLingoData.languages.forEach(lang => {
        const option = document.createElement('div');
        option.className = 'language-option';
        option.dataset.code = lang.code;
        option.innerHTML = `
            <div class="lang-name">${lang.name}</div>
            <div class="lang-native">${lang.native}</div>
        `;
        option.addEventListener('click', () => selectLanguage(lang.code, option));
        languageGrid.appendChild(option);
    });

    // Subject selection
    const subjectOptions = document.querySelectorAll('.subject-option');
    const subjectInput = document.getElementById('subject-input');
    
    subjectOptions.forEach(option => {
        option.addEventListener('click', () => {
            subjectOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            subjectInput.value = option.dataset.subject;
        });
    });

    // Pre-fill if returning user
    if (existingProfile) {
        if (existingProfile.grade) {
            document.getElementById('grade-select').value = existingProfile.grade;
        }
        if (existingProfile.subject) {
            const subjectOption = document.querySelector(`[data-subject="${existingProfile.subject}"]`);
            if (subjectOption) {
                subjectOption.classList.add('selected');
                subjectInput.value = existingProfile.subject;
            }
        }
        if (existingProfile.language) {
            const langOption = document.querySelector(`[data-code="${existingProfile.language}"]`);
            if (langOption) {
                langOption.classList.add('selected');
                document.getElementById('language-input').value = existingProfile.language;
            }
        }
        if (existingProfile.goal) {
            document.getElementById('goal-input').value = existingProfile.goal;
        }
    }

    // Form submission
    const form = document.getElementById('onboarding-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const grade = document.getElementById('grade-select').value;
        const subject = subjectInput.value;
        const language = document.getElementById('language-input').value;
        const goal = document.getElementById('goal-input').value;

        // Validate
        if (!grade) {
            shakeElement(document.getElementById('grade-select'));
            return;
        }
        if (!subject) {
            shakeElement(document.querySelector('.subject-option'));
            return;
        }
        if (!language) {
            shakeElement(document.querySelector('.language-option'));
            return;
        }

        // Save profile
        const profile = {
            grade: grade,
            subject: subject,
            language: language,
            languageName: BiLingoData.languages.find(l => l.code === language)?.name || language,
            goal: goal,
            completed: true,
            progress: 0
        };

        saveLearnerProfile(profile);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });
});

function selectLanguage(code, element) {
    // Remove selection from all
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked
    element.classList.add('selected');
    document.getElementById('language-input').value = code;
}

function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // Trigger reflow
    el.style.animation = 'shake 0.4s';
    setTimeout(() => {
        el.style.animation = '';
    }, 400);
}
