module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, explanation, keyPoints, numQuestions, homeLanguage, conversationContext } = req.body || {};
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const count = numQuestions || 5;
    const lang = homeLanguage || 'isiZulu';

    try {
        const contextBlock = conversationContext && conversationContext.length > 0
            ? `The student has been asking questions about this topic in ${lang}. Here are their recent questions:\n${conversationContext.join('\n')}\n\n`
            : '';

        const prompt = `Generate ${count} multiple-choice quiz questions about ${topic} that test BILINGUAL understanding.

${contextBlock}Context: A South African learner studies this topic in English at school but learns best in ${lang}.

${explanation ? 'Content: ' + explanation : ''}
${keyPoints && keyPoints.length > 0 ? 'Key points: ' + keyPoints.join(', ') : ''}

IMPORTANT — Each question must be generated in THREE languages: English, isiZulu, and Sesotho.

Return ONLY a valid JSON array. Each object must have this exact structure:
{
  "id": <number>,
  "correctAnswer": <0-indexed number of the correct option — must be the SAME across all three languages>,
  "english": {
    "question": "<English question — tests English terminology>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "explanation": "<English explanation of the correct answer>"
  },
  "isizulu": {
    "question": "<isiZulu translation of the question>",
    "options": ["<isiZulu translation of option A>", "<isiZulu translation of option B>", "<isiZulu translation of option C>", "<isiZulu translation of option D>"],
    "explanation": "<isiZulu explanation of the correct answer>"
  },
  "sesotho": {
    "question": "<Sesotho translation of the question>",
    "options": ["<Sesotho translation of option A>", "<Sesotho translation of option B>", "<Sesotho translation of option C>", "<Sesotho translation of option D>"],
    "explanation": "<Sesotho explanation of the correct answer>"
  }
}

Rules:
- English questions must test whether the student truly understands English terminology (include wrong options a second-language learner might confuse)
- isiZulu and Sesotho versions are direct translations of the same question, options, and explanation
- The correctAnswer MUST be the same 0-based index across all three languages
- Use South African examples and contexts
- Make wrong options plausible for a learner who understands the concept in their home language but confuses the English terms`;

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                temperature: 0.5,
                max_tokens: 4000,
                messages: [
                    { role: 'system', content: 'You create trilingual quiz questions for South African learners. Questions test English curriculum understanding with isiZulu and Sesotho translations.' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            return res.status(502).json({ error: 'AI API error', details: errorText });
        }

        const data = await aiResponse.json();
        const content = data?.choices?.[0]?.message?.content || '';

        let questions;
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            questions = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (parseError) {
            questions = null;
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(502).json({ error: 'Failed to generate valid questions' });
        }

        return res.status(200).json({ questions });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to generate quiz' });
    }
};
