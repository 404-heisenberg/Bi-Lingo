// ========== Tutor Page Logic ==========

const TUTOR_PERSONALITIES = {
    english: {
        name: 'Bi-Lingo Tutor',
        avatar: 'B',
        avatarClass: 'avatar-english',
        nameClass: 'name-english',
        desc: 'Clear, encouraging explanations in any language',
        metaLabel: 'TUTOR'
    },
    isizulu: {
        name: 'Mrs. Ndlovu',
        avatar: 'N',
        avatarClass: 'avatar-isizulu',
        nameClass: 'name-isizulu',
        desc: 'Warm kitchen-table tutor · Speaks isiZulu naturally',
        metaLabel: 'Mrs. Ndlovu'
    },
    sesotho: {
        name: 'Auntie Mpho',
        avatar: 'M',
        avatarClass: 'avatar-sesotho',
        nameClass: 'name-sesotho',
        desc: 'Encouraging real-life tutor · Speaks Sesotho naturally',
        metaLabel: 'Auntie Mpho'
    }
};

let currentLanguage = 'english';
let currentQuestionId = null;
let currentLessonId = null;
let currentMathQuestionId = null;
let clickedMathQuestionIds = new Set();
let lastCustomResponse = null;
let chatHistory = [];

function getPersonality(lang) {
    return TUTOR_PERSONALITIES[lang] || TUTOR_PERSONALITIES.english;
}

function updateProfileBar(lang) {
    const p = getPersonality(lang);
    const avatar = document.getElementById('tutor-avatar');
    const name = document.getElementById('tutor-name');
    const desc = document.getElementById('tutor-desc');
    if (avatar) {
        avatar.textContent = p.avatar;
        avatar.className = 'tutor-profile-avatar ' + p.avatarClass;
    }
    if (name) {
        name.textContent = p.name;
        name.className = 'tutor-profile-name ' + p.nameClass;
    }
    if (desc) {
        desc.textContent = p.desc;
    }
}

