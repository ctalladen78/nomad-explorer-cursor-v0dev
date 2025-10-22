import { ChatOpenAI } from '@langchain/openai';
import { SerpAPI } from '@langchain/community/tools/serpapi';
import { initializeAgentExecutorWithOptions, type AgentExecutor } from 'langchain/agents';
import { BufferMemory } from 'langchain/memory';

// Check for API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

let executor: AgentExecutor | null = null;

async function getAgentExecutor(): Promise<AgentExecutor> {
  if (executor) return executor;

  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  if (!SERPAPI_API_KEY) {
    throw new Error('SERPAPI_API_KEY is not set');
  }

  const model = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });

  const tools = [new SerpAPI(SERPAPI_API_KEY)];

  executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'chat-conversational-react-description',
    memory: new BufferMemory({
      memoryKey: 'chat_history',
      returnMessages: true,
    }),
    verbose: true,
  });

  return executor;
}

export async function getAgentResponse(query: string, city: string): Promise<string | null> {
  try {
    const executor = await getAgentExecutor();

    const result = await executor.call({
      input: `Find information related to ${city}. Query: ${query}`,
    });

    return result.output || null;
  } catch (error) {
    console.error('Error calling LangChain agent:', error);
    return null;
  }
}
