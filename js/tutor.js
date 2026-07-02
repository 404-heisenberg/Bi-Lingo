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
            document.querySelector('.page-title').textContent = 'Quiz: ' + savedQuiz.topic;
            var resultEl = document.getElementById('quiz-gen-result');
            var section = document.getElementById('quiz-gen-section');
            section.style.display = 'block';
            displayGeneratedQuiz(savedQuiz.topic, savedQuiz.questions, resultEl, true);
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

            if (profile && profile.languageName) {
                contextEl.innerHTML = 'Home language: <strong>' + profile.languageName + '</strong>';
            }

            if (conv.length > 0) {
                var firstQ = conv[0].question;
                if (firstQ && firstQ.length < 80) {
                    quizTopicInput.placeholder = 'e.g. ' + firstQ;
                }
                // Show recent questions as context
                var recentQuestions = conv.slice(-3).map(function(c) { return '"' + c.question + '"'; }).join(', ');
                contextEl.innerHTML += (contextEl.innerHTML ? ' · ' : '') + 'Recent questions: ' + recentQuestions;
                contextEl.style.display = 'block';
            } else {
                contextEl.style.display = 'none';
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

    // Add demo notice
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
        }, 1500);
    } else {
        addTutorResponse(qa);
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
        })
        .catch(err => {
            console.error('Live API error:', err);
            removeTypingIndicator();
            const fallbackResponse = {
                english: { question: question, answer: getMockResponse(question) },
                isizulu: { question: question, answer: getTutorMemory() && getTutorMemory().weakTopics && getTutorMemory().weakTopics.length > 0
                    ? '[isiZulu: Ngiyabona ukuthi ubusebenza ku-' + getTutorMemory().weakTopics[0] + '. Ake sibhekane nayo ndawonye!]'
                    : '[isiZulu translation coming soon. This is a demo of how your question would be answered in isiZulu.]' },
                sesotho: { question: question, answer: getTutorMemory() && getTutorMemory().weakTopics && getTutorMemory().weakTopics.length > 0
                    ? '[Sesotho: Ke bona hore o ntse o sebetsa ho ' + getTutorMemory().weakTopics[0] + '. Ha re sebetsane le yona hammoho!]'
                    : '[Sesotho translation coming soon. This is a demo of how your question would be answered in Sesotho.]' }
            };
            lastCustomResponse = fallbackResponse;
            addTutorResponse(fallbackResponse);
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
                    <div>${formatAnswer(qa[currentLanguage].answer)}</div>
                </div>
            </div>
            <div class="message-meta">${p.metaLabel} · ${time}</div>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
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
                    <div>${formatAnswer(answer)}</div>
                </div>
            </div>
            <div class="message-meta">${p.metaLabel} · ${time}</div>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    scrollToBottom();
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
    const qa = currentQuestionId ? BiLingoData.tutorQA[currentQuestionId] : null;
    const responseSet = qa || lastCustomResponse;
    if (!responseSet) return;

    // Find and update the last tutor message
    const messages = document.querySelectorAll('.message.tutor');
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const contentDiv = lastMessage.querySelector('.language-content div:last-child');
    
    if (contentDiv) {
        contentDiv.innerHTML = formatAnswer(responseSet[currentLanguage].answer);
        const langLabel = lastMessage.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = currentLanguage;
        }
    }
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

function getMockResponse(question) {
    // Simple mock responses for custom questions
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('math') || lowerQ.includes('calculate') || lowerQ.includes('number')) {
        return "That's a great math question! In a full version, I would explain this step-by-step in your chosen language. For now, remember: math is like building blocks — master the basics first!";
    }
    
    if (lowerQ.includes('science') || lowerQ.includes('why') || lowerQ.includes('how')) {
        return "Excellent science question! I would explain this concept with examples from South African contexts — like comparing plant cycles to crops in Limpopo or Mpumalanga. Science is everywhere around us!";
    }
    
    return "That's an interesting question! In the full version of Bi-Lingo, I'll provide detailed explanations in your home language with culturally relevant examples. Try one of the quick questions to see the multilingual experience!";
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

    var dailyCount = getDailyQuizCount();
    if (dailyCount >= 10) {
        statusEl.textContent = '⚠️ You\'ve used all 10 questions today. Come back tomorrow!';
        statusEl.style.color = '#ff6b6b';
        submitBtn.disabled = false;
        return;
    }

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

function displayGeneratedQuiz(topic, questions, container, isSaved) {
    lastGeneratedQuiz = { id: 'quiz-' + Date.now(), topic: topic, questions: questions, createdAt: new Date().toISOString() };

    var html = '<div class="quiz-gen-questions">';
    html += '<p style="font-size:13px;color:var(--fg-dim);margin-bottom:0.75rem;">Topic: <strong>' + escapeHtml(topic) + '</strong></p>';
    questions.forEach(function(q, idx) {
        var letters = ['A', 'B', 'C', 'D'];
        html += '<div class="quiz-gen-question-card">';
        html += '<div class="qg-question">' + (idx + 1) + '. ' + escapeHtml(q.question) + '</div>';
        q.options.forEach(function(opt, oi) {
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

    document.getElementById('take-quiz-now-btn').addEventListener('click', function() {
        container.innerHTML = '';
        startInlineQuiz(lastGeneratedQuiz, container, function() {
            // After quiz completes, show actions again
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

function startInlineQuiz(quiz, container, onComplete) {
    var dailyCount = getDailyQuizCount();
    if (dailyCount >= 10) {
        container.innerHTML = '<div style="text-align:center;padding:1rem;color:#ff6b6b;font-size:14px;">⚠️ You\'ve used all 10 questions today. Come back tomorrow!</div>';
        return;
    }

    var questions = quiz.questions;
    var currentIdx = 0;
    var score = 0;

    function showQuestion() {
        if (currentIdx >= questions.length) {
            finishInline();
            return;
        }

        var q = questions[currentIdx];
        var letters = ['A', 'B', 'C', 'D'];

        container.innerHTML = '<div class="quiz-inline">';
        container.innerHTML += '<div class="quiz-inline-progress">Question ' + (currentIdx + 1) + ' of ' + questions.length + '</div>';
        container.innerHTML += '<div class="quiz-inline-question">' + escapeHtml(q.question) + '</div>';
        container.innerHTML += '<div class="quiz-inline-options practice-options" id="inline-options">';
        q.options.forEach(function(opt, idx) {
            container.innerHTML += '<div class="practice-option" data-index="' + idx + '">' + letters[idx] + '. ' + escapeHtml(opt) + '</div>';
        });
        container.innerHTML += '</div>';
        container.innerHTML += '<button class="btn btn-primary btn-check" id="inline-submit" style="display:none;margin-top:0.75rem;">Submit Answer</button>';
        container.innerHTML += '<div id="inline-feedback" style="margin-top:0.75rem;"></div>';
        container.innerHTML += '<button class="btn btn-outline" id="inline-next" style="display:none;margin-top:0.75rem;">Next</button>';
        container.innerHTML += '</div>';

        var options = container.querySelectorAll('#inline-options .practice-option');
        var submitBtn = container.querySelector('#inline-submit');
        var selectedIdx = null;

        options.forEach(function(opt) {
            opt.addEventListener('click', function() {
                if (this.classList.contains('correct') || this.classList.contains('incorrect')) return;
                options.forEach(function(o) { o.classList.remove('selected'); });
                this.classList.add('selected');
                selectedIdx = parseInt(this.dataset.index);
                submitBtn.style.display = 'inline-flex';
            });
        });

        submitBtn.addEventListener('click', function() {
            if (selectedIdx === null) return;
            var correct = selectedIdx === q.correctAnswer;
            var feedback = container.querySelector('#inline-feedback');

            options.forEach(function(opt, idx) {
                if (idx === q.correctAnswer) opt.classList.add('correct');
                else if (idx === selectedIdx && !correct) opt.classList.add('incorrect');
            });

            submitBtn.style.display = 'none';

            var explanationHtml = escapeHtml(q.explanation || '');
            if (q.homeLanguageExplanation) {
                explanationHtml += '<div style="margin-top:0.6rem;padding:0.5rem 0.75rem;background:color-mix(in oklch,var(--accent) 10%,transparent);border-radius:8px;font-size:13px;border:1px solid color-mix(in oklch,var(--accent) 20%,transparent);">🌍 <strong>In your language:</strong> ' + escapeHtml(q.homeLanguageExplanation) + '</div>';
            }

            if (correct) {
                score++;
                feedback.className = 'practice-feedback correct show';
                feedback.innerHTML = '<strong>✓ Correct!</strong><br>' + explanationHtml;
            } else {
                feedback.className = 'practice-feedback incorrect show';
                feedback.innerHTML = '<strong>✗ Not quite. The answer was ' + letters[q.correctAnswer] + '.</strong><br>' + explanationHtml;
            }

            incrementQuizCounter();
            var nextBtn = container.querySelector('#inline-next');
            nextBtn.style.display = 'inline-flex';
            nextBtn.addEventListener('click', function() {
                currentIdx++;
                showQuestion();
            }, { once: true });
        });
    }

    function finishInline() {
        var total = questions.length;
        var pct = Math.round(score / total * 100);
        var profile = getLearnerProfile();
        var lang = profile ? (profile.languageName || 'English') : 'English';

        // Update tutor memory
        updateTutorMemory(quiz.topic, pct);

        // Save attempt
        saveQuizAttempt(quiz.id, score, total);

        var message = pct >= 80 ? '🌟 Excellent! You understand the English terms clearly.'
            : pct >= 60 ? 'Good job! A few English terms need more practice — try asking the tutor about them.'
            : 'Keep at it. Some English terms were tricky — ask the tutor to explain them in ' + lang + '.';

        container.innerHTML = '<div class="quiz-inline" style="text-align:center;">';
        container.innerHTML += '<div style="font-size:2.5rem;font-weight:700;margin-bottom:0.3rem;' + (pct >= 60 ? 'color:#4ade80;' : 'color:#fbbf24;') + '">' + score + '/' + total + '</div>';
        container.innerHTML += '<div style="font-size:14px;color:var(--fg-dim);margin-bottom:1rem;">' + message + '</div>';
        container.innerHTML += '<div style="font-size:12px;color:var(--fg-mute);font-family:var(--f-mono);margin-bottom:1rem;">English questions · explained in English + ' + lang + '</div>';
        container.innerHTML += '</div>';

        // Save quiz automatically so it appears on dashboard
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