function getTutorMemory() {
    try {
        const raw = localStorage.getItem('biLingoTutorMemory');
        return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
}

function getTutorWelcomeMessage(lang) {
    const memory = getTutorMemory();
    const p = getPersonality(lang);
    if (!memory || (!memory.weakTopics || memory.weakTopics.length === 0)) {
        return '👋 ' + (lang === 'english'
            ? 'Ask your own question and begin your learning journey!'
            : lang === 'isizulu'
            ? 'Buza umbuzo wakho futhi uqale uhambo lwakho lokufunda!'
            : 'Botsa potso ea hau ebe u qala leeto la hao la ho ithuta!');
    }
    const topics = memory.weakTopics.slice(0, 2).join(' and ');
    if (lang === 'english') {
        return `👋 Welcome back! I see you've been working on ${topics}. Let's tackle them together — ask me anything.`;
    } else if (lang === 'isizulu') {
        return `👋 Sawubona! Ngiyabona ukuthi ubesebenza ku-${topics}. Ake sibhekane nazo ndawonye — buza noma yini.`;
    } else {
        return `👋 Dumela! Ke bona hore o ntse o sebetsa ho ${topics}. Ha re kopane le tsona hammoho — botsa eng kapa eng.`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has completed onboarding
    const profile = getLearnerProfile();
    if (!profile || !profile.completed) {
        window.location.href = 'onboarding.html';
        return;
    }

    // Update language badge
    const languageBadge = document.getElementById('language-badge');
    if (languageBadge && profile.languageName) {
        languageBadge.textContent = profile.languageName;
    }

    // Show initial profile (English)
    updateProfileBar('english');

    // Check for question or lesson parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('question');
    const lessonId = urlParams.get('lessonId');
    const quizId = urlParams.get('quizId');

    if (quizId) {
        // Load saved quiz — hide everything except quiz
        var savedQuiz = getQuizById(quizId);
        if (savedQuiz) {
            document.getElementById('tutor-profile-bar').style.display = 'none';
            document.getElementById('language-tabs').style.display = 'none';
            document.getElementById('chat-container').style.display = 'none';
            document.getElementById('quiz-gen-toggle').style.display = 'none';
            var signupEl = document.querySelector('.tutor-bottom-section .signup');
            if (signupEl) signupEl.style.display = 'none';
            // Hide quiz generation UI — only show the quiz itself
            var section = document.getElementById('quiz-gen-section');
            var qHeader = section.querySelector('.quiz-gen-header');
            var qInputRow = section.querySelector('.quiz-gen-input-row');
            var qStatus = document.getElementById('quiz-gen-status');
            var qContext = document.getElementById('quiz-gen-context');
            if (qHeader) qHeader.style.display = 'none';
            if (qInputRow) qInputRow.style.display = 'none';
            if (qStatus) qStatus.style.display = 'none';
            if (qContext) qContext.style.display = 'none';
            document.querySelector('.page-title').textContent = 'Quiz: ' + savedQuiz.topic;
            var resultEl = document.getElementById('quiz-gen-result');
            section.style.display = 'block';
            displayGeneratedQuiz(savedQuiz.topic, savedQuiz.questions, resultEl, true, savedQuiz.id);
        }
    } else if (lessonId) {
        currentLessonId = lessonId;
        renderLessonTutor(lessonId);
        updateTutorPageTitle(lessonId);
    } else {
        // Show welcome message only (no demo questions)
        showWelcomeMessage();
    }

    // Set up language tabs
    setupLanguageTabs();

    // If question ID provided, load that question
    if (questionId && BiLingoData.tutorQA[questionId]) {
        askQuestion(questionId, false);
    } else if (!lessonId) {
        // Show welcome message
        showWelcomeMessage();
    }

    // Set up custom question input
    const customInput = document.getElementById('custom-question');
    const askBtn = document.getElementById('ask-btn');

    if (lessonId) {
        // Demo page — redirect custom questions to the live tutor
        askBtn.addEventListener('click', function() {
            var text = customInput.value.trim();
            if (!text) return;
            addMessage('user', text, 'YOU');
            var p = getPersonality('english');
            var time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            var msgDiv = document.createElement('div');
            msgDiv.className = 'message tutor';
            msgDiv.innerHTML = `
                <div class="message-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-deep))">${p.avatar}</div>
                <div>
                    <div class="message-bubble" style="border:1px dashed var(--accent);">
                        <div style="margin-bottom:0.4rem;"><span style="font-family:var(--f-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);padding:0.15rem 0.45rem;border:1px solid var(--accent);border-radius:999px;">Demo</span></div>
                        <div style="font-size:14px;line-height:1.5;">
                            That's a good question — this is a demo. <a href="tutor.html" style="color:var(--accent);font-weight:600;">Start your own lesson</a> where I can answer it for you.
                        </div>
                    </div>
                    <div class="message-meta">${p.metaLabel} · ${time}</div>
                </div>
            `;
            document.getElementById('chat-container').appendChild(msgDiv);
            scrollToBottom();
            customInput.value = '';
        });
        customInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') askBtn.click();
        });
    } else {
        askBtn.addEventListener('click', function() {
            const question = customInput.value.trim();
            if (question) {
                askCustomQuestion(question);
                customInput.value = '';
            }
        });

        customInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const question = customInput.value.trim();
                if (question) {
                    askCustomQuestion(question);
                    customInput.value = '';
                }
            }
        });
    }

    // Quiz Generation Toggle
    const quizGenBtn = document.getElementById('quiz-gen-btn');
    const quizGenSection = document.getElementById('quiz-gen-section');
    const quizGenSubmit = document.getElementById('quiz-gen-submit');
    const quizTopicInput = document.getElementById('quiz-topic-input');

    quizGenBtn.addEventListener('click', function() {
        var isOpen = quizGenSection.style.display !== 'none';
        quizGenSection.style.display = isOpen ? 'none' : 'block';
        this.classList.toggle('active', !isOpen);
        if (!isOpen) {
            var conv = getTutorConversation();
            var profile = getLearnerProfile();
            var contextEl = document.getElementById('quiz-gen-context');

            var dailyCount = getDailyQuizCount();
            contextEl.innerHTML = 'Today: <strong>' + dailyCount + '/10</strong> questions used';
            if (profile && profile.languageName) {
                contextEl.innerHTML += ' · Home language: <strong>' + profile.languageName + '</strong>';
            }

            if (conv.length > 0) {
                var firstQ = conv[0].question;
                if (firstQ && firstQ.length < 80) {
                    quizTopicInput.placeholder = 'e.g. ' + firstQ;
                }
                var recentQuestions = conv.slice(-3).map(function(c) { return '"' + c.question + '"'; }).join(', ');
                contextEl.innerHTML += (contextEl.innerHTML ? ' · ' : '') + 'Recent questions: ' + recentQuestions;
                contextEl.style.display = 'block';
            } else {
                contextEl.style.display = 'block';
            }

            setTimeout(function() { quizTopicInput.focus(); }, 300);
        }
    });

    quizGenSubmit.addEventListener('click', generateQuiz);
    quizTopicInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateQuiz();
    });
});

function setupLanguageTabs() {
    const tabs = document.querySelectorAll('#language-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            // Update current language
            currentLanguage = this.dataset.lang;
            // Update profile bar with new personality
            updateProfileBar(currentLanguage);
            // Re-render current question in new language
            if (currentQuestionId || lastCustomResponse) {
                rerenderCurrentQuestion();
            }
            if (currentLessonId) {
                if (currentLessonId === 'math-foundations') {
                    updateMathTutorResponseLanguage();
                } else {
                    renderLessonTutor(currentLessonId);
                }
            }
            // Update welcome message if chat is empty
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer && chatContainer.children.length === 0) {
                showWelcomeMessage();
            }
        });
    });
}

