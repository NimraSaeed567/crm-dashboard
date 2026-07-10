export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })
    return
  }

  const { question, context } = req.body || {}
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Missing "question" in request body.' })
    return
  }

  const systemPrompt = `You are the AI assistant embedded in a CRM dashboard. Answer the user's question using ONLY the JSON data provided below — do not invent numbers or customers that aren't in it. Do any counting, filtering, or math yourself by reasoning over the data. Be concise (a few sentences, or a short list) and use $ for currency. If the data doesn't contain what's needed to answer, say so plainly instead of guessing.

CRM DATA:
${JSON.stringify(context ?? {}, null, 2)}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'Anthropic API error' })
      return
    }

    const answer = data.content?.[0]?.text ?? 'No answer returned.'
    res.status(200).json({ answer })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected server error' })
  }
}
