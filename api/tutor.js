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

    const { question } = req.body || {};
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
        return res.status(500).json({ error: 'HF_TOKEN not configured' });
    }

    try {
        const hfUrl = 'https://router.huggingface.co/v1/chat/completions';
        const modelId = 'openai/gpt-oss-20b:groq';
        console.log('[tutor] HF Router URL:', hfUrl);
        const hfResponse = await fetch(hfUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelId,
                temperature: 0.6,
                max_tokens: 260,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a bilingual math tutor. Return ONLY a JSON object with keys english, isizulu, sesotho. No extra text.'
                    },
                    {
                        role: 'user',
                        content: `Answer this math question clearly and concisely: ${question}`
                    }
                ]
            })
        });

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            return res.status(502).json({ error: 'Upstream API error', details: errorText });
        }

        const data = await hfResponse.json();
        const content = data?.choices?.[0]?.message?.content || '';
        console.log('[tutor] Raw model content:', content.slice(0, 500));
        let parsed;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (parseError) {
            parsed = null;
        }
        const englishAnswer = parsed?.english || 'Unable to generate answer. Please try again.';
        const isizuluAnswer = parsed?.isizulu || `[isiZulu translation of: ${englishAnswer}]`;
        const sesothoAnswer = parsed?.sesotho || `[Sesotho translation of: ${englishAnswer}]`;

        return res.status(200).json({
            english: englishAnswer,
            isizulu: isizuluAnswer,
            sesotho: sesothoAnswer
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get response from AI service' });
    }
};
