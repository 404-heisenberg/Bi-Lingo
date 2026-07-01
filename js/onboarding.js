// ========== Onboarding Page Logic ==========

document.addEventListener('DOMContentLoaded', function() {
    var existingProfile = getLearnerProfile();
    if (existingProfile && existingProfile.completed) {
        window.location.href = 'dashboard.html';
        return;
    }

    var gradeSelect = document.getElementById('grade-select');
    var subjectGrid = document.getElementById('subject-grid');
    var subjectInput = document.getElementById('subject-input');
    var subjectMeta = document.getElementById('subject-meta');
    var subjectNote = document.getElementById('subject-note');
    var subjectRule = document.getElementById('subject-rule');
    var languageSection = document.getElementById('language-section');

    var firstNameInput = document.getElementById('first-name');
    var lastNameInput = document.getElementById('last-name');

    // Populate language grid (demo: only isiZulu and Sesotho)
    var languageGrid = document.getElementById('language-grid');
    var demoLanguages = BiLingoData.languages.filter(function(l) {
        return l.code === 'zu' || l.code === 'st';
    });
    demoLanguages.forEach(function(lang) {
        var option = document.createElement('div');
        option.className = 'language-option';
        option.dataset.code = lang.code;
        option.innerHTML = '<div class="lang-name">' + lang.name + '</div><div class="lang-native">' + lang.native + '</div>';
        option.addEventListener('click', function() {
            selectLanguage(lang.code, option);
        });
        languageGrid.appendChild(option);
    });

    // Show language section and render subjects when grade is selected
    gradeSelect.addEventListener('change', function() {
        var val = this.value;
        if (val) {
            languageSection.style.display = 'block';
        } else {
            languageSection.style.display = 'none';
        }
        renderSubjectOptions(val);
    });

    if (gradeSelect.value) {
        languageSection.style.display = 'block';
        renderSubjectOptions(gradeSelect.value);
    }

    // Form submission
    var form = document.getElementById('onboarding-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var firstName = firstNameInput.value.trim();
        var lastName = lastNameInput.value.trim();
        var grade = gradeSelect.value;
        var gradeNum = parseInt(grade, 10);
        var isFET = gradeNum >= 10;
        var subjects = getSelectedSubjects();
        var language = document.getElementById('language-input').value;

        if (!firstName || !lastName) {
            shakeElement(firstNameInput);
            shakeElement(lastNameInput);
            return;
        }
        if (!grade) {
            shakeElement(gradeSelect);
            return;
        }
        if (!validateSubjects(gradeNum, subjects)) {
            shakeElement(subjectGrid);
            return;
        }
        if (!language) {
            var langGrid = document.getElementById('language-grid');
            if (langGrid) shakeElement(langGrid);
            return;
        }

        if (!isFET) {
            subjects = BiLingoData.fixedSubjects.map(function(s) { return s.code; });
        }

        var profileData = {
            firstName: firstName,
            lastName: lastName,
            grade: grade,
            subjects: subjects,
            subject: !isFET ? 'science' : subjects[0],
            language: language,
            languageName: (BiLingoData.languages.find(function(l) { return l.code === language; }) || {}).name || language,
            completed: true,
            progress: 0
        };

        saveLearnerProfile(profileData);
        window.location.href = 'dashboard.html';
    });
});