function updateTutorPageTitle(lessonId) {
    const titleEl = document.querySelector('.page-title');
    const lesson = BiLingoData.lessonDetails && BiLingoData.lessonDetails[lessonId];
    if (titleEl && lesson) {
        titleEl.textContent = `Tutor - ${lesson.title}`;
    }
}

function renderLessonTutor(lessonId) {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;
    chatContainer.innerHTML = '';

    removeLessonQuickQuestions();
    currentMathQuestionId = null;
    clickedMathQuestionIds = new Set();

    // Demo notice
    const p = getPersonality(currentLanguage);
    const demoMsg = document.createElement('div');
    demoMsg.className = 'message tutor';
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    demoMsg.innerHTML = `
        <div class="message-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-deep))">${p.avatar}</div>
        <div>
            <div class="message-bubble" style="border:1px dashed var(--accent);">
                <div style="margin-bottom:0.4rem;"><span style="font-family:var(--f-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);padding:0.15rem 0.45rem;border:1px solid var(--accent);border-radius:999px;">Demo</span></div>
                <div style="font-size:14px;line-height:1.5;">
                    Pick one of the questions below to see how Bi-Lingo explains concepts bilingually — in English, isiZulu, and Sesotho. Switch between the language tabs above to compare.
                </div>
            </div>
            <div class="message-meta">${p.metaLabel} · ${time}</div>
        </div>
    `;
    chatContainer.appendChild(demoMsg);

    if (lessonId === 'idioms') {
        renderIdiomTutorNotes(chatContainer);
        return;
    }

    if (lessonId === 'math-foundations') {
        renderMathTutorQuickQuestions(chatContainer);
    }
}

function renderIdiomTutorNotes(chatContainer) {
    const notes = (BiLingoData.lessonDetails && BiLingoData.lessonDetails.idioms && BiLingoData.lessonDetails.idioms.tutorNotes && BiLingoData.lessonDetails.idioms.tutorNotes[currentLanguage]) || [];

    if (notes.length === 0) {
        showWelcomeMessage();
        return;
    }

    notes.forEach(note => {
        addMessage('user', note.question, 'YOU');
        addTutorMessage(note.answer);
    });
}

function renderMathTutorQuickQuestions(chatContainer) {
    const parent = chatContainer.parentElement;
    if (!parent) return;

    const section = document.createElement('div');
    section.className = 'lesson-quick-section';
    section.innerHTML = `
        <p style="font-size: 12px; color: var(--fg-mute); margin-bottom: 0.75rem; font-family: var(--f-mono); letter-spacing: 0.05em; text-transform: uppercase;">Quick Questions:</p>
        <div class="quick-questions lesson-quick-questions"></div>
    `;

    const quickWrap = section.querySelector('.lesson-quick-questions');
    quickWrap.innerHTML = BiLingoData.mathTutorQuickQuestions.map(q => `
        <button class="quick-question-btn" data-id="${q.id}"${clickedMathQuestionIds.has(q.id) ? ' disabled' : ''}>
            ${q.text}
        </button>
    `).join('');

    const bottomSection = parent.querySelector('.tutor-bottom-section');
    if (bottomSection) {
        bottomSection.insertBefore(section, bottomSection.firstChild);
    } else {
        parent.appendChild(section);
    }

    quickWrap.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const match = BiLingoData.mathTutorQuickQuestions.find(q => q.id === id);
            if (!match) return;
            clickedMathQuestionIds.add(id);
            btn.disabled = true;
            currentMathQuestionId = id;
            addMessage('user', match.text, 'YOU');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addTutorMessage(match.responses[currentLanguage]);
            }, 1500);
        });
    });
}

function removeLessonQuickQuestions() {
    document.querySelectorAll('.lesson-quick-section').forEach(section => section.remove());
}

function updateMathTutorResponseLanguage() {
    if (!currentMathQuestionId) return;
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;
    const tutorMessages = chatContainer.querySelectorAll('.message.tutor');
    if (tutorMessages.length === 0) return;

    const lastMessage = tutorMessages[tutorMessages.length - 1];
    const langLabel = lastMessage.querySelector('.lang-label');
    const responseDiv = lastMessage.querySelector('.language-content div:last-child');
    const match = BiLingoData.mathTutorQuickQuestions.find(q => q.id === currentMathQuestionId);

    if (langLabel) langLabel.textContent = currentLanguage;
    if (responseDiv && match) {
        responseDiv.innerHTML = formatAnswer(match.responses[currentLanguage]);
    }
}



