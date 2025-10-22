
## App specification
city explorer app for digital nomads for cost of living, visa, wifi, coworking, exploring

## directory structure
app/
- api/
-- routes.ts
- city/
-- page.tsx
layout.tsx
page.tsx
- components/
-- chat.tsx
-- header.tsx
-- footer.tsx
-- hero.tsx
-- travel-recommendations.tsx
- contexts/
-- tokenlimitcontext.tsx
- utils/
-- cityData.ts
-- gemini.ts
-- langchainagent.ts
-- openai.ts

## core features
- user selects from city list for exploration
- user can ask for cost of living, digital nomad related, or general questions
- app shows relevant info about city from vector db

## implementation requirements
- nextjs, shad cn components
- langchainjs for agent orchestration, serpapi tool search
- supabase for pgvector search for similarity with custom vector
- supabase for social auth
- openai for general user city query

