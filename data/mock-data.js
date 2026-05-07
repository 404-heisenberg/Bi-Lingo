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
        { value: '1-9', label: 'Grades 1–9', phase: 'General' },
        { value: '10-12', label: 'Grades 10–12', phase: 'FET' }
    ],

    // Fixed subjects for Grades 1-9 (CAPS aligned demo)
    fixedSubjects: [
        { code: 'math', name: 'Mathematics', icon: '📐' },
        { code: 'science', name: 'Natural Sciences', icon: '🔬' },
        { code: 'social-sciences', name: 'Social Sciences', icon: '🌍' },
        { code: 'technology', name: 'Technology', icon: '🛠️' },
        { code: 'lo', name: 'Life Orientation', icon: '🧘' },
        { code: 'ems', name: 'Economic Management Sciences', icon: '💼' },
        { code: 'arts-culture', name: 'Arts and Culture', icon: '🎭' },
        { code: 'computer-literacy', name: 'Computer Literacy', icon: '💻' },
        { code: 'life-skills', name: 'Life Skills', icon: '🌱' },
        { code: 'natural-sciences-tech', name: 'Natural Sciences and Technology', icon: '⚙️' }
    ],

    // Shortened elective list for Grades 10-12 demo
    fetElectivesDemo: [
        { code: 'math', name: 'Mathematics', icon: '📐', group: 'math-choice' },
        { code: 'math-lit', name: 'Mathematical Literacy', icon: '🧮', group: 'math-choice' },
        { code: 'physical-sciences', name: 'Physical Sciences', icon: '⚛️' },
        { code: 'biology', name: 'Life Sciences', icon: '🧬' },
        { code: 'geography', name: 'Geography', icon: '🗺️' },
        { code: 'history', name: 'History', icon: '🏺' },
        { code: 'accounting', name: 'Accounting', icon: '📒' },
        { code: 'business-studies', name: 'Business Studies', icon: '📊' },
        { code: 'economics', name: 'Economics', icon: '💹' },
        { code: 'information-technology', name: 'Information Technology', icon: '💻' }
    ],

    // Subject options
    subjects: [
        { code: 'math', name: 'Mathematics', icon: '📐' },
        { code: 'math-lit', name: 'Mathematical Literacy', icon: '🧮' },
        { code: 'science', name: 'Natural Sciences', icon: '🔬' },
        { code: 'biology', name: 'Life Sciences', icon: '🧬' },
        { code: 'english', name: 'English', icon: '📖' },
        { code: 'lo', name: 'Life Orientation', icon: '🧘' },
        { code: 'ems', name: 'Economic Management Sciences', icon: '💼' },
        { code: 'physical-sciences', name: 'Physical Sciences', icon: '⚛️' },
        { code: 'geography', name: 'Geography', icon: '🗺️' },
        { code: 'history', name: 'History', icon: '🏺' },
        { code: 'accounting', name: 'Accounting', icon: '📒' },
        { code: 'business-studies', name: 'Business Studies', icon: '📊' },
        { code: 'economics', name: 'Economics', icon: '💹' },
        { code: 'information-technology', name: 'Information Technology', icon: '💻' }
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
                concepts: ['. (full stop)', ', (comma)', '? and !', "'' and \"\" (quotes)"]
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

    lessonUiText: {
        english: {
            keyPointsHeading: 'Key Points',
            practiceHeading: 'Test Your Understanding',
            practiceSubheading: 'Try this practice question to check your understanding.'
        },
        isizulu: {
            keyPointsHeading: 'Amaphuzu Abalulekile',
            practiceHeading: 'Hlola Ukuqonda Kwakho',
            practiceSubheading: 'Zama lo mbuzo wokuzijwayeza ukuze uhlole ukuqonda kwakho.'
        },
        sesotho: {
            keyPointsHeading: 'Lintlha tsa Bohlokwa',
            practiceHeading: 'Lekola Kutlwisiso Ya Hao',
            practiceSubheading: 'Leka potso ena ya boitlwaelo ho hlahloba kutlwisiso ya hao.'
        }
    },

    // Lesson detail content
    lessonDetails: {
        'idioms': {
            title: 'Understanding Idioms',
            subject: 'English',
            grade: 8,
            summary: 'Idioms are phrases that mean something different from the literal words used.',
            keyPoints: {
                english: [
                    'Idioms cannot be translated word-for-word',
                    'Context helps you understand the real meaning',
                    'Idioms often reflect culture and everyday life'
                ],
                isizulu: [
                    'Ama-idiom awakwazi ukuhunyushwa ngamagama aqondile',
                    'Ulimi oluzungezile luyasiza ukuqonda incazelo yangempela',
                    'Ama-idiom avame ukuveza isiko nokuphila kwansuku zonke'
                ],
                sesotho: [
                    'Idiom ha e fetolelwe ka mantsoe ka ho toba',
                    'Maemo a thusa ho utloisisa moelelo wa nnete',
                    'Idiom hangata e bontsha setso le bophelo ba letsatsi le letsatsi'
                ]
            },
            englishExplanation: 'An idiom is a phrase with a hidden meaning that is different from its literal words. For example, “break the ice” means to start a friendly conversation, not to crack real ice. Use the situation to understand the real meaning.',
            isizuluExplanation: 'I-idiom yisisho esinencazelo efihlekile ehlukile kulokho okushiwo amagama ayo. Isibonelo, “break the ice” kusho ukuqala ingxoxo ngobungane, hhayi ukuqhekeza iqhwa. Sebenzisa isimo ukuze uqonde umqondo wangempela.',
            sesothoExplanation: 'Idiom ke polelo e nang le moelelo o patiloeng o fapaneng le mantsoe a yona. Mohlala, “break the ice” e bolela ho qala puisano ka botsoalle, eseng ho roba leqhoa. Sebedisa maemo ho utloisisa moelelo oa nnete.',
            practiceQuestion: {
                english: {
                    question: 'Which phrase is an idiom?',
                    options: ['I drank water', 'Break the ice', 'The sun is bright', 'She wrote a letter'],
                    correctAnswer: 1,
                    explanation: '“Break the ice” has a meaning different from the literal words, which makes it an idiom.',
                    labels: {
                        check: 'Check Answer',
                        correct: '✓ Correct!',
                        incorrect: '✗ Not quite right.'
                    }
                },
                isizulu: {
                    question: 'Yisiphi isisho esiyi-idiom?',
                    options: ['Ngiphuze amanzi', 'Break the ice', 'Ilanga liyakhanya', 'Wabhala incwadi'],
                    correctAnswer: 1,
                    explanation: '“Break the ice” inencazelo ehlukile kunamagama ayo, yingakho iyisisho se-idiom.',
                    labels: {
                        check: 'Hlola Impendulo',
                        correct: '✓ Kulungile!',
                        incorrect: '✗ Akukalungi.'
                    }
                },
                sesotho: {
                    question: 'Ke polelo efe e leng idiom?',
                    options: ['Ke ile ka nwa metsi', 'Break the ice', 'Letsatsi lea khanya', 'O ile a ngola lengolo'],
                    correctAnswer: 1,
                    explanation: '“Break the ice” e na le moelelo o fapaneng le mantsoe a yona, kahoo ke idiom.',
                    labels: {
                        check: 'Lekola Karabo',
                        correct: '✓ Ho nepahetse!',
                        incorrect: '✗ Ha e a nepahala.'
                    }
                }
            },
            tutorNotes: {
                english: [
                    {
                        question: 'Why does “break the ice” mean start a conversation?',
                        answer: 'Because it compares an awkward silence to frozen ice. Starting a chat “breaks” that tension so people can talk freely.'
                    },
                    {
                        question: 'Can I translate idioms word-for-word?',
                        answer: 'Usually no. Idioms carry hidden meanings, so you need the idea, not the literal words.'
                    },
                    {
                        question: 'What is the difference between an idiom and a proverb?',
                        answer: 'Idioms are short phrases with hidden meanings. Proverbs are full sayings that give advice or wisdom.'
                    }
                ],
                isizulu: [
                    {
                        question: 'Kungani “break the ice” kusho ukuqala ingxoxo?',
                        answer: 'Kufanisa ukuthula okuxakayo neqhwa eliqinile. Ukuqala ukuxoxa “kuqhekeza” lowo mzwelo ukuze abantu bakhulume kahle.'
                    },
                    {
                        question: 'Ngingawuhumusha ama-idiom ngamagama aqondile?',
                        answer: 'Kuvamile ukuthi cha. Ama-idiom anencazelo efihlekile, ngakho udinga umqondo, hhayi amagama kuphela.'
                    },
                    {
                        question: 'Uyini umehluko phakathi kwe-idiom nesaga?',
                        answer: 'I-idiom yisisho esifushane esinencazelo efihlekile. Isaga siwumusho ophelele onezifundo noma iseluleko.'
                    }
                ],
                sesotho: [
                    {
                        question: 'Hobaneng “break the ice” e bolela ho qala puisano?',
                        answer: 'E bapisa khutso e makatsang le leqhoa. Ho qala ho bua “ho roba” kgatello eo.'
                    },
                    {
                        question: 'Na nka fetolela idiom ka mantsoe ka ho toba?',
                        answer: 'Hangata tjhe. Idiom e na le moelelo o patiloeng, kahoo o hloka mohopolo, eseng mantsoe feela.'
                    },
                    {
                        question: 'Phapang ke efe pakeng tsa idiom le proverb?',
                        answer: 'Idiom ke polelo e khutšoanyane e nang le moelelo o patiloeng. Proverb ke polelo e felletseng e fanang ka bohlale kapa keletso.'
                    }
                ]
            }
        },
        'math-foundations': {
            title: 'Math Foundations',
            subject: 'Mathematics',
            grade: 10,
            summary: 'Explore high-level concepts like Pythagorean theorem, probability, and quadratic equations.',
            keyPoints: {
                english: [
                    'Pythagorean theorem connects sides of a right triangle',
                    'Probability measures how likely something is to happen',
                    'Quadratic equations are written in the form ax² + bx + c = 0'
                ],
                isizulu: [
                    'I-Pythagorean theorem ixhumanisa izinhlangothi ze-triangle enesiqu esingu-90°',
                    'I-probability ikala ukuthi into ingenzeka kangakanani',
                    'Ama-quadratic equations abhalwa ngendlela ethi ax² + bx + c = 0'
                ],
                sesotho: [
                    'Pythagorean theorem e hokahanya mahlakore a triangle ya 90°',
                    'Probability e lekanya monyetla wa ho etsahala ha ntho',
                    'Quadratic equations di ngolwa ka sebopeho sa ax² + bx + c = 0'
                ]
            },
            englishExplanation: 'This lesson introduces three big ideas you will keep using: the Pythagorean theorem, probability, and quadratic equations. Use the tutor to break down each one and see examples that connect to daily life.',
            isizuluExplanation: 'Lesi sifundo sikulethela imibono emithathu ebalulekile: i-Pythagorean theorem, amathuba (probability), kanye nama-quadratic equations. Sebenzisa uthisha ukuze akuqondise ngezibonelo eziseduze nempilo yakho.',
            sesothoExplanation: 'Thuto ena e hlahisa mehopolo e meraro e meholo: Pythagorean theorem, probability le quadratic equations. Sebedisa tutor ho hlalosa ka mehato le mehlala e tswang bophelong ba letsatsi le letsatsi.',
            practiceQuestion: {
                english: {
                    question: 'Which formula represents a quadratic equation?',
                    options: ['a + b = c', 'ax² + bx + c = 0', 'P = 2l + 2w', 'V = IR'],
                    correctAnswer: 1,
                    explanation: 'Quadratic equations are written in the form ax² + bx + c = 0.',
                    labels: {
                        check: 'Check Answer',
                        correct: '✓ Correct!',
                        incorrect: '✗ Not quite right.'
                    }
                },
                isizulu: {
                    question: 'Yiliphi ifomula emele i-quadratic equation?',
                    options: ['a + b = c', 'ax² + bx + c = 0', 'P = 2l + 2w', 'V = IR'],
                    correctAnswer: 1,
                    explanation: 'Ama-quadratic equations abhalwa ngendlela ethi ax² + bx + c = 0.',
                    labels: {
                        check: 'Hlola Impendulo',
                        correct: '✓ Kulungile!',
                        incorrect: '✗ Akukalungi.'
                    }
                },
                sesotho: {
                    question: 'Ke foromo efe e emelang quadratic equation?',
                    options: ['a + b = c', 'ax² + bx + c = 0', 'P = 2l + 2w', 'V = IR'],
                    correctAnswer: 1,
                    explanation: 'Quadratic equations di ngolwa ka sebopeho sa ax² + bx + c = 0.',
                    labels: {
                        check: 'Lekola Karabo',
                        correct: '✓ Ho nepahetse!',
                        incorrect: '✗ Ha e a nepahala.'
                    }
                }
            }
        },
        'photosynthesis': {
            title: 'Photosynthesis',
            subject: 'Natural Sciences',
            grade: 7,
            summary: 'Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide.',
            keyPoints: {
                english: [
                    'Plants need sunlight, water, and CO₂ to perform photosynthesis',
                    'Chlorophyll in leaves captures light energy',
                    'Plants produce glucose (sugar) and oxygen as byproducts',
                    'This process happens mainly in the leaves'
                ],
                isizulu: [
                    'Izitshalo zidinga ukukhanya kwelanga, amanzi, ne-CO₂ ukuze ziqhube i-photosynthesis',
                    'I-chlorophyll emaqabungeni ibamba amandla okukhanya',
                    'Izitshalo zikhiqiza i-glucose (ushukela) ne-oxygen njengomkhiqizo ohlangene',
                    'Lena yenzeka kakhulu emaqabungeni'
                ],
                sesotho: [
                    'Dimela di hloka khanya ya letsatsi, metsi le CO₂ ho etsa photosynthesis',
                    'Chlorophyll makhasing e tshwara matla a khanya',
                    'Dimela di hlahisa glucose (tswekere) le oxygen e le dihlahisoa',
                    'Tshebetso ena e etsahala haholo makhasing'
                ]
            },
            englishExplanation: 'Photosynthesis is a chemical process where plants convert light energy from the sun into chemical energy stored in glucose. The word "photosynthesis" comes from Greek: "photo" meaning light, and "synthesis" meaning putting together. During this process, plants take in carbon dioxide through tiny holes in their leaves called stomata, absorb water through their roots, and use sunlight captured by chlorophyll to produce glucose and oxygen. The glucose feeds the plant, while oxygen is released into the atmosphere for us to breathe!',
            isizuluExplanation: 'I-photosynthesis yinqubo yamakhemikhali lapho izitshalo ziguqula khona amandla okukhanya kwelanga abe amandla amakhemikhali agcinwe ku-glucose. Igama elithi "photosynthesis" livela esiGreek: "photo" okusho ukukhanya, kanti "synthesis" okusho ukuhlanganisa. Ngesikhathi sale nqubo, izitshalo zithatha i-carbon dioxide ngezimbobo ezincane emaqabungeni azo ezibizwa ngokuthi ama-stomata, zimunce amanzi ngezimpande zazo, futhi zisebenzise ukukhanya kwelanga okubanjwe yi-chlorophyll ukuze zikhiqize i-glucose ne-oxygen. I-glucose idla leso sitshalo, kanti i-oxygen ikhishwa emkhathini ukuze sishe sishe!',
            sesothoExplanation: 'Photosynthesis ke tshebetso ya dikhemikhale moo dimela di fetolang matla a khanya ya letsatsi mme di a etsa matla a dikhemikhale a bolokilweng ho glucose. Lentswe "photosynthesis" le tswa Segerike: "photo" se bolela khanya, mme "synthesis" se bolela ho kopanya. Nakong ya tshebetso ena, dimela di nka carbon dioxide ka diheke tse nyane dikarolong tsa tsona tse bitwang stomata, di monya metsi ka dipeo tsa tsona, mme di sebelisa khanya ya letsatsi e tswawered by chlorophyll ho hlahisa glucose le oxygen. Glucose e fodisa semela seo, mme oxygen e lokollwa moya hore re e phefumele!',
            practiceQuestion: {
                english: {
                    question: 'What do plants need to perform photosynthesis?',
                    options: ['Sunlight, water, and CO₂', 'Soil, fertilizer, and rain', 'Shade, wind, and dew', 'Nutrients, heat, and minerals'],
                    correctAnswer: 0,
                    explanation: 'Plants need sunlight (energy), water (from roots), and carbon dioxide (from air) to perform photosynthesis.',
                    labels: {
                        check: 'Check Answer',
                        correct: '✓ Correct!',
                        incorrect: '✗ Not quite right.'
                    }
                },
                isizulu: {
                    question: 'Yini izitshalo ezidingayo ukuze ziqhube i-photosynthesis?',
                    options: ['Ukukhanya kwelanga, amanzi, ne-CO₂', 'Umhlabathi, umanyolo, nemvula', 'Umthunzi, umoya, nomhwamuko', 'Izithako zokudla, ukushisa, namaminerali'],
                    correctAnswer: 0,
                    explanation: 'Izitshalo zidinga ukukhanya kwelanga (amandla), amanzi (ezimpandeni), ne-carbon dioxide (emoyeni) ukuze ziqhube i-photosynthesis.',
                    labels: {
                        check: 'Hlola Impendulo',
                        correct: '✓ Kulungile!',
                        incorrect: '✗ Akukalungi.'
                    }
                },
                sesotho: {
                    question: 'Dimela di hloka eng ho etsa photosynthesis?',
                    options: ['Khanya ya letsatsi, metsi le CO₂', 'Mobu, manyolo le pula', 'Moriti, moya le phoka', 'Diminerale, mocheso le phepo'],
                    correctAnswer: 0,
                    explanation: 'Dimela di hloka khanya ya letsatsi (matla), metsi (metso), le carbon dioxide (moya) ho etsa photosynthesis.',
                    labels: {
                        check: 'Lekola Karabo',
                        correct: '✓ Ho nepahetse!',
                        incorrect: '✗ Ha e a nepahala.'
                    }
                }
            }
        },
        'fractions': {
            title: 'Understanding Fractions',
            subject: 'Mathematics',
            grade: 7,
            summary: 'Fractions represent parts of a whole number, with a numerator (top) and denominator (bottom).',
            keyPoints: {
                english: [
                    'A fraction shows equal parts of a whole',
                    'The numerator (top) shows how many parts you have',
                    'The denominator (bottom) shows total equal parts',
                    'Fractions can be compared, added, and subtracted'
                ],
                isizulu: [
                    'Ingxenyana ikhombisa izingxenye ezilinganayo zento ephelele',
                    'I-numerator (phezulu) ikhombisa ukuthi zingaki izingxenye onazo',
                    'I-denominator (phansi) ikhombisa inani eliphelele lezingxenye ezilinganayo',
                    'Amaxenyana angaqhathaniswa, anezwe, noma asuswe'
                ],
                sesotho: [
                    'Fraction e bontsha dikarolo tse lekanang tsa ntho e felletseng',
                    'Numerator (hodimo) e bontsha hore o na le dikarolo tse kae',
                    'Denominator (tlase) e bontsha palo yohle ya dikarolo tse lekanang',
                    'Dikarolo di ka bapiswa, tsa eketswa, kapa tsa tloswa'
                ]
            },
            englishExplanation: 'A fraction is a way to represent parts of a whole. Think of a pizza cut into 8 equal slices. If you take 3 slices, you have 3/8 of the pizza. The top number (3) is called the numerator — it tells us how many parts we have. The bottom number (8) is the denominator — it tells us the total number of equal parts. Fractions are everywhere: sharing a chocolate bar (3/4), telling time (quarter past = 1/4), or measuring ingredients for pap (1/2 cup of mealie meal)!',
            isizuluExplanation: 'Ingxenyana iyindlela yokumelela izingxenye zento ephelele. Cabanga ngepizza enqanyuliweyo izinxele ezi-8 ezilinganayo. Uma uthatha izinxele ezi-3, unazo i-3/8 yepizza. Inombolo ephezulu (3) ibizwa ngokuthi i-numerator — itshela ukuthi sinezingxenye ezingaki. Inombolo engezansi (8) iyi-denominator — itshela ukuthi yizingxenye ezingaki eziphelele ezilinganayo. Amaxenyana asendaweni yonke: ukwaba ibha yoshokoledi (3/4), ukutshela isikhathi (iquarter edlule = 1/4), noma ukalinga izithako zepap (1/2 indebe yomphuphu)!',
            sesothoExplanation: 'Fraction ke tsela ya ho emela dikarolo tsa ntho e felletseng. Nahana ka pizza e arohaneng dikoto tse 8 tse lekanang. Ha o nka dikoto tse 3, o na le 3/8 ya pizza. Nomoro e hodimo (3) e bitwa numerator — e re bolella hore re na le dikarolo tse kae. Nomoro e tlase (8) ke denominator — e re bolella hore ke dikarolo tse kae tse felletseng tse lekanang. Dikarolo di na le hohle: ho arolelana bara ya tsokolate (3/4), ho bolella nako (kotara e fetileng = 1/4), kapa ho lekanya diopea tsa papa (1/2 ya kopi ya phuphu)!',
            practiceQuestion: {
                english: {
                    question: 'In the fraction 3/8, what does the number 8 represent?',
                    options: ['The number of parts you have', 'The total number of equal parts', 'The size of each part', 'The type of fraction'],
                    correctAnswer: 1,
                    explanation: 'In 3/8, the denominator (8) represents the total number of equal parts the whole is divided into.',
                    labels: {
                        check: 'Check Answer',
                        correct: '✓ Correct!',
                        incorrect: '✗ Not quite right.'
                    }
                },
                isizulu: {
                    question: 'Kufraction 3/8, inombolo 8 imele ini?',
                    options: ['Inani lezingxenye onazo', 'Inani eliphelele lezingxenye ezilinganayo', 'Usayizi wengxenye ngayinye', 'Uhlobo lwengxenyana'],
                    correctAnswer: 1,
                    explanation: 'Kufraction 3/8, i-denominator (8) imele inani eliphelele lezingxenye ezilinganayo into ephelele ehlukaniswe ngazo.',
                    labels: {
                        check: 'Hlola Impendulo',
                        correct: '✓ Kulungile!',
                        incorrect: '✗ Akukalungi.'
                    }
                },
                sesotho: {
                    question: 'Fraction 3/8, nomoro 8 e emela eng?',
                    options: ['Palo ya dikarolo tseo o nang le tsona', 'Palo yohle ya dikarolo tse lekanang', 'Boholo ba karolo ka nngwe', 'Mofuta wa fraction'],
                    correctAnswer: 1,
                    explanation: 'Ho 3/8, denominator (8) e emela palo yohle ya dikarolo tse lekanang tseo ntho e felletseng e arolwang ka tsona.',
                    labels: {
                        check: 'Lekola Karabo',
                        correct: '✓ Ho nepahetse!',
                        incorrect: '✗ Ha e a nepahala.'
                    }
                }
            }
        }
    }
    ,mathTutorQuickQuestions: [
        {
            id: 'pythag',
            text: 'What is the Pythagorean theorem?',
            responses: {
                english: 'The Pythagorean theorem says a² + b² = c² for a right triangle. If two sides are 3 and 4, the longest side is 5. Think of measuring the diagonal of a soccer field corner.',
                isizulu: 'I-Pythagorean theorem ithi a² + b² = c² kwitriangle enesiqu esingu-90°. Uma izinhlangothi zingu-3 no-4, uhlangothi olude lungu-5. Cabanga ulinganisa idayagonali enkundleni yebhola.',
                sesotho: 'Pythagorean theorem e re a² + b² = c² ho triangle ya 90°. Ha mahlakore e le 3 le 4, le lelelele ke 5. Nahana ka ho metha diagonal sekhutlong sa lebala la bolo.'
            }
        },
        {
            id: 'probability',
            text: 'What is probability?',
            responses: {
                english: 'Probability measures how likely something is to happen, from 0 to 1. For example, the chance of rain today might be 0.3. It’s like guessing how likely taxis will be full at 7am.',
                isizulu: 'I-probability ikala ukuthi into ingenzeka kangakanani, ukusuka ku-0 kuye ku-1. Isibonelo, amathuba emvula angaba ngu-0.3. Kufana nokubikezela ukuthi ama-taxi azogcwala kangakanani ngo-7am.',
                sesotho: 'Probability e lekanya monyetla wa ho etsahala ha ntho, ho tloha ho 0 ho isa ho 1. Mohlala, monyetla wa pula e ka ba 0.3. Ho tshwana le ho hakanya hore taxi di tla tlala hakang ka 7am.'
            }
        },
        {
            id: 'quadratic',
            text: 'What is a quadratic equation?',
            responses: {
                english: 'A quadratic equation has the form ax² + bx + c = 0. It creates a U-shaped graph called a parabola. You see it when modelling height, like a ball kicked into the air.',
                isizulu: 'I-quadratic equation inefomu ethi ax² + bx + c = 0. Yakha igrafu efana no-U ebizwa nge-parabola. Uyabona lapho ulingisa ukuphakama, njengokukhahlela ibhola emoyeni.',
                sesotho: 'Quadratic equation e na le sebopeho sa ax² + bx + c = 0. E etsa graph e bōpehileng joaloka U, e bitsoang parabola. E hlaha ha o bapisa bophahamo, jwalo ka bolo e fofa.'
            }
        }
    ]
    ,mathTutorGenericResponse: {
        english: "That's an interesting question! In the full version of Bi-Lingo, I'll provide detailed explanations in your home language with culturally relevant examples. Try one of the quick questions to see the multilingual experience!",
        isizulu: 'Leyo yimibuzo emnandi! Enguqulweni ephelele ye-Bi-Lingo, ngizokunikeza izincazelo ezinemininingwane ngolimi lwakho lwasekhaya ngezibonelo eziseduze nempilo yakho. Zama omunye wemibuzo esheshayo ukuze ubone i-demo yezilimi.',
        sesotho: 'Ke potso e kgahlisang! Mofuteng o felletseng wa Bi-Lingo, ke tla fana ka tlhaloso e qaqileng ka puo ya hao ya lapeng le mehlala e haufi le bophelo. Leka e nngwe ya dipotso tse potlakileng ho bona demo ya dipuo.'
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
