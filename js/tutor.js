// ========== Tutor Page Logic ==========

let currentLanguage = 'english';
let currentQuestionId = null;
let currentLessonId = null;
let currentMathQuestionId = null;
let clickedMathQuestionIds = new Set();
let liveMode = false;

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

    // Check for question or lesson parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('question');
    const lessonId = urlParams.get('lessonId');

    if (lessonId) {
        currentLessonId = lessonId;
        hideGenericTutorElements();
        renderLessonTutor(lessonId);
        updateTutorPageTitle(lessonId);
    } else {
        // Populate quick questions
        populateQuickQuestions();
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

    const liveBtn = document.getElementById('live-mode-btn');
    if (liveBtn) {
        liveBtn.addEventListener('click', () => {
            liveMode = !liveMode;
            liveBtn.classList.toggle('active', liveMode);
            liveBtn.textContent = liveMode ? 'Live' : 'Demo';
            if (customInput) {
                customInput.placeholder = liveMode
                    ? 'Ask a question (live AI response)'
                    : 'Ask your own question...';
            }
        });
    }

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
});

function populateQuickQuestions() {
    const quickQuestionsContainer = document.getElementById('quick-questions');
    const questions = BiLingoData.quickQuestions;

    quickQuestionsContainer.innerHTML = questions.map(q => `
        <button class="quick-question-btn" data-id="${q.id}">
            ${q.text}
        </button>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = this.dataset.id;
            askQuestion(questionId, true);
        });
    });
}

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
            // Re-render current question in new language
            if (currentQuestionId) {
                rerenderCurrentQuestion();
            }
            if (currentLessonId) {
                if (currentLessonId === 'math-foundations') {
                    updateMathTutorResponseLanguage();
                } else {
                    renderLessonTutor(currentLessonId);
                }
            }
        });
    });
}

function hideGenericTutorElements() {
    const quickQuestions = document.getElementById('quick-questions');
    const quickWrapper = quickQuestions ? quickQuestions.parentElement : null;
    if (quickWrapper) quickWrapper.style.display = 'none';
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

    // Add user question
    addMessage('user', question, 'YOU');

    // Show typing indicator
    showTypingIndicator();

    if (liveMode) {
        fetchTutorResponse(question)
            .then(response => {
                removeTypingIndicator();
                const liveResponse = {
                    english: { question: question, answer: response.english || response.answer || response },
                    isizulu: { question: question, answer: response.isizulu || response.answer || response },
                    sesotho: { question: question, answer: response.sesotho || response.answer || response }
                };
                addTutorResponse(liveResponse);
            })
            .catch(err => {
                console.error('Live API error:', err);
                removeTypingIndicator();
                const fallbackResponse = {
                    english: { question: question, answer: getMockResponse(question) },
                    isizulu: { question: question, answer: '[isiZulu translation coming soon. This is a demo of how your question would be answered in isiZulu.]' },
                    sesotho: { question: question, answer: '[Sesotho translation coming soon. This is a demo of how your question would be answered in Sesotho.]' }
                };
                addTutorResponse(fallbackResponse);
            });
        return;
    }

    setTimeout(() => {
        removeTypingIndicator();

        // Mock response for custom questions
        const mockResponse = {
            english: {
                question: question,
                answer: getMockResponse(question)
            },
            isizulu: {
                question: question,
                answer: '[isiZulu translation coming soon. This is a demo of how your question would be answered in isiZulu.]'
            },
            sesotho: {
                question: question,
                answer: '[Sesotho translation coming soon. This is a demo of how your question would be answered in Sesotho.]'
            }
        };

        addTutorResponse(mockResponse);
    }, 2000);
}

async function fetchTutorResponse(question) {
    const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
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
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message tutor';
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    messageDiv.innerHTML = `
        <div class="message-avatar">B</div>
        <div>
            <div class="message-bubble">
                <div class="language-content">
                    <div class="lang-label">${currentLanguage}</div>
                    <div>${formatAnswer(qa[currentLanguage].answer)}</div>
                </div>
            </div>
            <div class="message-meta">TUTOR · ${time}</div>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addTutorMessage(answer) {
    const chatContainer = document.getElementById('chat-container');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message tutor';

    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    messageDiv.innerHTML = `
        <div class="message-avatar">B</div>
        <div>
            <div class="message-bubble">
                <div class="language-content">
                    <div class="lang-label">${currentLanguage}</div>
                    <div>${formatAnswer(answer)}</div>
                </div>
            </div>
            <div class="message-meta">TUTOR · ${time}</div>
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
    typingDiv.innerHTML = `
        <div class="message-avatar">B</div>
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
    const qa = BiLingoData.tutorQA[currentQuestionId];
    if (!qa) return;

    // Find and update the last tutor message
    const messages = document.querySelectorAll('.message.tutor');
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const contentDiv = lastMessage.querySelector('.language-content div:last-child');
    
    if (contentDiv) {
        contentDiv.innerHTML = formatAnswer(qa[currentLanguage].answer);
        const langLabel = lastMessage.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = currentLanguage;
        }
    }
}

function showWelcomeMessage() {
    const chatContainer = document.getElementById('chat-container');
    
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'message tutor';
    welcomeDiv.innerHTML = `
        <div class="message-avatar">B</div>
        <div>
            <div class="message-bubble">
                <div style="margin-bottom: 0.5rem;">👋 Welcome to Bi-Lingo Tutor!</div>
                <div>Select a quick question below, or type your own question to get started.</div>
            </div>
            <div class="message-meta">TUTOR · ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
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

function scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
