import { NextResponse } from 'next/server'
import { getAgentResponse } from '../../../utils/langchainAgent'
import { getOpenAIResponse } from '../../../utils/openai'
import { supabase } from '../../../utils/supabase'

// Function to classify query type
function classifyQuery(query: string): 'cost_of_living' | 'digital_nomad' | 'general' {
  const queryLower = query.toLowerCase()

  if (queryLower.includes('cost of living') || queryLower.includes('living cost') || queryLower.includes('salary') || queryLower.includes('budget')) {
    return 'cost_of_living'
  }

  if (queryLower.includes('digital nomad') || queryLower.includes('nomad') || queryLower.includes('visa') || queryLower.includes('coworking') || queryLower.includes('wifi') || queryLower.includes('work permit') || queryLower.includes('remote work')) {
    return 'digital_nomad'
  }

  return 'general'
}

import { getSimilarCities, generateEmbedding } from '../../../utils/vector'

// Function to get vector similarity results from Supabase
async function getVectorResults(query: string, city: string) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // Get similar cities from vector database
    const similarCities = await getSimilarCities(queryEmbedding, 3)

    // Filter by the requested city or get the most relevant
    const cityData = similarCities.find(c => c.city.toLowerCase() === city.toLowerCase()) || similarCities[0]

    if (!cityData) {
      return {
        relevance: 0,
        data: {}
      }
    }

    return {
      relevance: 0.95, // Mock similarity score
      data: {
        costOfLiving: cityData.cost_of_living_data,
        digitalNomadInfo: cityData.digital_nomad_info,
        generalInfo: cityData.general_info
      }
    }
  } catch (error) {
    console.error('Error fetching vector results:', error)
    return {
      relevance: 0,
      data: {
        costOfLiving: 'Error retrieving cost of living data',
        digitalNomadInfo: 'Error retrieving digital nomad info',
        generalInfo: 'Error retrieving general information'
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const { query, city } = await request.json()

    if (!query || !city) {
      return NextResponse.json({ error: 'Query and city are required' }, { status: 400 })
    }

    const queryType = classifyQuery(query)

    let response: string | null

    if (queryType === 'cost_of_living' || queryType === 'digital_nomad') {
      // Use LangChain agent for web search
      response = await getAgentResponse(query, city)
      if (!response) {
        response = `I'm sorry, I couldn't find information about ${query} for ${city}.`
      }
    } else {
      // Use OpenAI for general queries
      const messages = [
        { role: 'system' as const, content: `You are a helpful assistant providing information about ${city} for digital nomads.` },
        { role: 'user' as const, content: query }
      ]
      response = await getOpenAIResponse(messages, 500)
      if (!response) {
        response = `I'm sorry, I couldn't generate a response for your query about ${city}.`
      }
    }

    // Get relevant data from vector database
    const vectorResults = await getVectorResults(query, city)

    return NextResponse.json({
      response,
      queryType,
      city,
      vectorData: vectorResults,
      relevance: vectorResults.relevance
    })

  } catch (error) {
    console.error('Error processing query:', error)
    return NextResponse.json({ error: 'Failed to process query' }, { status: 500 })
  }
}