function askQuestion(questionId, animate = true) {
    currentQuestionId = questionId;
    const chatContainer = document.getElementById('chat-container');
    const qa = BiLingoData.tutorQA[questionId];

    if (!qa) return;

    // Clear chat if new question (not coming from language switch)
    if (animate) {
        chatContainer.innerHTML = '';
    }

    // Add user question
    addMessage('user', qa[currentLanguage].question, 'YOU');

    // Show typing indicator
    if (animate) {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addTutorResponse(qa);
            scrollPageToBottom();
        }, 1500);
    } else {
        addTutorResponse(qa);
        scrollPageToBottom();
    }
}

function askCustomQuestion(question) {
    const chatContainer = document.getElementById('chat-container');
    currentQuestionId = null;

    // Track conversation for quiz generation
    saveTutorConversation({ question: question, timestamp: Date.now() });

    // Add user question
    addMessage('user', question, 'YOU');

    // Show typing indicator
    showTypingIndicator();

    const memory = getTutorMemory();
    const weakTopics = memory && memory.weakTopics ? memory.weakTopics : [];
    fetchTutorResponse(question, weakTopics)
        .then(response => {
            removeTypingIndicator();
            const liveResponse = {
                english: { question: question, answer: response.english || response.answer || response },
                isizulu: { question: question, answer: response.isizulu || response.answer || response },
                sesotho: { question: question, answer: response.sesotho || response.answer || response }
            };
            lastCustomResponse = liveResponse;
            addTutorResponse(liveResponse);
            scrollPageToBottom();
        })
        .catch(err => {
            console.error('Live API error:', err);
            removeTypingIndicator();
            var errorMsg = 'Sorry, I couldn\'t reach the tutor. Please make sure the API is deployed and try again.';
            addTutorMessage(errorMsg);
            scrollPageToBottom();
        });
}

async function fetchTutorResponse(question, weakTopics) {
    const body = { question: question };
    if (weakTopics && weakTopics.length > 0) {
        body.weakTopics = weakTopics;
    }
    const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Live API request failed');
    }

    return response.json();
}

function addMessage(type, text, sender) {
    const chatContainer = document.getElementById('chat-container');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    messageDiv.innerHTML = `
        <div class="message-avatar">${sender.charAt(0)}</div>
        <div>
            <div class="message-bubble">
                <div class="message-question">${text}</div>
            </div>
            <div class="message-meta">${sender} · ${time}</div>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addTutorResponse(qa) {
    const chatContainer = document.getElementById('chat-container');
    const p = getPersonality(currentLanguage);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message tutor';
    messageDiv.dataset.hasLang = 'true';
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    messageDiv.innerHTML = `
        <div class="message-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-deep))">${p.avatar}</div>
        <div>
            <div class="message-bubble">
                <div class="language-content">
                    <div class="lang-label">${currentLanguage}</div>
                    <div class="lang-text">${formatAnswer(qa[currentLanguage].answer)}</div>
                </div>
            </div>
            <div class="message-meta">${p.metaLabel} · ${time}</div>
        </div>
    `;

    // Store trilingual data on the element for language switching
    messageDiv.langData = qa;

    chatContainer.appendChild(messageDiv);
    chatHistory.push({ type: 'tutor', el: messageDiv, langData: qa, timestamp: Date.now() });
    scrollToBottom();
}

function addTutorMessage(answer) {
    const chatContainer = document.getElementById('chat-container');
    const p = getPersonality(currentLanguage);

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message tutor';

    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    messageDiv.innerHTML = `
        <div class="message-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-deep))">${p.avatar}</div>
        <div>
            <div class="message-bubble">
                <div class="language-content">
                    <div class="lang-label">${currentLanguage}</div>
                    <div class="lang-text">${formatAnswer(answer)}</div>
                </div>
            </div>
            <div class="message-meta">${p.metaLabel} · ${time}</div>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    chatHistory.push({ type: 'tutor', el: messageDiv, langData: null, timestamp: Date.now() });
    scrollToBottom();
}

