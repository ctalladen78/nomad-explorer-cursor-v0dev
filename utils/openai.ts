import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getOpenAIResponse(messages: { role: 'user' | 'assistant' | 'system'; content: string }[], maxTokens: number = 100) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: maxTokens,
    })

    return completion.choices[0].message?.content
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw new Error('Failed to get a response from OpenAI')
  }
}
