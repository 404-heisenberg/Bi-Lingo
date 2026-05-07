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
        const hfResponse = await fetch('https://api-inference.huggingface.co/models/gpt2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Answer this math question clearly and concisely: ${question}\nAnswer:`,
                parameters: { max_new_tokens: 150, temperature: 0.7 }
            })
        });

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            return res.status(502).json({ error: 'Upstream API error', details: errorText });
        }

        const data = await hfResponse.json();
        const generated = data && data[0] && data[0].generated_text ? data[0].generated_text : '';
        const englishAnswer = generated.split('Answer:')[1]?.trim() || 'Unable to generate answer. Please try again.';

        return res.status(200).json({
            english: englishAnswer,
            isizulu: `[isiZulu translation of: ${englishAnswer}]`,
            sesotho: `[Sesotho translation of: ${englishAnswer}]`
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get response from AI service' });
    }
};
