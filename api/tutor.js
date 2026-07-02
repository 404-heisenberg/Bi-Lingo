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

    const { question, weakTopics, language } = req.body || {};
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    const weakContext = weakTopics && weakTopics.length > 0
        ? `The learner has struggled with these topics: ${weakTopics.join(', ')}. Adapt your explanation accordingly.`
        : '';

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    try {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const modelId = 'gpt-4o';
        console.log('[tutor] OpenAI URL:', apiUrl);
        const requestCompletion = async (systemPrompt, temperature, maxTokens) => {
            const aiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modelId,
                    temperature,
                    max_tokens: maxTokens,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: `Answer this question clearly and concisely: ${question}`
                        }
                    ]
                })
            });

            if (!aiResponse.ok) {
                const errorText = await aiResponse.text();
                return { ok: false, errorText };
            }

            const data = await aiResponse.json();
            const choices = data?.choices || [];
            return { ok: true, choices };
        };

        const learnerContext = weakContext ? `\n${weakContext}` : '';
        const primaryPrompt = 'Return ONLY a JSON object with keys english, isizulu, sesotho. No extra text. Do not include reasoning. Keep digits and numerals exactly the same as in the English answer. Use South African examples and context (e.g. ZAR currency, SA geography, history, culture, everyday life) when relevant.'
            + '\n\n'
            + 'Personality guidelines per language:'
            + '\n- english: You are Bi-Lingo Tutor, a clear and encouraging educational assistant. Use South African examples.'
            + '\n- isizulu: You are Mrs. Ndlovu, a warm, patient tutor who uses kitchen-table analogies (gogo\'s pap, taxi rank examples, local shops). Answer in isiZulu naturally, as if speaking to a learner in KwaZulu-Natal.'
            + '\n- sesotho: You are Auntie Mpho, an encouraging tutor who uses real-life connections (soccer field, market maths, village examples). Answer in Sesotho naturally, as if speaking to a learner in the Free State.'
            + learnerContext;
        const fallbackPrompt = 'Return ONLY a JSON object with keys english, isizulu, sesotho. Do not include reasoning or extra text. Output must be valid JSON. Keep digits and numerals exactly the same as in the English answer. Use South African examples and context when relevant.';

        let result = await requestCompletion(primaryPrompt, 0.4, 320);
        if (!result.ok) {
            return res.status(502).json({ error: 'Upstream API error', details: result.errorText });
        }

        let choices = result.choices;
        let content = choices[0]?.message?.content || '';
        let finishReason = choices[0]?.finish_reason || '';

        if (!content || finishReason === 'length') {
            const retry = await requestCompletion(fallbackPrompt, 0.2, 420);
            if (!retry.ok) {
                return res.status(502).json({ error: 'Upstream API error', details: retry.errorText });
            }
            choices = retry.choices;
            content = choices[0]?.message?.content || '';
            finishReason = choices[0]?.finish_reason || finishReason;
        }

        console.log('[tutor] OpenAI choices:', JSON.stringify(choices).slice(0, 2000));
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
