import { useState } from 'react'

const STORAGE_KEY = 'ask-ai-messages'

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

export function useAskAI(context) {
  const [messages, setMessages] = useState(loadMessages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const ask = async (question) => {
    const trimmed = question.trim()
    if (!trimmed) return

    setMessages((prev) => {
      const next = [...prev, { role: 'user', content: trimmed }]
      saveMessages(next)
      return next
    })
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: trimmed, context }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong asking the AI.')
      }

      setMessages((prev) => {
        const next = [...prev, { role: 'assistant', content: data.answer }]
        saveMessages(next)
        return next
      })
    } catch (err) {
      setError(err.message)
      setMessages((prev) => {
        const next = [...prev, { role: 'assistant', content: `⚠️ ${err.message}`, isError: true }]
        saveMessages(next)
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    saveMessages([])
  }

  return { messages, ask, loading, error, clearChat }
}
