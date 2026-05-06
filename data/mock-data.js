// ========== Bi-Lingo Prototype Mock Data ==========

const BiLingoData = {
    // Language options with native names
    languages: [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'zu', name: 'isiZulu', native: 'isiZulu' },
        { code: 'xh', name: 'isiXhosa', native: 'isiXhosa' },
        { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
        { code: 'st', name: 'Sesotho', native: 'Sesotho' },
        { code: 'tn', name: 'Setswana', native: 'Setswana' },
        { code: 'nso', name: 'Sepedi', native: 'Sepedi' },
        { code: 'ts', name: 'Xitsonga', native: 'Xitsonga' },
        { code: 've', name: 'Tshivenda', native: 'Tshivenda' },
        { code: 'ss', name: 'siSwati', native: 'siSwati' },
        { code: 'nr', name: 'isiNdebele', native: 'isiNdebele' }
    ],

    // Grade options grouped by phase
    grades: [
        { value: '4', label: 'Grade 4', phase: 'Foundation' },
        { value: '5', label: 'Grade 5', phase: 'Foundation' },
        { value: '6', label: 'Grade 6', phase: 'Foundation' },
        { value: '7', label: 'Grade 7', phase: 'Intermediate' },
        { value: '8', label: 'Grade 8', phase: 'Intermediate' },
        { value: '9', label: 'Grade 9', phase: 'Intermediate' },
        { value: '10', label: 'Grade 10', phase: 'Senior' },
        { value: '11', label: 'Grade 11', phase: 'Senior' },
        { value: '12', label: 'Grade 12', phase: 'Senior' }
    ],

    // Subject options
    subjects: [
        { code: 'math', name: 'Mathematics', icon: '📐' },
        { code: 'science', name: 'Natural Sciences', icon: '🔬' },
        { code: 'biology', name: 'Life Sciences', icon: '🧬' },
        { code: 'english', name: 'English', icon: '📖' },
        { code: 'lo', name: 'Life Orientation', icon: '🧘' },
        { code: 'ems', name: 'Economic Management Sciences', icon: '💼' }
    ],

    // Lesson data per subject
    lessons: {
        science: [
            {
                id: 'photosynthesis',
                title: 'Photosynthesis',
                topic: 'Plant Biology',
                difficulty: 'Medium',
                duration: '15 min',
                progress: 0,
                concepts: ['Light energy', 'Chlorophyll', 'Glucose production', 'Oxygen release']
            },
            {
                id: 'water-cycle',
                title: 'The Water Cycle',
                topic: 'Earth Sciences',
                difficulty: 'Easy',
                duration: '12 min',
                progress: 0,
                concepts: ['Evaporation', 'Condensation', 'Precipitation', 'Collection']
            },
            {
                id: 'human-body',
                title: 'Human Body Systems',
                topic: 'Biology',
                difficulty: 'Hard',
                duration: '20 min',
                progress: 0,
                concepts: ['Circulatory system', 'Respiratory system', 'Digestive system']
            },
            {
                id: 'forces',
                title: 'Forces and Motion',
                topic: 'Physics',
                difficulty: 'Medium',
                duration: '18 min',
                progress: 0,
                concepts: ['Gravity', 'Friction', 'Magnetic force', 'Balanced forces']
            },
            {
                id: 'atoms',
                title: 'Atoms and Molecules',
                topic: 'Chemistry',
                difficulty: 'Hard',
                duration: '22 min',
                progress: 0,
                concepts: ['Atomic structure', 'Elements', 'Compounds', 'Chemical bonds']
            },
            {
                id: 'ecosystems',
                title: 'Ecosystems and Habitats',
                topic: 'Environmental Science',
                difficulty: 'Medium',
                duration: '16 min',
                progress: 0,
                concepts: ['Food chains', 'Biodiversity', 'Adaptation', 'Conservation']
            },
            {
                id: 'electricity',
                title: 'Basic Electricity',
                topic: 'Physics',
                difficulty: 'Medium',
                duration: '14 min',
                progress: 0,
                concepts: ['Circuits', 'Conductors', 'Insulators', 'Safety']
            }
        ],
        math: [
            {
                id: 'fractions',
                title: 'Understanding Fractions',
                topic: 'Numbers',
                difficulty: 'Easy',
                duration: '15 min',
                progress: 0,
                concepts: ['Numerator', 'Denominator', 'Equivalent fractions', 'Comparing fractions']
            },
            {
                id: 'algebra',
                title: 'Introduction to Algebra',
                topic: 'Algebra',
                difficulty: 'Medium',
                duration: '20 min',
                progress: 0,
                concepts: ['Variables', 'Expressions', 'Equations', 'Solving for x']
            },
            {
                id: 'geometry',
                title: 'Basic Geometry',
                topic: 'Geometry',
                difficulty: 'Medium',
                duration: '18 min',
                progress: 0,
                concepts: ['Angles', 'Triangles', 'Quadrilaterals', 'Area and perimeter']
            },
            {
                id: 'data-handling',
                title: 'Data Handling',
                topic: 'Statistics',
                difficulty: 'Easy',
                duration: '12 min',
                progress: 0,
                concepts: ['Bar graphs', 'Pie charts', 'Mean, median, mode', 'Probability']
            },
            {
                id: 'ratios',
                title: 'Ratios and Proportions',
                topic: 'Numbers',
                difficulty: 'Medium',
                duration: '16 min',
                progress: 0,
                concepts: ['Understanding ratios', 'Simplifying ratios', 'Proportions', 'Scale drawings']
            },
            {
                id: 'patterns',
                title: 'Geometric Patterns',
                topic: 'Algebra',
                difficulty: 'Easy',
                duration: '14 min',
                progress: 0,
                concepts: ['Finding rules', 'Input-output', 'Sequences', 'Flow diagrams']
            }
        ],
        english: [
            {
                id: 'nouns',
                title: 'What is a Noun?',
                topic: 'Parts of Speech',
                difficulty: 'Easy',
                duration: '10 min',
                progress: 0,
                concepts: ['Common nouns', 'Proper nouns', 'Abstract nouns', 'Collective nouns']
            },
            {
                id: 'verbs',
                title: 'Action Verbs',
                topic: 'Parts of Speech',
                difficulty: 'Easy',
                duration: '12 min',
                progress: 0,
                concepts: ['Action verbs', 'Irregular verbs', 'Tense', 'Subject-verb agreement']
            },
            {
                id: 'comprehension',
                title: 'Reading Comprehension',
                topic: 'Reading',
                difficulty: 'Medium',
                duration: '20 min',
                progress: 0,
                concepts: ['Main idea', 'Supporting details', 'Inference', 'Context clues']
            },
            {
                id: 'punctuation',
                title: 'Punctuation Rules',
                topic: 'Writing',
                difficulty: 'Easy',
                duration: '12 min',
                progress: 0,
                concepts: ['. (full stop)', ', (comma)', '? and !', '' and "" (quotes)']
            },
            {
                id: 'essay-writing',
                title: 'Essay Structure',
                topic: 'Writing',
                difficulty: 'Hard',
                duration: '25 min',
                progress: 0,
                concepts: ['Introduction', 'Body paragraphs', 'Conclusion', 'Transitions']
            }
        ]
    },

    // Q&A data for tutor page
    tutorQA: {
        'photosynthesis': {
            english: {
                question: 'What is photosynthesis?',
                answer: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar (glucose). Think of a leaf like a tiny chef powered by sunlight — it mixes water and air to make the tree\'s food! Just like how your gogo mixes mealie meal, water, and fire to make pap for the family, the leaf mixes sunlight, water, and air to make food for the tree!'
            },
            isizulu: {
                question: 'Yini i-photosynthesis?',
                answer: 'I-photosynthesis yinqubo lapho izitshalo zisebenzisa khanya kwelanga, amanzi, ne-carbon dioxide ukwenza umoya we-oxygen namandla ngohlobo lweshukela (i-glucose). Cabanga ngeqabunga lesihlahla njengompheki omncane wase-khaya — usebenzisa amandla elanga esikhundleni, uhlanganisa amanzi nomoya ukuze enze ukudla kwesihlahla. Njengoba ugogo wakho enza ipaphi yekhaya ngokuxova umphuphu, amanzi, nomlilo, yile nqubo nje!'
            },
            sesotho: {
                question: 'Photosynthesis ke eng?',
                answer: 'Photosynthesis ke tshebetso eo dimela di sebelisa khanya ya letsatsi, metsi le carbon dioxide ho etsa moya wa oxygen le matla ka mofuta wa tshdinamela (glucose). Nahana ka leqabunga la semela jwalo ka moapehi wa hae — o sebelisa matla a letsatsi, a kopanya metsi le moya ho etsa dijo tsa semela. Jwaloka mme wahao a etsang papa ka ho kopanya phuphu, metsi le mollo, ke mokgwa oo o tshwanang!'
            }
        },
            isizulu: {
                question: 'Yini i-photosynthesis?',
                answer: 'I-photosynthesis yinqubo lapho izitshalo zisebenzisa khona ukukhanya kwelanga, amanzi, ne-carbon dioxide ukwenza umoya we-oxygen namandla ngohlobo lweshukela (i-glucose). Cabanga ngeqabunga njengompheki omncane osebenza ngelanga — uhlanganisa amanzi nomoya ukuze enze ukudla kwesihlahla!'
            },
            sesotho: {
                question: 'Photosynthesis ke eng?',
                answer: 'Photosynthesis ke tshebetso eo dimela di e beforelletseng di sebelisa khanya ya letsatsi, metsi le carbon dioxide ho etsa moya wa oxygen le matla ka mofuta wa tshdinamela (glucose). Nahana ka leqabunga jwalo ka moapehi e monyane ya sebedisang letsatsi — o kopanya metsi le moya ho etsa dijo tsa sefate!'
            }
        },
        'fractions': {
            english: {
                question: 'What is a fraction?',
                answer: 'A fraction is a way to show parts of a whole. It has two numbers: the top number (numerator) tells how many parts you have, and the bottom number (denominator) tells how many equal parts make the whole. Imagine a pizza cut into 8 slices — if you eat 3 slices, you\'ve eaten 3/8 of the pizza! Or think of a koeksister shared between 4 friends — each gets 1/4 of the sweet treat!'
            },
            isizulu: {
                question: 'Yini ingxenyana?',
                answer: 'Ingxenyana iyindlela yokukhombisa izingxenye zento ephelele. Inezinombolo ezimbili: inombolo ephezulu (i-numerator) itshela ukuthi zingaki izingxenye onazo, kanti inombolo engezansi (i-denominator) itshela ukuthi zingaki izingxenye ezilinganayo ezenza into ephelele. Cabanga ngamakhekhe amancane (amakhekhe) ahlukanwe phakathi kwabantu aba-4 — umuntu ngamunye uthola i-1/4 yekhekhe!'
            },
            sesotho: {
                question: 'Fraction ke eng?',
                answer: 'Fraction ke tsela ya ho bontsha dikarolo tsa ntho e felletseng. E na le dinomoro tse pedi: nomoro e hodimo (numerator) e bontsha hore o na le dikarolo tse kae, mme nomoro e tlase (denominator) e bontsha hore ke dikarolo tse kae tse lekanang tse etsang ntho e felletseng. Nahana ka dipone tsa koekister tse arolelwang metsoalle e mene — e mong le e mong o hwetsa 1/4 ya koekister!'
            }
        },
        'nouns': {
            english: {
                question: 'What is a noun?',
                answer: 'A noun is a word that names a person, place, thing, or idea. Examples: "teacher" (person like your miss or master), "school" (place like your classroom), "book" (thing like your textbook), "ubuntu" (idea unique to our culture!). Nouns are like labels — they help us name everything around us so we can talk about them!'
            },
            isizulu: {
                question: 'Yini ibizo?',
                answer: 'Ibizo yigama eliqamba umuntu, indawo, into, noma umbono. Izibonelo: "uthisha" (umuntu ofana nomaster wakho), "isikole" (indawo efana neklasini yakho), "incwadi" (into efana nencwadi yesikole sakho), "ubuntu" (umbono ohlukile esikweni sakithi!). Amabizo afana nezimpawu — asisiza ukuba siqambele yonke into esizungezungezile ukuze siyakwazi ukukhuluma ngayo!'
            },
            sesotho: {
                question: 'Lebizo ke eng?',
                answer: 'Lebizo ke lentswe le re bitang motho, sebaka, ntho, kapa mohopolo. Mefuta: "mosuwe" (motho jwalo ka mosuwe wahao), "sekolo" (sebaka se jwaloka phaposing ya hao), "buka" (ntho jwalo ka bubuku ba sekolo), "ubuntu" (mohopolo o ikemetseng setsofeng sa rona!). Mabizo a tshwana le madi a thepa — a re thusa ho bitsa ntho yohle e re potileng re kgone ho bua ka yona!'
            }
        },
        'water-cycle': {
            english: {
                question: 'What is the water cycle?',
                answer: 'The water cycle is nature\'s way of recycling water. Water evaporates from oceans and lakes, forms clouds through condensation, falls as rain (precipitation), and collects back in bodies of water. It\'s like a giant circle — water never gets lost, it just changes form and keeps moving!'
            },
            isizulu: {
                question: 'Yini umjikelezo wamanzi?',
                answer: 'Umjikelezo wamanzi yindlela yemvelo yokusebenzisa amanzi kabusha. Amanzi aphuma ngokufiphala olwandle nasemachibini, akhe amafu nge-condensation, awele njengemvula (precipitation), bese eqoqana emanzini. Kufana nensikazane enkulu — amanzi awalahleki, ashintsha nje isimo asahamba!'
            },
            sesotho: {
                question: 'Motsheketso wa metsi ke eng?',
                answer: 'Motsheketso wa metsi ke tsela ya tlhaho ya ho sebelisa metsi hape. Metsi a fofa hole a tswa dilemong le matshisong, a etsa maru ka condensation, a wela pula (precipitation), mme a bokella metsing hape. O tshwana le sedikadikwe se seholo — metsi ha a hlolwe, a mpoloka feela mme a tswela pele!'
            }
        }
    },

    // Sample questions for quick access
    quickQuestions: [
        { id: 'photosynthesis', text: 'What is photosynthesis?' },
        { id: 'fractions', text: 'What is a fraction?' },
        { id: 'nouns', text: 'What is a noun?' },
        { id: 'water-cycle', text: 'What is the water cycle?' },
        { id: 'forces', text: 'What are forces?' },
        { id: 'algebra', text: 'What is algebra?' }
    ],



    // Lesson detail content
    lessonDetails: {
        'photosynthesis': {
            title: 'Photosynthesis',
            subject: 'Natural Sciences',
            grade: 7,
            summary: 'Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide.',
            keyPoints: [
                'Plants need sunlight, water, and CO₂ to perform photosynthesis',
                'Chlorophyll in leaves captures light energy',
                'Plants produce glucose (sugar) and oxygen as byproducts',
                'This process happens mainly in the leaves'
            ],
            englishExplanation: 'Photosynthesis is a chemical process where plants convert light energy from the sun into chemical energy stored in glucose. The word "photosynthesis" comes from Greek: "photo" meaning light, and "synthesis" meaning putting together. During this process, plants take in carbon dioxide through tiny holes in their leaves called stomata, absorb water through their roots, and use sunlight captured by chlorophyll to produce glucose and oxygen. The glucose feeds the plant, while oxygen is released into the atmosphere for us to breathe!',
            isizuluExplanation: 'I-photosynthesis yinqubo yamakhemikhali lapho izitshalo ziguqula khona amandla okukhanya kwelanga abe amandla amakhemikhali agcinwe ku-glucose. Igama elithi "photosynthesis" livela esiGreek: "photo" okusho ukukhanya, kanti "synthesis" okusho ukuhlanganisa. Ngesikhathi sale nqubo, izitshalo zithatha i-carbon dioxide ngezimbobo ezincane emaqabungeni azo ezibizwa ngokuthi ama-stomata, zimunce amanzi ngezimpande zazo, futhi zisebenzise ukukhanya kwelanga okubanjwe yi-chlorophyll ukuze zikhiqize i-glucose ne-oxygen. I-glucose idla leso sitshalo, kanti i-oxygen ikhishwa emkhathini ukuze sishe sishe!',
            sesothoExplanation: 'Photosynthesis ke tshebetso ya dikhemikhale moo dimela di fetolang matla a khanya ya letsatsi mme di a etsa matla a dikhemikhale a bolokilweng ho glucose. Lentswe "photosynthesis" le tswa Segerike: "photo" se bolela khanya, mme "synthesis" se bolela ho kopanya. Nakong ya tshebetso ena, dimela di nka carbon dioxide ka diheke tse nyane dikarolong tsa tsona tse bitwang stomata, di monya metsi ka dipeo tsa tsona, mme di sebelisa khanya ya letsatsi e tswawered by chlorophyll ho hlahisa glucose le oxygen. Glucose e fodisa semela seo, mme oxygen e lokollwa moya hore re e phefumele!',
            practiceQuestion: {
                question: 'What do plants need to perform photosynthesis?',
                options: ['Sunlight, water, and CO₂', 'Soil, fertilizer, and rain', 'Shade, wind, and dew', 'Nutrients, heat, and minerals'],
                correctAnswer: 0,
                explanation: 'Plants need sunlight (energy), water (from roots), and carbon dioxide (from air) to perform photosynthesis.'
            }
        },
        'fractions': {
            title: 'Understanding Fractions',
            subject: 'Mathematics',
            grade: 7,
            summary: 'Fractions represent parts of a whole number, with a numerator (top) and denominator (bottom).',
            keyPoints: [
                'A fraction shows equal parts of a whole',
                'The numerator (top) shows how many parts you have',
                'The denominator (bottom) shows total equal parts',
                'Fractions can be compared, added, and subtracted'
            ],
            englishExplanation: 'A fraction is a way to represent parts of a whole. Think of a pizza cut into 8 equal slices. If you take 3 slices, you have 3/8 of the pizza. The top number (3) is called the numerator — it tells us how many parts we have. The bottom number (8) is the denominator — it tells us the total number of equal parts. Fractions are everywhere: sharing a chocolate bar (3/4), telling time (quarter past = 1/4), or measuring ingredients for pap (1/2 cup of mealie meal)!',
            isizuluExplanation: 'Ingxenyana iyindlela yokumelela izingxenye zento ephelele. Cabanga ngepizza enqanyuliweyo izinxele ezi-8 ezilinganayo. Uma uthatha izinxele ezi-3, unazo i-3/8 yepizza. Inombolo ephezulu (3) ibizwa ngokuthi i-numerator — itshela ukuthi sinezingxenye ezingaki. Inombolo engezansi (8) iyi-denominator — itshela ukuthi yizingxenye ezingaki eziphelele ezilinganayo. Amaxenyana asendaweni yonke: ukwaba ibha yoshokoledi (3/4), ukutshela isikhathi (iquarter edlule = 1/4), noma ukalinga izithako zepap (1/2 indebe yomphuphu)!',
            sesothoExplanation: 'Fraction ke tsela ya ho emela dikarolo tsa ntho e felletseng. Nahana ka pizza e arohaneng dikoto tse 8 tse lekanang. Ha o nka dikoto tse 3, o na le 3/8 ya pizza. Nomoro e hodimo (3) e bitwa numerator — e re bolella hore re na le dikarolo tse kae. Nomoro e tlase (8) ke denominator — e re bolella hore ke dikarolo tse kae tse felletseng tse lekanang. Dikarolo di na le hohle: ho arolelana bara ya tsokolate (3/4), ho bolella nako (kotara e fetileng = 1/4), kapa ho lekanya diopea tsa papa (1/2 ya kopi ya phuphu)!',
            practiceQuestion: {
                question: 'In the fraction 3/8, what does the number 8 represent?',
                options: ['The number of parts you have', 'The total number of equal parts', 'The size of each part', 'The type of fraction'],
                correctAnswer: 1,
                explanation: 'In 3/8, the denominator (8) represents the total number of equal parts the whole is divided into.'
            }
        }
    }
};

