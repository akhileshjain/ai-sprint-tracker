export const SPRINTS = [
  {
    id: 's1', num: 1, title: 'Foundations & First Agent',
    goal: 'Set up environment, understand LLMs, ship first working agent to GitHub',
    weeks: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    color: '#f97316', accent: 'rgba(249,115,22,0.12)',
    stories: [
      { id: 's1-1', week: 1, type: 'SETUP', points: 3, title: 'Dev environment ready', desc: 'Install Python 3.11+, VS Code, Git, UV/Poetry. Get OpenAI + Anthropic API keys. Run first hello-world API call.', links: [{ label: 'Udemy Course', url: 'https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/' }] },
      { id: 's1-2', week: 1, type: 'COURSE', points: 2, title: 'Complete Prompt Engineering for Devs', desc: 'DeepLearning.AI free short course (~2 hrs). Understand tokens, context windows, system prompts, temperature.', links: [{ label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' }] },
      { id: 's1-3', week: 2, type: 'COURSE', points: 3, title: 'Udemy Days 1-4: LLM fundamentals + tool use', desc: 'Complete first 4 days of Udemy course. Function calling, tool use, the ReAct agent loop.', links: [{ label: 'Course Repo (GitHub)', url: 'https://github.com/ed-donner/agents' }] },
      { id: 's1-4', week: 2, type: 'COURSE', points: 2, title: 'LangChain for LLM App Dev (free)', desc: 'DeepLearning.AI short course ~2 hrs. Chains, memory, basic agents.', links: [{ label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/' }] },
      { id: 's1-5', week: 3, type: 'COURSE', points: 3, title: 'Udemy Days 5-6: OpenAI Agents SDK', desc: 'Agents SDK deep dive - handoffs, guardrails, Project 1 (Career Digital Twin). Push all lab code to GitHub.', links: [{ label: 'OpenAI Tool Use Docs', url: 'https://platform.openai.com/docs/guides/function-calling' }] },
      { id: 's1-6', week: 3, type: 'TASK', points: 1, title: 'Read MCP introduction (conceptual)', desc: 'Understand what the Model Context Protocol is at a conceptual level. No code yet.', links: [{ label: 'Anthropic MCP', url: 'https://modelcontextprotocol.io/introduction' }] },
      { id: 's1-7', week: 4, type: 'PROJECT', points: 5, title: 'Ship: Research Assistant Agent', desc: 'Build your own agent that takes a topic, searches the web with a tool, summarises results, and returns a structured report. Push to GitHub with README.', links: [{ label: 'Anthropic Tool Use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview' }] },
      { id: 's1-8', week: 4, type: 'TASK', points: 1, title: 'Post Week 1 LinkedIn update', desc: 'Share what you built/learned. Even rough is fine. One sentence + a screenshot.', links: [] },
    ],
  },
  {
    id: 's2', num: 2, title: 'LangGraph, RAG & Memory',
    goal: 'Build stateful agents, master RAG pipelines, ship the most employable project of the plan',
    weeks: ['Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'],
    color: '#22c55e', accent: 'rgba(34,197,94,0.12)',
    stories: [
      { id: 's2-1', week: 5, type: 'COURSE', points: 3, title: 'LangChain Academy: Intro to LangGraph Mods 1-2', desc: 'Nodes, edges, state machines. Official free course from LangChain.', links: [{ label: 'LangChain Academy', url: 'https://academy.langchain.com/courses/intro-to-langgraph' }] },
      { id: 's2-2', week: 5, type: 'COURSE', points: 2, title: 'DeepLearning.AI: AI Agents in LangGraph', desc: 'Free ~2 hrs. Build an agent from scratch then rebuild in LangGraph.', links: [{ label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/' }] },
      { id: 's2-3', week: 6, type: 'COURSE', points: 3, title: 'DeepLearning.AI: LangChain Chat with Your Data', desc: 'Complete RAG pipeline - loading, splitting, embedding, storage, retrieval.', links: [{ label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/' }] },
      { id: 's2-4', week: 6, type: 'SETUP', points: 2, title: 'Set up ChromaDB + Pinecone accounts', desc: 'ChromaDB locally, Pinecone free tier in cloud. Ingest 3 test PDFs, run similarity queries.', links: [{ label: 'ChromaDB Docs', url: 'https://www.trychroma.com/' }] },
      { id: 's2-5', week: 7, type: 'COURSE', points: 2, title: 'LangChain Academy: LangGraph Mods 3-4', desc: 'Memory, checkpointing, human-in-the-loop patterns.', links: [{ label: 'LangChain Academy', url: 'https://academy.langchain.com/' }] },
      { id: 's2-6', week: 7, type: 'PROJECT', points: 4, title: 'Build RAG Q&A system (in progress)', desc: 'Start the Document Q&A system - PDF ingestion, ChromaDB, LangGraph agent, source citations.', links: [{ label: 'Streamlit Docs', url: 'https://docs.streamlit.io/get-started' }] },
      { id: 's2-7', week: 8, type: 'PROJECT', points: 5, title: 'Ship: RAG Document Q&A App', desc: 'Complete, polish, and deploy the RAG Q&A app. Architecture diagram. README. Push to GitHub.', links: [{ label: 'Excalidraw', url: 'https://excalidraw.com/' }] },
      { id: 's2-8', week: 8, type: 'CERT', points: 2, title: 'Enroll IBM Coursera - start Module 1', desc: 'Subscribe to Coursera ($49/mo). Enroll in IBM RAG and Agentic AI Professional Certificate.', links: [{ label: 'IBM Coursera Cert', url: 'https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai' }] },
    ],
  },
  {
    id: 's3', num: 3, title: 'Multi-Agent Systems & CrewAI',
    goal: 'Master agent collaboration, CrewAI orchestration, and MCP',
    weeks: ['Wk 9', 'Wk 10', 'Wk 11', 'Wk 12'],
    color: '#3b82f6', accent: 'rgba(59,130,246,0.12)',
    stories: [
      { id: 's3-1', week: 9, type: 'COURSE', points: 3, title: 'Udemy: CrewAI weeks (Projects 4 & 5)', desc: 'Agents, tasks, crews, custom tools, multi-agent coordination patterns.', links: [{ label: 'CrewAI Docs', url: 'https://docs.crewai.com/introduction' }] },
      { id: 's3-2', week: 9, type: 'COURSE', points: 2, title: 'DeepLearning.AI: Multi AI Agent Systems with crewAI', desc: 'Official Andrew Ng course. Free ~2 hrs.', links: [{ label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/' }] },
      { id: 's3-3', week: 10, type: 'COURSE', points: 3, title: 'Udemy: AutoGen week (Project 7)', desc: 'Agent creator, self-replicating systems, conversation patterns.', links: [{ label: 'DeepLearning.AI AutoGen', url: 'https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/' }] },
      { id: 's3-4', week: 10, type: 'CERT', points: 2, title: 'IBM Coursera: Module 3 - Multi-Agent RAG', desc: 'Multi-agent RAG systems with LangGraph.', links: [{ label: 'IBM Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai' }] },
      { id: 's3-5', week: 11, type: 'COURSE', points: 3, title: 'Udemy: MCP week - Trading Floor Project (8)', desc: 'Build the capstone Trading Floor with 6 MCP servers.', links: [{ label: 'Anthropic MCP Quickstart', url: 'https://modelcontextprotocol.io/quickstart' }] },
      { id: 's3-6', week: 11, type: 'TASK', points: 2, title: 'Integrate MCP into your own agent', desc: 'Connect your existing agent to at least one external MCP tool server.', links: [{ label: 'MCP Specification', url: 'https://modelcontextprotocol.io/specification' }] },
      { id: 's3-7', week: 12, type: 'PROJECT', points: 5, title: 'Ship: Multi-Agent Research Crew', desc: '3-agent CrewAI system - Researcher, Writer, Editor - with MCP tool integration.', links: [] },
      { id: 's3-8', week: 12, type: 'CERT', points: 2, title: 'Udemy course: 100% complete', desc: 'Review all 8 projects and your notes.', links: [] },
    ],
  },
  {
    id: 's4', num: 4, title: 'Cloud Deployment & MLOps',
    goal: 'Take agents from laptop to production - Docker, FastAPI, AWS Bedrock, CI/CD',
    weeks: ['Wk 13', 'Wk 14', 'Wk 15', 'Wk 16'],
    color: '#ef4444', accent: 'rgba(239,68,68,0.12)',
    stories: [
      { id: 's4-1', week: 13, type: 'COURSE', points: 3, title: 'FastAPI: official tutorial (full)', desc: 'Routes, Pydantic models, async endpoints, dependency injection.', links: [{ label: 'FastAPI Tutorial', url: 'https://fastapi.tiangolo.com/tutorial/' }] },
      { id: 's4-2', week: 13, type: 'TASK', points: 3, title: 'Wrap RAG agent in FastAPI REST API', desc: 'Add health checks, request validation, error handling.', links: [] },
      { id: 's4-3', week: 14, type: 'COURSE', points: 3, title: 'Docker crash course (4 hrs)', desc: 'Images, containers, Dockerfile, docker-compose.', links: [{ label: 'Docker Get Started', url: 'https://docs.docker.com/get-started/' }] },
      { id: 's4-4', week: 14, type: 'TASK', points: 4, title: 'Containerise FastAPI + LangGraph app', desc: 'Dockerfile + docker-compose with ChromaDB volume.', links: [] },
      { id: 's4-5', week: 15, type: 'COURSE', points: 3, title: 'AWS Skill Builder: Amazon Bedrock Getting Started', desc: 'Free ~3 hrs. Learn Bedrock Agents, Knowledge Bases, model access.', links: [{ label: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/17508/amazon-bedrock-getting-started' }] },
      { id: 's4-6', week: 15, type: 'SETUP', points: 2, title: 'Set up LangSmith + AWS free-tier', desc: 'LangSmith free account - connect tracing. AWS account - enable Bedrock access.', links: [{ label: 'LangSmith', url: 'https://smith.langchain.com/' }] },
      { id: 's4-7', week: 16, type: 'PROJECT', points: 5, title: 'Ship: Live AI Microservice on AWS', desc: 'Deploy containerised app to AWS ECS Fargate or App Runner. GitHub Actions CI/CD.', links: [{ label: 'GitHub Actions to AWS', url: 'https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-to-amazon-elastic-container-service' }] },
      { id: 's4-8', week: 16, type: 'TASK', points: 1, title: 'Post live URL on LinkedIn', desc: 'Share the live endpoint with a brief write-up.', links: [] },
    ],
  },
  {
    id: 's5', num: 5, title: 'Certification Sprint & Security',
    goal: 'Earn IBM certificate, master AI security patterns, launch public portfolio',
    weeks: ['Wk 17', 'Wk 18', 'Wk 19', 'Wk 20'],
    color: '#a855f7', accent: 'rgba(168,85,247,0.12)',
    stories: [
      { id: 's5-1', week: 17, type: 'CERT', points: 3, title: 'IBM Coursera: Module 6 - Multimodal + Advanced RAG', desc: 'Multimodal AI integration, advanced RAG patterns, production considerations.', links: [{ label: 'IBM Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai' }] },
      { id: 's5-2', week: 17, type: 'COURSE', points: 2, title: 'DeepLearning.AI: Red Teaming LLM Applications', desc: 'Free ~1.5 hrs. Prompt injection, jailbreaks, data poisoning.', links: [{ label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/red-teaming-llm-applications/' }] },
      { id: 's5-3', week: 18, type: 'CERT', points: 5, title: 'IBM Coursera: Final Capstone Project', desc: 'Graded capstone. This submission earns the certificate.', links: [] },
      { id: 's5-4', week: 18, type: 'TASK', points: 2, title: 'Study Guardrails AI + NeMo Guardrails', desc: 'Input/output filtering, validator patterns, safety pipelines for production.', links: [{ label: 'Guardrails AI Docs', url: 'https://www.guardrailsai.com/docs/' }] },
      { id: 's5-5', week: 19, type: 'PROJECT', points: 5, title: 'Ship: Secure AI Gateway', desc: 'FastAPI gateway with prompt injection detection, PII scrubbing, rate limiting, audit logging.', links: [] },
      { id: 's5-6', week: 19, type: 'TASK', points: 2, title: 'Build portfolio website', desc: 'GitHub Pages or Vercel. List all 5 projects with links, tech stack, demo videos.', links: [{ label: 'GitHub Pages', url: 'https://pages.github.com/' }] },
      { id: 's5-7', week: 20, type: 'CERT', points: 5, title: 'IBM Certificate: Complete + add to LinkedIn', desc: 'Finish final assessment. Add certificate to LinkedIn profile.', links: [] },
      { id: 's5-8', week: 20, type: 'TASK', points: 2, title: 'Publish blog post #1', desc: '5 things I learned building AI agents from scratch. Publish on Medium or dev.to.', links: [{ label: 'Medium', url: 'https://medium.com/new-story' }] },
    ],
  },
  {
    id: 's6', num: 6, title: 'Capstone & Portfolio',
    goal: 'Ship showpiece project and build a strong public portfolio of AI engineering work',
    weeks: ['Wk 21-22', 'Wk 23-24', 'Wk 25', 'Wk 26'],
    color: '#06b6d4', accent: 'rgba(6,182,212,0.12)',
    stories: [
      { id: 's6-1', week: 21, type: 'TASK', points: 3, title: 'Capstone domain selection + architecture spec', desc: 'Choose domain (finance, legal, HR, dev tools). Write 1-page architecture spec.', links: [] },
      { id: 's6-2', week: 21, type: 'TASK', points: 2, title: 'Research real-world AI use cases for capstone', desc: 'Survey how AI agents are applied in your chosen domain. Use findings to inform architecture decisions.', links: [] },
      { id: 's6-3', week: 22, type: 'PROJECT', points: 4, title: 'Capstone Sprint 1: Multi-agent layer + RAG', desc: 'Build the orchestration layer and RAG pipeline for your domain. Daily GitHub commits.', links: [] },
      { id: 's6-4', week: 23, type: 'PROJECT', points: 4, title: 'Capstone Sprint 2: UI + Security + Deploy', desc: 'Frontend UI, guardrails, LangSmith tracing. Live on AWS.', links: [] },
      { id: 's6-5', week: 24, type: 'PROJECT', points: 5, title: 'Ship: Capstone - Full Polish', desc: 'Error handling, edge cases. README with architecture diagram. 3-min demo video.', links: [] },
      { id: 's6-6', week: 25, type: 'TASK', points: 3, title: 'Update LinkedIn with portfolio projects', desc: 'Add all completed projects, certifications, and skills. Write a clear about section highlighting your AI engineering work.', links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }] },
      { id: 's6-7', week: 25, type: 'TASK', points: 3, title: 'Publish capstone case study', desc: 'Write a detailed technical case study for your capstone project covering architecture, decisions, and lessons learned. Publish on Medium or dev.to.', links: [{ label: 'Medium', url: 'https://medium.com/new-story' }] },
      { id: 's6-8', week: 26, type: 'TASK', points: 2, title: 'Publish blog post #2', desc: '6 months of building AI agents: lessons learned and what I would do differently. Publish on Medium or dev.to.', links: [{ label: 'Medium', url: 'https://medium.com/new-story' }] },
    ],
  },
]

export const TYPE_META = {
  SETUP:   { label: 'Setup',   color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  COURSE:  { label: 'Course',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  PROJECT: { label: 'Project', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  CERT:    { label: 'Cert',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  TASK:    { label: 'Task',    color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
}

export const STATUS = { TODO: 'todo', INPROG: 'inprog', DONE: 'done' }

export const STATUS_META = {
  todo:   { label: 'To Do',       color: '#64748b' },
  inprog: { label: 'In Progress', color: '#f59e0b' },
  done:   { label: 'Done',        color: '#22c55e' },
}
