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
    const lang = homeLanguage || 'their home language';

    try {
        const contextBlock = conversationContext && conversationContext.length > 0
            ? `The student has been asking questions about this topic in ${lang}. Here are their recent questions:\n${conversationContext.join('\n')}\n\n`
            : '';

        const prompt = `Generate ${count} multiple-choice quiz questions that test BILINGUAL understanding.

${contextBlock}Context: A South African learner studies this topic in English at school but learns best in ${lang}. 
Topic: ${topic}
${explanation ? 'Content: ' + explanation : ''}
${keyPoints && keyPoints.length > 0 ? 'Key points: ' + keyPoints.join(', ') : ''}

IMPORTANT — Each question must:
1. Be written in English (like a real South African school test)
2. Test whether the student truly understood the English terminology, not just the concept in ${lang}
3. Include at least 2 wrong options that a second-language English learner might confuse (common translation errors, similar-sounding English terms, or concepts that are easily mixed up when learning in English)
4. After each question, provide an explanation that shows the bilingual bridge — explain the answer in English, then add a ${lang} translation of the key insight

Return ONLY a valid JSON array. Each object must have this structure:
{
  "id": <number>,
  "question": "<English question>",
  "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
  "correctAnswer": <0-indexed number>,
  "explanation": "<English explanation of the answer>",
  "homeLanguageExplanation": "<short ${lang} translation of the explanation to reinforce understanding>"
}

Use South African curriculum examples and contexts. Make wrong options plausible for a learner who understands the concept in ${lang} but confuses the English terms.`;

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                temperature: 0.5,
                max_tokens: 2500,
                messages: [
                    { role: 'system', content: 'You create bilingual-aware quiz questions for South African learners. Questions test whether students understand English curriculum content, not just the concept in their home language.' },
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