// Helper function to get learner profile from localStorage
function getLearnerProfile() {
    const profile = localStorage.getItem('biLingoLearner');
    return profile ? JSON.parse(profile) : null;
}

// Helper function to save learner profile to localStorage
function saveLearnerProfile(profile) {
    localStorage.setItem('biLingoLearner', JSON.stringify(profile));
}

// Helper function to update study streak
function updateStudyStreak() {
    const profile = getLearnerProfile();
    if (!profile) return;
    
    const today = new Date().toDateString();
    const lastStudy = profile.lastStudyDate;
    
    if (lastStudy === today) {
        // Already studied today
        return profile.streak || 1;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastStudy === yesterdayStr) {
        // Consecutive day
        profile.streak = (profile.streak || 0) + 1;
    } else if (lastStudy !== today) {
        // Streak broken or first time
        profile.streak = 1;
    }
    
    profile.lastStudyDate = today;
    saveLearnerProfile(profile);
    return profile.streak;
}

// Helper function to get study streak
function getStudyStreak() {
    const profile = getLearnerProfile();
    return profile ? (profile.streak || 0) : 0;
}

// Helper function to get recommended next lesson
function getRecommendedLesson(subject) {
    const lessons = BiLingoData.lessons[subject] || BiLingoData.lessons['science'];
    const profile = getLearnerProfile();
    
    if (!profile || !profile.completedLessons) {
        return lessons[0]; // Return first lesson if no progress
    }
    
    // Find first lesson with less than 100% progress
    for (const lesson of lessons) {
        const progress = profile.completedLessons[lesson.id] || 0;
        if (progress < 100) {
            return lesson;
        }
    }
    
    return lessons[0]; // Default to first lesson
}

// Helper function to clear learner profile
function clearLearnerProfile() {
    localStorage.removeItem('biLingoLearner');
}

// Helper function to get confidence level text and class
function getConfidenceLevel(confidence) {
    if (confidence >= 70) return { text: 'High', class: 'high', color: '#4ade80' };
    if (confidence >= 50) return { text: 'Medium', class: 'medium', color: '#fbbf24' };
    return { text: 'Low', class: 'low', color: '#ff6b6b' };
}

// Helper function to update lesson progress
function updateLessonProgress(lessonId, progress) {
    const profile = getLearnerProfile();
    if (!profile) return;
    
    if (!profile.completedLessons) {
        profile.completedLessons = {};
    }
    
    profile.completedLessons[lessonId] = progress;
    saveLearnerProfile(profile);
}

// Helper function to get lesson progress
function getLessonProgress(lessonId) {
    const profile = getLearnerProfile();
    if (!profile || !profile.completedLessons) return 0;
    return profile.completedLessons[lessonId] || 0;
}