function formatAnswer(answer) {
    // Convert line breaks to <br> and add basic formatting
    return answer
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-container');
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message tutor';
    const p = getPersonality(currentLanguage);
    typingDiv.innerHTML = `
        <div class="message-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-deep))">${p.avatar}</div>
        <div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;

    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
        typing.remove();
    }
}

function rerenderCurrentQuestion() {
    // Update ALL tutor messages with trilingual data to the current language
    chatHistory.forEach(function(entry) {
        if (entry.type === 'tutor' && entry.el && entry.langData) {
            var localized = entry.langData[currentLanguage] || entry.langData.english;
            if (!localized) return;
            var textEl = entry.el.querySelector('.lang-text');
            if (textEl) {
                textEl.innerHTML = formatAnswer(localized.answer || localized);
            }
            var label = entry.el.querySelector('.lang-label');
            if (label) label.textContent = currentLanguage;
        } else if (entry.type === 'tutor' && entry.el && !entry.langData) {
            // Plain text message — just update the label
            var label = entry.el.querySelector('.lang-label');
            if (label) label.textContent = currentLanguage;
        }
    });
}

function showWelcomeMessage() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer || chatContainer.children.length > 0) return;
    const p = getPersonality(currentLanguage);
    const welcomeText = getTutorWelcomeMessage(currentLanguage);
    
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'message tutor';
    welcomeDiv.innerHTML = `
        <div class="message-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-deep))">${p.avatar}</div>
        <div>
            <div class="message-bubble">
                <div>${welcomeText}</div>
                ${getTutorMemory() && getTutorMemory().weakTopics && getTutorMemory().weakTopics.length > 0 ? '<div class="tutor-knows-you" style="margin-top:0.75rem;">🧠 I remember what you\'ve been learning</div>' : ''}
            </div>
            <div class="message-meta">${p.metaLabel} · ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
        </div>
    `;

    chatContainer.appendChild(welcomeDiv);
}



// ========== Quiz Generation ==========

function generateQuiz() {
    var input = document.getElementById('quiz-topic-input');
    var topic = input.value.trim();
    var statusEl = document.getElementById('quiz-gen-status');
    var resultEl = document.getElementById('quiz-gen-result');
    var submitBtn = document.getElementById('quiz-gen-submit');

    if (!topic) {
        // Fall back to conversation topic
        var conv = getTutorConversation();
        if (conv.length > 0) {
            topic = conv[0].question;
        }
        if (!topic) {
            statusEl.textContent = 'Please enter a topic first.';
            statusEl.style.color = '#ff6b6b';
            return;
        }
        input.value = topic;
    }

    statusEl.textContent = 'Generating quiz...';
    statusEl.style.color = 'var(--fg-mute)';
    resultEl.innerHTML = '';
    submitBtn.disabled = true;

    // Get conversation context + home language
    var conv = getTutorConversation();
    var profile = getLearnerProfile();
    var homeLanguage = profile ? (profile.languageName || 'English') : 'English';
    var conversationQuestions = conv.map(function(c) { return c.question; }).slice(-5);
    var explanation = topic;
    if (conv.length > 0) {
        explanation = topic + ' — The learner has been asking questions about this topic in ' + homeLanguage + '.';
    }

    fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            topic: topic,
            explanation: explanation,
            keyPoints: [],
            numQuestions: 5,
            homeLanguage: homeLanguage,
            conversationContext: conversationQuestions
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        submitBtn.disabled = false;
        if (!data.questions || !data.questions.length) {
            statusEl.textContent = 'Could not generate quiz. Try a different topic.';
            statusEl.style.color = '#ff6b6b';
            return;
        }

        statusEl.textContent = '✓ Quiz generated! ' + data.questions.length + ' questions.';
        statusEl.style.color = '#4ade80';
        displayGeneratedQuiz(topic, data.questions, resultEl);
    })
    .catch(function(err) {
        console.error('Quiz gen error:', err);
        submitBtn.disabled = false;
        statusEl.textContent = 'Could not reach the AI. Try again in a moment.';
        statusEl.style.color = '#ff6b6b';
        // Fallback: still show default questions
        displayGeneratedQuiz(topic, getDefaultQuestions(topic), resultEl);
        statusEl.textContent = '✓ Sample quiz generated (offline mode).';
        statusEl.style.color = '#fbbf24';
    });
}

function getDefaultQuestions(topic) {
    return [
        { question: 'What is the main concept of "' + topic + '"?', options: ['Definition A', 'Definition B', 'Definition C', 'Definition D'], correctAnswer: 0, explanation: 'Review the lesson content for the correct answer.' },
        { question: 'Which of the following best relates to "' + topic + '"?', options: ['Concept 1', 'Concept 2', 'Concept 3', 'Concept 4'], correctAnswer: 1, explanation: 'Check the key ideas in your lesson.' },
        { question: 'Why is ' + topic + ' important to understand?', options: ['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4'], correctAnswer: 2, explanation: 'Think about the real-world applications.' },
        { question: 'How would you apply knowledge of ' + topic + '?', options: ['Application A', 'Application B', 'Application C', 'Application D'], correctAnswer: 0, explanation: 'Consider practical uses of this concept.' },
        { question: 'What is a common misunderstanding about ' + topic + '?', options: ['Mistake 1', 'Mistake 2', 'Mistake 3', 'Mistake 4'], correctAnswer: 3, explanation: 'Review the topic carefully.' }
    ];
}

var lastGeneratedQuiz = null;
var quizLanguage = 'english';

function getQuizLocalized(q, lang) {
    lang = lang || quizLanguage;
    if (q[lang]) return q[lang];
    return q.english || q;
}

function renderQuizLanguageTabs(container) {
    var tabHtml = '<div class="tabs" id="quiz-lang-tabs" style="margin-bottom:0.75rem;">';
    var tabs = [
        { id: 'english', label: 'English' },
        { id: 'isizulu', label: 'isiZulu' },
        { id: 'sesotho', label: 'Sesotho' }
    ];
    tabs.forEach(function(t) {
        tabHtml += '<button class="tab' + (t.id === quizLanguage ? ' active' : '') + '" data-lang="' + t.id + '">' + t.label + '</button>';
    });
    tabHtml += '</div>';
    container.insertAdjacentHTML('afterbegin', tabHtml);

    container.querySelectorAll('#quiz-lang-tabs .tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            quizLanguage = this.dataset.lang;
            container.querySelectorAll('#quiz-lang-tabs .tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            // Re-render question previews
            renderQuizPreview(container.querySelector('.quiz-gen-questions'), lastGeneratedQuiz.questions);
            // Also update inline quiz if active
            var inline = container.querySelector('.quiz-inline');
            if (inline) {
                var qidx = parseInt(inline.dataset.qidx);
                if (!isNaN(qidx) && lastGeneratedQuiz && lastGeneratedQuiz.questions[qidx]) {
                    var localized = getQuizLocalized(lastGeneratedQuiz.questions[qidx]);
                    var qText = inline.querySelector('.quiz-inline-question');
                    if (qText) qText.textContent = escapeHtml(localized.question);
                    var opts = inline.querySelectorAll('.practice-option');
                    var letters = ['A', 'B', 'C', 'D'];
                    opts.forEach(function(opt, idx) {
                        if (localized.options[idx]) opt.innerHTML = letters[idx] + '. ' + escapeHtml(localized.options[idx]);
                    });
                }
            }
        });
    });
}

function renderQuizPreview(listEl, questions) {
    if (!listEl) return;
    var html = '';
    questions.forEach(function(q, idx) {
        var localized = getQuizLocalized(q);
        var letters = ['A', 'B', 'C', 'D'];
        html += '<div class="quiz-gen-question-card">';
        html += '<div class="qg-question">' + (idx + 1) + '. ' + escapeHtml(localized.question) + '</div>';
        localized.options.forEach(function(opt, oi) {
            html += '<div class="qg-option">' + letters[oi] + '. ' + escapeHtml(opt) + '</div>';
        });
        html += '</div>';
    });
    listEl.innerHTML = html;
}

function displayGeneratedQuiz(topic, questions, container, isSaved, existingId) {
    lastGeneratedQuiz = { id: existingId || 'quiz-' + Date.now(), topic: topic, questions: questions, createdAt: new Date().toISOString() };
    quizLanguage = 'english';

    var html = '';
    // Language tabs
    html += '<div class="tabs" id="quiz-lang-tabs" style="margin-bottom:0.75rem;">';
    var langOptions = ['english', 'isizulu', 'sesotho'];
    var langLabels = ['English', 'isiZulu', 'Sesotho'];
    for (var li = 0; li < langOptions.length; li++) {
        html += '<button class="tab' + (langOptions[li] === 'english' ? ' active' : '') + '" data-lang="' + langOptions[li] + '">' + langLabels[li] + '</button>';
    }
    html += '</div>';

    html += '<p style="font-size:13px;color:var(--fg-dim);margin-bottom:0.75rem;">Topic: <strong>' + escapeHtml(topic) + '</strong></p>';
    html += '<div class="quiz-gen-questions" id="quiz-gen-questions">';
    // Render questions inline
    questions.forEach(function(q, idx) {
        var localized = getQuizLocalized(q, 'english');
        var letters = ['A', 'B', 'C', 'D'];
        html += '<div class="quiz-gen-question-card">';
        html += '<div class="qg-question">' + (idx + 1) + '. ' + escapeHtml(localized.question) + '</div>';
        localized.options.forEach(function(opt, oi) {
            html += '<div class="qg-option">' + letters[oi] + '. ' + escapeHtml(opt) + '</div>';
        });
        html += '</div>';
    });
    html += '</div>';
    html += '<div class="quiz-gen-actions">';
    html += '<button class="btn btn-primary" id="take-quiz-now-btn">Take Quiz Now</button>';
    if (isSaved) {
        html += '<span class="quiz-taken-badge">✓ Saved</span>';
    } else {
        html += '<button class="btn btn-outline" id="save-quiz-btn">Save for Later</button>';
    }
    html += '</div>';

    container.innerHTML = html;

    // Wire language tabs
    container.querySelectorAll('#quiz-lang-tabs .tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            quizLanguage = this.dataset.lang;
            container.querySelectorAll('#quiz-lang-tabs .tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            var questionsEl = document.getElementById('quiz-gen-questions');
            if (questionsEl && lastGeneratedQuiz) {
                var qHtml = '';
                lastGeneratedQuiz.questions.forEach(function(q, idx) {
                    var localized = getQuizLocalized(q);
                    var letters = ['A', 'B', 'C', 'D'];
                    qHtml += '<div class="quiz-gen-question-card">';
                    qHtml += '<div class="qg-question">' + (idx + 1) + '. ' + escapeHtml(localized.question) + '</div>';
                    localized.options.forEach(function(opt, oi) {
                        qHtml += '<div class="qg-option">' + letters[oi] + '. ' + escapeHtml(opt) + '</div>';
                    });
                    qHtml += '</div>';
                });
                questionsEl.innerHTML = qHtml;
            }
        });
    });

    document.getElementById('take-quiz-now-btn').addEventListener('click', function() {
        container.innerHTML = '';
        startInlineQuiz(lastGeneratedQuiz, container, function() {
            var completedHtml = '<div style="text-align:center;padding:1rem;margin-top:1rem;">';
            completedHtml += '<button class="btn btn-outline" id="save-quiz-after-btn" style="margin-right:0.5rem;">Save Quiz</button>';
            completedHtml += '<button class="btn btn-outline" onclick="location.href=\'dashboard.html\'">Back to Dashboard</button>';
            completedHtml += '</div>';
            container.insertAdjacentHTML('afterend', completedHtml);
            document.getElementById('save-quiz-after-btn').addEventListener('click', function() {
                saveQuiz(lastGeneratedQuiz);
                this.textContent = '✓ Saved!';
                this.disabled = true;
            });
        });
    });

    if (!isSaved) {
        document.getElementById('save-quiz-btn').addEventListener('click', function() {
            saveQuiz(lastGeneratedQuiz);
            this.textContent = '✓ Saved to Dashboard!';
            this.disabled = true;
            document.getElementById('take-quiz-now-btn').textContent = 'Take Quiz Now';
        });
    }
}

// Keep renderQuizLanguageTabs and renderQuizPreview as no-ops in case called elsewhere
function renderQuizLanguageTabs() {}
function renderQuizPreview() {}

function startInlineQuiz(quiz, container, onComplete) {
    var dailyCount = getDailyQuizCount();
    if (dailyCount >= 10) {
        container.innerHTML = '<div style="text-align:center;padding:1rem;color:#ff6b6b;font-size:14px;">⚠️ You\'ve used all 10 questions today. Come back tomorrow!</div>';
        return;
    }

    var questions = quiz.questions;
    var currentIdx = 0;
    var score = 0;
    var answered = false;

    function showQuestion() {
        if (currentIdx >= questions.length) {
            finishInline();
            return;
        }

        var q = questions[currentIdx];
        var localized = getQuizLocalized(q);
        var letters = ['A', 'B', 'C', 'D'];
        answered = false;

        var html = '<div class="quiz-inline" data-qidx="' + currentIdx + '">';
        html += '<div class="quiz-inline-progress">Question ' + (currentIdx + 1) + ' of ' + questions.length + '</div>';
        html += '<div class="quiz-inline-question">' + escapeHtml(localized.question) + '</div>';
        html += '<div class="quiz-inline-options practice-options">';
        localized.options.forEach(function(opt, idx) {
            html += '<div class="practice-option" data-index="' + idx + '" data-correct="' + (idx === q.correctAnswer) + '">' + letters[idx] + '. ' + escapeHtml(opt) + '</div>';
        });
        html += '</div>';
        html += '<div id="inline-feedback-' + currentIdx + '" style="margin-top:0.75rem;"></div>';
        html += '<button class="btn btn-primary btn-check" id="inline-submit-' + currentIdx + '" style="display:none;margin-top:0.75rem;" disabled>Submit Answer</button>';
        html += '<button class="btn btn-outline" id="inline-next-' + currentIdx + '" style="display:none;margin-top:0.75rem;">Next</button>';
        html += '</div>';
        container.innerHTML = html;

        // Event delegation on container for options
        var selectedIdx = null;
        container.querySelector('.quiz-inline').addEventListener('click', function(e) {
            var opt = e.target.closest('.practice-option');
            if (!opt || answered) return;

            var options = container.querySelectorAll('.practice-option');
            options.forEach(function(o) { o.classList.remove('selected'); });
            opt.classList.add('selected');
            selectedIdx = parseInt(opt.dataset.index);

            var submitBtn = container.querySelector('[id^="inline-submit-"]');
            submitBtn.style.display = 'inline-flex';
            submitBtn.disabled = false;
        });

        // Language tabs for inline quiz
        var langTabHtml = '<div class="tabs" id="inline-quiz-lang-tabs" style="margin-bottom:0.75rem;">';
        var langTabs = [
            { id: 'english', label: 'English' },
            { id: 'isizulu', label: 'isiZulu' },
            { id: 'sesotho', label: 'Sesotho' }
        ];
        langTabs.forEach(function(t) {
            langTabHtml += '<button class="tab' + (t.id === quizLanguage ? ' active' : '') + '" data-lang="' + t.id + '">' + t.label + '</button>';
        });
        langTabHtml += '</div>';
        container.querySelector('.quiz-inline').insertAdjacentHTML('afterbegin', langTabHtml);
        container.querySelectorAll('#inline-quiz-lang-tabs .tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                quizLanguage = this.dataset.lang;
                container.querySelectorAll('#inline-quiz-lang-tabs .tab').forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
                var freshQ = questions[currentIdx];
                var freshLocalized = getQuizLocalized(freshQ);
                var qText = container.querySelector('.quiz-inline-question');
                if (qText) qText.textContent = escapeHtml(freshLocalized.question);
                var opts = container.querySelectorAll('.practice-option');
                opts.forEach(function(opt, idx) {
                    if (freshLocalized.options[idx]) opt.innerHTML = letters[idx] + '. ' + escapeHtml(freshLocalized.options[idx]);
                });
                if (answered) {
                    var feedback = container.querySelector('[id^="inline-feedback-"]');
                    var localized = getQuizLocalized(freshQ);
                    if (feedback && localized.explanation) {
                        var expHtml = escapeHtml(localized.explanation || '');
                        feedback.innerHTML = (selectedIdx === freshQ.correctAnswer ? '<strong>✓ Correct!</strong><br>' : '<strong>✗ Not quite.</strong><br>') + expHtml;
                    }
                }
            });
        });

        // Submit button
        container.querySelector('[id^="inline-submit-"]').addEventListener('click', function() {
            if (selectedIdx === null || answered) return;
            answered = true;

            var correct = selectedIdx === q.correctAnswer;
            var opts = container.querySelectorAll('.practice-option');
            var feedback = container.querySelector('[id^="inline-feedback-"]');

            opts.forEach(function(opt, idx) {
                if (idx === q.correctAnswer) opt.classList.add('correct');
                else if (idx === selectedIdx && !correct) opt.classList.add('incorrect');
                opt.style.pointerEvents = 'none';
            });

            this.style.display = 'none';

            var localized = getQuizLocalized(q);
            var explanationHtml = escapeHtml(localized.explanation || q.explanation || '');

            if (correct) {
                score++;
                feedback.className = 'practice-feedback correct show';
                feedback.innerHTML = '<strong>✓ Correct!</strong><br>' + explanationHtml;
            } else {
                feedback.className = 'practice-feedback incorrect show';
                feedback.innerHTML = '<strong>✗ Not quite. The answer was ' + letters[q.correctAnswer] + '.</strong><br>' + explanationHtml;
            }

            incrementQuizCounter();

            var nextBtn = container.querySelector('[id^="inline-next-"]');
            nextBtn.style.display = 'inline-flex';
            nextBtn.onclick = function() {
                currentIdx++;
                showQuestion();
            };
        });
    }

    function finishInline() {
        var total = questions.length;
        var pct = Math.round(score / total * 100);
        var profile = getLearnerProfile();
        var lang = profile ? (profile.languageName || 'English') : 'English';

        updateTutorMemory(quiz.topic, pct);
        saveQuizAttempt(quiz.id, score, total);

        var message = pct >= 80 ? '🌟 Excellent! You understand the English terms clearly.'
            : pct >= 60 ? 'Good job! A few English terms need more practice — try asking the tutor about them.'
            : 'Keep at it. Some English terms were tricky — ask the tutor to explain them in ' + lang + '.';

        container.innerHTML = '<div class="quiz-inline" style="text-align:center;">';
        container.innerHTML += '<div style="font-size:2.5rem;font-weight:700;margin-bottom:0.3rem;' + (pct >= 60 ? 'color:#4ade80;' : 'color:#fbbf24;') + '">' + score + '/' + total + '</div>';
        container.innerHTML += '<div style="font-size:14px;color:var(--fg-dim);margin-bottom:1rem;">' + message + '</div>';
        container.innerHTML += '<div style="font-size:12px;color:var(--fg-mute);font-family:var(--f-mono);margin-bottom:1rem;">English questions · explained in English + ' + lang + '</div>';
        container.innerHTML += '</div>';

        saveQuiz(quiz);
        if (onComplete) onComplete();
    }

    showQuestion();
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function scrollPageToBottom() {
    window.scrollTo({ top: 99999, behavior: 'smooth' });
}