function renderSubjectOptions(gradeValue) {
    var subjectGrid = document.getElementById('subject-grid');
    var subjectInput = document.getElementById('subject-input');
    var subjectMeta = document.getElementById('subject-meta');
    var subjectNote = document.getElementById('subject-note');
    var subjectRule = document.getElementById('subject-rule');

    subjectGrid.innerHTML = '';
    subjectInput.value = '';
    subjectNote.style.display = 'none';
    subjectRule.style.display = 'none';

    if (!gradeValue) {
        subjectMeta.textContent = 'Choose your grade to see your CAPS subjects.';
        return;
    }

    var gradeNum = parseInt(gradeValue, 10);

    if (gradeNum < 10) {
        subjectMeta.textContent = 'These are your CAPS subjects for Grades 1–9.';
        BiLingoData.fixedSubjects.forEach(function(subject) {
            var card = createSubjectCard(subject, false);
            card.classList.add('disabled');
            subjectGrid.appendChild(card);
        });
        subjectInput.value = 'science';
        return;
    }

    subjectMeta.textContent = 'Choose exactly 3 subjects for your FET demo profile. 0/4 selected.';
    subjectNote.textContent = 'Demo mode: elective list shortened for clarity. Full app supports all CAPS subjects.';
    subjectNote.style.display = 'block';
    subjectRule.style.display = 'block';

    BiLingoData.fetElectivesDemo.forEach(function(subject) {
        var card = createSubjectCard(subject, true);
        subjectGrid.appendChild(card);
    });
}

function createSubjectCard(subject, isSelectable) {
    var card = document.createElement('div');
    card.className = 'card subject-option';
    card.dataset.subject = subject.code;
    if (subject.group) {
        card.dataset.group = subject.group;
    }
    card.innerHTML = '<div class="card-header"><span style="font-size: 2rem;">' + subject.icon + '</span></div><div class="card-title">' + subject.name + '</div>';

    if (isSelectable) {
        card.addEventListener('click', function() {
            toggleSubjectSelection(card);
        });
    }

    return card;
}

function toggleSubjectSelection(card) {
    if (card.classList.contains('disabled')) return;

    var selected = document.querySelectorAll('.subject-option.selected');
    var group = card.dataset.group;

    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        updateSubjectInput();
        return;
    }

    if (group) {
        selected.forEach(function(el) {
            if (el.dataset.group === group) {
                el.classList.remove('selected');
            }
        });
    }

    if (selected.length >= 4) return;

    card.classList.add('selected');
    updateSubjectInput();
}

function updateSubjectInput() {
    var selected = getSelectedSubjects();
    document.getElementById('subject-input').value = selected.join(',');
    updateSelectionMeta();
}

function updateSelectionMeta() {
    var subjectMeta = document.getElementById('subject-meta');
    var gradeValue = document.getElementById('grade-select').value;
    if (!gradeValue || parseInt(gradeValue, 10) < 10) return;
    var electiveCount = getElectiveCount();
    subjectMeta.textContent = 'Choose exactly 3 subjects for your FET demo profile. ' + electiveCount + '/3 electives selected.';
}

function getElectiveCount() {
    var els = document.querySelectorAll('.subject-option.selected');
    var count = 0;
    for (var i = 0; i < els.length; i++) {
        if (els[i].dataset.group !== 'math-choice') {
            count++;
        }
    }
    return count;
}

function hasMathChoiceSelected() {
    var els = document.querySelectorAll('.subject-option.selected');
    for (var i = 0; i < els.length; i++) {
        if (els[i].dataset.group === 'math-choice') {
            return true;
        }
    }
    return false;
}

function getSelectedSubjects() {
    var els = document.querySelectorAll('.subject-option.selected');
    var result = [];
    for (var i = 0; i < els.length; i++) {
        result.push(els[i].dataset.subject);
    }
    return result;
}

function selectSubjects(subjectCodes) {
    document.querySelectorAll('.subject-option').forEach(function(card) {
        if (subjectCodes.indexOf(card.dataset.subject) !== -1) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    updateSubjectInput();
}

function validateSubjects(gradeNum, subjects) {
    if (!gradeNum) return false;
    if (gradeNum < 10) return true;

    if (!subjects || subjects.length < 3) return false;
    var electiveCount = getElectiveCount();
    if (electiveCount !== 3) return false;
    return hasMathChoiceSelected();
}

function selectLanguage(code, element) {
    document.querySelectorAll('.language-option').forEach(function(opt) {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    document.getElementById('language-input').value = code;
}

function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s';
    setTimeout(function() { el.style.animation = ''; }, 400);
}
