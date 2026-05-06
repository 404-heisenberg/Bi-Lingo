# Bi-Lingo Prototype Demo Guide

## Quick Start
1. Open `index.html` in your browser
2. Click **"Try Demo →"** button on the hero section
3. Follow the onboarding flow

## Recommended Demo Path (10-15 minutes)

### 1. Landing Page (2 mins)
- Show the hero section with animated phone mockup
- Point out the multilingual typewriter in "11 official languages" section
- Click **"Try Demo →"** button

### 2. Learner Onboarding (2 mins)
- Select a grade (e.g., Grade 7)
- Choose a subject (e.g., Natural Sciences)
- Select a language (e.g., isiZulu, Sesotho)
- Optional: Add a learning goal
- Click **"Continue to Dashboard →"**

### 3. Learner Dashboard (2 mins)
- Show the welcome banner with learner context
- Point out the stats (total lessons, completed, confidence)
- Show the lesson cards with progress bars
- Demo the quick question buttons
- Click **"Ask Your Own Question →"**

### 4. Tutor Page - Core Wow-Factor (3-4 mins)
- Click one of the quick questions (e.g., "What is photosynthesis?")
- Show the chat interface with typing indicator
- Switch between language tabs (English → isiZulu → Sesotho)
- Point out culturally relevant explanations
- Try typing a custom question in the input box
- Click **"Back to Dashboard"**

### 5. Lesson Detail Page (2 mins)
- From dashboard, click **"View Lesson"** on any lesson card
- Switch between language tabs to show multilingual content
- Review the key points section
- Try the practice question
- Click **"Ask Tutor About This →"**

### 6. Teacher Dashboard (2-3 mins)
- From dashboard, click **"Teacher View →"** in top nav
- Show the class overview stats
- Point out the **Language Barrier Alert**
- Review individual learner cards with confidence indicators
- Show struggling topics and recommended interventions
- Click **"Exit Demo"** to return to landing page

## Key Features to Highlight

### Learner Experience
✓ Multilingual by design (not an afterthought)
✓ Personalized onboarding
✓ Structured lessons with progress tracking
✓ AI tutor with culturally relevant explanations
✓ Multiple South African languages (isiZulu, Sesotho, English)

### Teacher Experience
✓ Visibility into learner barriers
✓ Language-specific insights
✓ Simple intervention guidance
✓ Confidence and progress tracking
✓ Actionable recommendations

## Technical Notes
- All data is mocked (no backend needed)
- `localStorage` persists learner profile between pages
- Responsive design (works on mobile)
- Consistent dark theme with cyan accents
- Smooth transitions and animations

## Demo Tips
1. **Practice the flow** at least once before presenting
2. **Start with isiZulu** as the language - it's the most visually distinct
3. **Use the quick question buttons** - they're pre-loaded with answers
4. **Show the language switching** on the Tutor page - it's the core wow-factor
5. **Highlight the teacher view** - shows Bi-Lingo supports classrooms, not just individuals
6. **Exit and restart** the demo to show it's a fresh experience each time

## File Structure
```
Bi-Lingo/
├── index.html (landing page)
├── styles.css (shared styles)
├── script.js (shared scripts)
├── pages/
│   ├── onboarding.html (learner setup)
│   ├── dashboard.html (learner home)
│   ├── tutor.html (AI tutor)
│   ├── lesson.html (lesson detail)
│   └── teacher.html (teacher dashboard)
├── css/
│   ├── onboarding.css
│   ├── dashboard.css
│   ├── tutor.css
│   ├── lesson.css
│   └── teacher.css
├── js/
│   ├── onboarding.js
│   ├── dashboard.js
│   ├── tutor.js
│   ├── lesson.js
│   └── teacher.js
└── data/
    └── mock-data.js
```

## Browser Testing Checklist
- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Mobile viewport (320px-480px)
- [ ] Test "Exit Demo" from each page
- [ ] Verify language switching works
- [ ] Check all navigation links

## Common Questions & Answers

**Q: Is this connected to a real AI?**
A: No, this is a prototype with mocked responses. One custom question shows a mock "typing" animation.

**Q: Does it really support all 11 languages?**
A: The prototype demonstrates 3 languages (English, isiZulu, Sesotho). The architecture supports all 11.

**Q: Is there real user authentication?**
A: No, it uses `localStorage` to simulate a user session for the demo.

**Q: Can I modify the content?**
A: Yes! Edit `data/mock-data.js` to change lessons, Q&A pairs, and teacher data.

**Q: How do I restart the demo?**
A: Click "Exit Demo" on any page, or click "Try Demo" again from the landing page with `?fresh=true` in the URL.

---

Built for mentors, judges, and stakeholders to experience the Bi-Lingo vision.
For every child. In every language. 🇿🇦
