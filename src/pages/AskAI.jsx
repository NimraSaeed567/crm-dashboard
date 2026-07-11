import { useState } from 'react'
import { Sparkles, Send, Bot, User, Trash2 } from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'
import { useAskAI } from '../hooks/useAskAI'

const SUGGESTIONS = [
  'How many customers are in each pipeline stage?',
  'Which customer has the highest deal value?',
  'What is my conversion rate and how is it calculated?',
  'What tasks are still pending?',
]

export default function AskAI() {
  const { loading: dataLoading, error: dataError, data } = useDashboardData()
  const { messages, ask, loading, clearChat } = useAskAI(data)
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loading) return
    ask(input)
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ask AI</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ask questions about your customers, tasks, and activities in plain English.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0"
          >
            <Trash2 size={14} />
            Clear chat
          </button>
        )}
      </div>

      {dataLoading && <div className="p-10 text-center text-sm text-gray-400">Loading data…</div>}
      {dataError && (
        <div className="p-10 text-center text-sm text-red-500">
          Failed to load data: {dataError.message}
        </div>
      )}

      {!dataLoading && !dataError && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 flex flex-col h-[65vh]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Ask anything about your CRM data</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Answers are grounded in your live customers, tasks, and activities.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : m.isError
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot size={15} />
                </div>
                <div className="rounded-2xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your customers, tasks, or activities..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 shrink-0"
            >
              <Send size={15} />
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
