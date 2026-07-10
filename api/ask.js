const MODELS = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-nano-9b-v2:free',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on the server.' })
    return
  }

  const { question, context } = req.body || {}
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Missing "question" in request body.' })
    return
  }

  const systemPrompt = `You are the AI assistant embedded in a CRM dashboard. Answer the user's question using ONLY the JSON data provided below — do not invent numbers or customers that aren't in it. Do any counting, filtering, or math yourself by reasoning over the data. Be concise (a few sentences, or a short list). Only prefix a number with $ when it is an actual money value (dealValue, revenue) — plain counts (number of customers, tasks, etc.) must never get a $ sign. Reply in plain text only — no markdown, no ** or * for bold/italic, no headers. If the data doesn't contain what's needed to answer, say so plainly instead of guessing.

CRM DATA:
${JSON.stringify(context ?? {}, null, 2)}`

  let lastError = 'Unknown error'

  for (const model of MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        lastError = data?.error?.message || `${model} request failed`
        continue
      }

      const answer = data.choices?.[0]?.message?.content?.trim()
      if (answer) {
        res.status(200).json({ answer, model })
        return
      }
      lastError = `${model} returned no answer`
    } catch (err) {
      lastError = err.message || `${model} request failed`
    }
  }

  res.status(502).json({ error: `All AI models are currently unavailable: ${lastError}` })
}
