import { useState, useEffect, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SPRINTS = [
  {
    id: "s1", num: 1, title: "Foundations & First Agent",
    goal: "Set up environment, understand LLMs, ship first working agent to GitHub",
    weeks: ["Wk 1","Wk 2","Wk 3","Wk 4"], color: "#f97316", accent: "rgba(249,115,22,0.12)",
    stories: [
      { id:"s1-1", week:1, type:"SETUP", points:3, title:"Dev environment ready", desc:"Install Python 3.11+, VS Code, Git, UV/Poetry. Get OpenAI + Anthropic API keys. Run first hello-world API call.", links:[{label:"Udemy Course",url:"https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/"}] },
      { id:"s1-2", week:1, type:"COURSE", points:2, title:"Complete Prompt Engineering for Devs", desc:"DeepLearning.AI free short course (~2 hrs). Understand tokens, context windows, system prompts, temperature.", links:[{label:"DeepLearning.AI",url:"https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/"}] },
      { id:"s1-3", week:2, type:"COURSE", points:3, title:"Udemy Days 1–4: LLM fundamentals + tool use", desc:"Complete first 4 days of Udemy course. Function calling, tool use, the ReAct agent loop.", links:[{label:"Course Repo (GitHub)",url:"https://github.com/ed-donner/agents"}] },
      { id:"s1-4", week:2, type:"COURSE", points:2, title:"LangChain for LLM App Dev (free)", desc:"DeepLearning.AI short course ~2 hrs. Chains, memory, basic agents.", links:[{label:"DeepLearning.AI",url:"https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/"}] },
      { id:"s1-5", week:3, type:"COURSE", points:3, title:"Udemy Days 5–6: OpenAI Agents SDK", desc:"Agents SDK deep dive — handoffs, guardrails, Project 1 (Career Digital Twin). Push all lab code to GitHub.", links:[{label:"OpenAI Tool Use Docs",url:"https://platform.openai.com/docs/guides/function-calling"}] },
      { id:"s1-6", week:3, type:"TASK", points:1, title:"Read MCP introduction (conceptual)", desc:"Understand what the Model Context Protocol is at a conceptual level. No code yet.", links:[{label:"Anthropic MCP",url:"https://modelcontextprotocol.io/introduction"}] },
      { id:"s1-7", week:4, type:"PROJECT", points:5, title:"🚀 Ship: Research Assistant Agent", desc:"Build your own agent that takes a topic, searches the web with a tool, summarises results, and returns a structured report. Push to GitHub with README.", links:[{label:"Anthropic Tool Use",url:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview"}] },
      { id:"s1-8", week:4, type:"TASK", points:1, title:"Post Week 1 LinkedIn update", desc:"Share what you built/learned. Even rough is fine. One sentence + a screenshot.", links:[] },
    ]
  },
  {
    id: "s2", num: 2, title: "LangGraph, RAG & Memory",
    goal: "Build stateful agents, master RAG pipelines, ship the most employable project of the plan",
    weeks: ["Wk 5","Wk 6","Wk 7","Wk 8"], color: "#22c55e", accent: "rgba(34,197,94,0.12)",
    stories: [
      { id:"s2-1", week:5, type:"COURSE", points:3, title:"LangChain Academy: Intro to LangGraph Mods 1–2", desc:"Nodes, edges, state machines. Official free course from LangChain.", links:[{label:"LangChain Academy",url:"https://academy.langchain.com/courses/intro-to-langgraph"}] },
      { id:"s2-2", week:5, type:"COURSE", points:2, title:"DeepLearning.AI: AI Agents in LangGraph", desc:"Free ~2 hrs. Build an agent from scratch then rebuild in LangGraph. Key mental model shift.", links:[{label:"DeepLearning.AI",url:"https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/"}] },
      { id:"s2-3", week:6, type:"COURSE", points:3, title:"DeepLearning.AI: LangChain Chat with Your Data", desc:"Complete RAG pipeline — loading, splitting, embedding, storage, retrieval. Build a doc chatbot.", links:[{label:"DeepLearning.AI",url:"https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/"}] },
      { id:"s2-4", week:6, type:"SETUP", points:2, title:"Set up ChromaDB + Pinecone accounts", desc:"ChromaDB locally, Pinecone free tier in cloud. Ingest 3 test PDFs, run similarity queries.", links:[{label:"ChromaDB Docs",url:"https://www.trychroma.com/"}] },
      { id:"s2-5", week:7, type:"COURSE", points:2, title:"LangChain Academy: LangGraph Mods 3–4", desc:"Memory, checkpointing, human-in-the-loop patterns.", links:[{label:"LangChain Academy",url:"https://academy.langchain.com/"}] },
      { id:"s2-6", week:7, type:"PROJECT", points:4, title:"Build RAG Q&A system (in progress)", desc:"Start the Document Q&A system — PDF ingestion, ChromaDB, LangGraph agent, source citations. Streamlit UI.", links:[{label:"Streamlit Docs",url:"https://docs.streamlit.io/get-started"}] },
      { id:"s2-7", week:8, type:"PROJECT", points:5, title:"🚀 Ship: RAG Document Q&A App", desc:"Complete, polish, and deploy the RAG Q&A app. Architecture diagram with Excalidraw. README. Push to GitHub.", links:[{label:"Excalidraw",url:"https://excalidraw.com/"}] },
      { id:"s2-8", week:8, type:"CERT", points:2, title:"Enroll IBM Coursera — start Module 1", desc:"Subscribe to Coursera ($49/mo). Enroll in IBM RAG and Agentic AI Professional Certificate. Begin Module 1.", links:[{label:"IBM Coursera Cert",url:"https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai"}] },
    ]
  },
  {
    id: "s3", num: 3, title: "Multi-Agent Systems & CrewAI",
    goal: "Master agent collaboration, CrewAI orchestration, and MCP — the frontier skill set",
    weeks: ["Wk 9","Wk 10","Wk 11","Wk 12"], color: "#3b82f6", accent: "rgba(59,130,246,0.12)",
    stories: [
      { id:"s3-1", week:9, type:"COURSE", points:3, title:"Udemy: CrewAI weeks (Projects 4 & 5)", desc:"Agents, tasks, crews, custom tools, multi-agent coordination patterns.", links:[{label:"CrewAI Docs",url:"https://docs.crewai.com/introduction"}] },
      { id:"s3-2", week:9, type:"COURSE", points:2, title:"DeepLearning.AI: Multi AI Agent Systems with crewAI", desc:"Official Andrew Ng course. Free ~2 hrs. Role-based agents, task delegation, output pipelines.", links:[{label:"DeepLearning.AI",url:"https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/"}] },
      { id:"s3-3", week:10, type:"COURSE", points:3, title:"Udemy: AutoGen week (Project 7)", desc:"Agent creator, self-replicating systems, conversation patterns.", links:[{label:"DeepLearning.AI AutoGen",url:"https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/"}] },
      { id:"s3-4", week:10, type:"CERT", points:2, title:"IBM Coursera: Module 3 — Multi-Agent RAG", desc:"Multi-agent RAG systems with LangGraph. IBM graded material.", links:[{label:"IBM Coursera",url:"https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai"}] },
      { id:"s3-5", week:11, type:"COURSE", points:3, title:"Udemy: MCP week — Trading Floor Project (8)", desc:"Build the capstone Trading Floor with 6 MCP servers. Most complex project in the Udemy course.", links:[{label:"Anthropic MCP Quickstart",url:"https://modelcontextprotocol.io/quickstart"}] },
      { id:"s3-6", week:11, type:"TASK", points:2, title:"Integrate MCP into your own agent", desc:"Connect your existing agent to at least one external MCP tool server.", links:[{label:"MCP Specification",url:"https://modelcontextprotocol.io/specification"}] },
      { id:"s3-7", week:12, type:"PROJECT", points:5, title:"🚀 Ship: Multi-Agent Research Crew", desc:"3-agent CrewAI system — Researcher, Writer, Editor — with MCP tool integration. Architecture diagram + GitHub.", links:[] },
      { id:"s3-8", week:12, type:"CERT", points:2, title:"Udemy course: 100% complete", desc:"Review all 8 projects and your notes. The Udemy course should be fully done by end of this sprint.", links:[] },
    ]
  },
  {
    id: "s4", num: 4, title: "Cloud Deployment & MLOps",
    goal: "Take agents from laptop to production — Docker, FastAPI, AWS Bedrock, CI/CD",
    weeks: ["Wk 13","Wk 14","Wk 15","Wk 16"], color: "#ef4444", accent: "rgba(239,68,68,0.12)",
    stories: [
      { id:"s4-1", week:13, type:"COURSE", points:3, title:"FastAPI: official tutorial (full)", desc:"Routes, Pydantic models, async endpoints, dependency injection. ~5 hrs. Must-know for production AI.", links:[{label:"FastAPI Tutorial",url:"https://fastapi.tiangolo.com/tutorial/"}] },
      { id:"s4-2", week:13, type:"TASK", points:3, title:"Wrap RAG agent in FastAPI REST API", desc:"Add health checks, request validation, error handling. Test with curl/Postman.", links:[] },
      { id:"s4-3", week:14, type:"COURSE", points:3, title:"Docker crash course (4 hrs)", desc:"Images, containers, Dockerfile, docker-compose. YouTube crash course sufficient.", links:[{label:"Docker Get Started",url:"https://docs.docker.com/get-started/"}] },
      { id:"s4-4", week:14, type:"TASK", points:4, title:"Containerise FastAPI + LangGraph app", desc:"Dockerfile + docker-compose with ChromaDB volume. Must run identically on any machine.", links:[] },
      { id:"s4-5", week:15, type:"COURSE", points:3, title:"AWS Skill Builder: Amazon Bedrock Getting Started", desc:"Free ~3 hrs. Learn Bedrock Agents, Knowledge Bases, model access.", links:[{label:"AWS Skill Builder",url:"https://explore.skillbuilder.aws/learn/course/external/view/elearning/17508/amazon-bedrock-getting-started"}] },
      { id:"s4-6", week:15, type:"SETUP", points:2, title:"Set up LangSmith + AWS free-tier", desc:"LangSmith free account — connect tracing. AWS account — enable Bedrock access for Claude + Titan.", links:[{label:"LangSmith",url:"https://smith.langchain.com/"}] },
      { id:"s4-7", week:16, type:"PROJECT", points:5, title:"🚀 Ship: Live AI Microservice on AWS", desc:"Deploy containerised app to AWS ECS Fargate or App Runner. GitHub Actions CI/CD. LangSmith tracing live. Public URL.", links:[{label:"GitHub Actions → AWS",url:"https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-to-amazon-elastic-container-service"}] },
      { id:"s4-8", week:16, type:"TASK", points:1, title:"Post live URL on LinkedIn", desc:"Share the live endpoint with a brief write-up about what you learned deploying AI to production.", links:[] },
    ]
  },
  {
    id: "s5", num: 5, title: "Certification Sprint & Security",
    goal: "Earn IBM certificate, master AI security patterns, launch public portfolio",
    weeks: ["Wk 17","Wk 18","Wk 19","Wk 20"], color: "#a855f7", accent: "rgba(168,85,247,0.12)",
    stories: [
      { id:"s5-1", week:17, type:"CERT", points:3, title:"IBM Coursera: Module 6 — Multimodal + Advanced RAG", desc:"Multimodal AI integration, advanced RAG patterns, production considerations.", links:[{label:"IBM Coursera",url:"https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai"}] },
      { id:"s5-2", week:17, type:"COURSE", points:2, title:"DeepLearning.AI: Red Teaming LLM Applications", desc:"Free ~1.5 hrs. Prompt injection, jailbreaks, data poisoning. Essential for enterprise roles.", links:[{label:"DeepLearning.AI",url:"https://www.deeplearning.ai/short-courses/red-teaming-llm-applications/"}] },
      { id:"s5-3", week:18, type:"CERT", points:5, title:"IBM Coursera: Final Capstone Project", desc:"Graded capstone. This submission earns the certificate. Give it proper effort — architecture + code + report.", links:[] },
      { id:"s5-4", week:18, type:"TASK", points:2, title:"Study Guardrails AI + NeMo Guardrails", desc:"Input/output filtering, validator patterns, safety pipelines for production.", links:[{label:"Guardrails AI Docs",url:"https://www.guardrailsai.com/docs/"}] },
      { id:"s5-5", week:19, type:"PROJECT", points:5, title:"🚀 Ship: Secure AI Gateway", desc:"FastAPI gateway with prompt injection detection, PII scrubbing, rate limiting, audit logging. Deploy to existing AWS infra.", links:[] },
      { id:"s5-6", week:19, type:"TASK", points:2, title:"Build portfolio website", desc:"GitHub Pages or Vercel. List all 5 projects with links, tech stack, demo videos.", links:[{label:"GitHub Pages",url:"https://pages.github.com/"}] },
      { id:"s5-7", week:20, type:"CERT", points:5, title:"🎓 IBM Certificate: Complete + add to LinkedIn", desc:"Finish final assessment. Add certificate to LinkedIn profile. Update headline with new credentials.", links:[] },
      { id:"s5-8", week:20, type:"TASK", points:2, title:"Publish blog post #1", desc:"'5 things I learned building AI agents from scratch.' Publish on Medium or dev.to.", links:[{label:"Medium",url:"https://medium.com/new-story"},{label:"dev.to",url:"https://dev.to/"}] },
    ]
  },
  {
    id: "s6", num: 6, title: "Capstone, Portfolio & Job Launch",
    goal: "Ship showpiece project, prepare for interviews, launch your new career positioning",
    weeks: ["Wk 21-22","Wk 23-24","Wk 25","Wk 26"], color: "#06b6d4", accent: "rgba(6,182,212,0.12)",
    stories: [
      { id:"s6-1", week:21, type:"TASK", points:3, title:"Capstone domain selection + architecture spec", desc:"Choose domain (finance, legal, HR, dev tools). Write 1-page architecture spec: agents, tools, data, cloud, UI.", links:[] },
      { id:"s6-2", week:21, type:"TASK", points:2, title:"Research 5 target companies", desc:"Understand how each uses AI. Tailor your capstone domain to the problems they're solving.", links:[] },
      { id:"s6-3", week:22, type:"PROJECT", points:4, title:"Capstone Sprint 1: Multi-agent layer + RAG", desc:"Build the orchestration layer and RAG pipeline for your domain. Daily GitHub commits.", links:[] },
      { id:"s6-4", week:23, type:"PROJECT", points:4, title:"Capstone Sprint 2: UI + Security + Deploy", desc:"Frontend UI (Streamlit/Gradio/Next.js), guardrails, LangSmith tracing. Live on AWS.", links:[] },
      { id:"s6-5", week:24, type:"PROJECT", points:5, title:"🚀 Ship: Capstone — Full Polish", desc:"Error handling, edge cases. README with architecture diagram. 3-min demo video on YouTube (unlisted). Add to portfolio.", links:[] },
      { id:"s6-6", week:25, type:"TASK", points:3, title:"LinkedIn full overhaul", desc:"Headline: 'AI/Agentic Systems Engineer | LangGraph · CrewAI · AWS Bedrock'. Rewrite About. Update all experience entries.", links:[{label:"LinkedIn Jobs",url:"https://www.linkedin.com/jobs/search/?keywords=agentic+ai+engineer"}] },
      { id:"s6-7", week:25, type:"TASK", points:3, title:"Send first 10 job applications", desc:"Apply to 5–10 AI engineering roles. Tailor each cover note. Track in a spreadsheet.", links:[] },
      { id:"s6-8", week:26, type:"TASK", points:2, title:"Publish blog post #2 + Interview prep", desc:"'How I went from X to AI Engineer in 6 months.' Practice: system design for AI systems, LLM cost optimisation.", links:[] },
    ]
  },
];

const TYPE_META = {
  SETUP:   { label:"Setup",   color:"#64748b", bg:"rgba(100,116,139,0.15)" },
  COURSE:  { label:"Course",  color:"#f59e0b", bg:"rgba(245,158,11,0.15)"  },
  PROJECT: { label:"Project", color:"#10b981", bg:"rgba(16,185,129,0.15)"  },
  CERT:    { label:"Cert",    color:"#8b5cf6", bg:"rgba(139,92,246,0.15)"  },
  TASK:    { label:"Task",    color:"#38bdf8", bg:"rgba(56,189,248,0.15)"  },
};

const STATUS = { TODO:"todo", INPROG:"inprog", DONE:"done" };
const STATUS_META = {
  todo:   { label:"To Do",       color:"#64748b" },
  inprog: { label:"In Progress", color:"#f59e0b" },
  done:   { label:"Done",        color:"#22c55e" },
};

const STORAGE_KEY = "ai-sprint-tracker-v1";

function buildInitialState() {
  const taskState = {};
  const notes = {};
  SPRINTS.forEach(s => s.stories.forEach(st => {
    taskState[st.id] = STATUS.TODO;
    notes[st.id] = "";
  }));
  return { taskState, notes, activeSprintId: "s1" };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 48, stroke = 4, color = "#22c55e" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (circ * pct) / 100;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}

function SprintCard({ sprint, taskState, active, onClick }) {
  const total = sprint.stories.length;
  const done = sprint.stories.filter(s => taskState[s.id] === STATUS.DONE).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const totalPts = sprint.stories.reduce((a, s) => a + s.points, 0);
  const donePts = sprint.stories
    .filter(s => taskState[s.id] === STATUS.DONE)
    .reduce((a, s) => a + s.points, 0);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "left",
        background: active ? sprint.accent : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${active ? sprint.color : "rgba(255,255,255,0.07)"}`,
        borderRadius: 10, padding: "14px 16px", cursor: "pointer",
        transition: "all 0.2s", marginBottom: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: pct === 100 ? "#22c55e" : pct > 0 ? sprint.color : "rgba(255,255,255,0.2)",
        }} />
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: active ? sprint.color : "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Sprint {sprint.num}
        </span>
        {pct === 100 && <span style={{ marginLeft: "auto", fontSize: 13 }}>✓</span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: active ? "#f1f5f9" : "#94a3b8", lineHeight: 1.3, marginBottom: 8 }}>
        {sprint.title}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: sprint.color, borderRadius: 2, transition: "width 0.6s ease" }} />
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#64748b", flexShrink: 0 }}>
          {donePts}/{totalPts}pt
        </span>
      </div>
    </button>
  );
}

function StoryCard({ story, status, onStatusChange, note, onNoteChange }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const typeMeta = TYPE_META[story.type];
  const statMeta = STATUS_META[status];
  const isDone = status === STATUS.DONE;
  const isInProg = status === STATUS.INPROG;

  const cycleStatus = (e) => {
    e.stopPropagation();
    const order = [STATUS.TODO, STATUS.INPROG, STATUS.DONE];
    const next = order[(order.indexOf(status) + 1) % order.length];
    onStatusChange(next);
  };

  return (
    <div style={{
      background: isDone ? "rgba(34,197,94,0.04)" : isInProg ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${isDone ? "rgba(34,197,94,0.2)" : isInProg ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 10, marginBottom: 8, overflow: "hidden", transition: "all 0.2s",
    }}>
      <div onClick={() => setExpanded(e => !e)}
        style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button
          onClick={cycleStatus}
          title={`Click to advance: ${statMeta.label}`}
          style={{
            width: 20, height: 20, borderRadius: 5,
            border: `2px solid ${statMeta.color}`,
            background: isDone ? statMeta.color : isInProg ? `${statMeta.color}33` : "transparent",
            cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 1, transition: "all 0.15s",
          }}
        >
          {isDone && (
            <svg width="10" height="10" viewBox="0 0 12 12">
              <polyline points="1,6 4,9 11,2" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          )}
          {isInProg && <div style={{ width: 6, height: 6, borderRadius: 1, background: statMeta.color }} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 5 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, lineHeight: 1.3,
              color: isDone ? "#64748b" : "#e2e8f0",
              textDecoration: isDone ? "line-through" : "none",
            }}>
              {story.title}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "2px 7px", borderRadius: 3,
              background: typeMeta.bg, color: typeMeta.color, letterSpacing: "0.08em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              {typeMeta.label}
            </span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569" }}>
              {story.points} {story.points === 1 ? "pt" : "pts"}
            </span>
            {note && !expanded && <span style={{ fontSize: 9, color: "#475569" }}>📝</span>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "2px 8px", borderRadius: 12,
            background: `${statMeta.color}22`, color: statMeta.color,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            {statMeta.label}
          </span>
          <span style={{
            color: "#475569", fontSize: 11, transition: "transform 0.2s", display: "inline-block",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65, marginBottom: 10, paddingTop: 10 }}>
            {story.desc}
          </p>

          {story.links.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {story.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{
                  fontSize: 11, fontFamily: "'DM Mono',monospace", padding: "4px 10px",
                  borderRadius: 5, background: "rgba(99,102,241,0.15)", color: "#818cf8",
                  textDecoration: "none", border: "1px solid rgba(99,102,241,0.25)",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>
                  🔗 {l.label}
                </a>
              ))}
            </div>
          )}

          <div style={{ marginTop: 4 }}>
            {editing ? (
              <div>
                <textarea
                  value={localNote}
                  onChange={e => setLocalNote(e.target.value)}
                  placeholder="Add your notes here..."
                  style={{
                    width: "100%", minHeight: 70,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 6, padding: "8px 10px", color: "#e2e8f0",
                    fontSize: 12, fontFamily: "'DM Mono',monospace",
                    resize: "vertical", outline: "none", boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => { onNoteChange(localNote); setEditing(false); }}
                    style={{ fontSize: 11, padding: "5px 12px", borderRadius: 5, background: "#1d4ed8", color: "white", border: "none", cursor: "pointer" }}
                  >Save</button>
                  <button
                    onClick={() => { setLocalNote(note); setEditing(false); }}
                    style={{ fontSize: 11, padding: "5px 12px", borderRadius: 5, background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "none", cursor: "pointer" }}
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditing(true)}
                style={{
                  minHeight: 32, padding: "6px 10px", borderRadius: 6,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  cursor: "text", fontSize: 12,
                  color: note ? "#94a3b8" : "#475569",
                  fontFamily: note ? "inherit" : "'DM Mono',monospace",
                  lineHeight: 1.5,
                }}
              >
                {note || "Click to add notes..."}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {[STATUS.TODO, STATUS.INPROG, STATUS.DONE].map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                style={{
                  fontSize: 10, padding: "4px 10px", borderRadius: 5, cursor: "pointer",
                  background: status === s ? `${STATUS_META[s].color}22` : "transparent",
                  color: status === s ? STATUS_META[s].color : "#475569",
                  border: `1px solid ${status === s ? STATUS_META[s].color + "44" : "rgba(255,255,255,0.07)"}`,
                  fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                }}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [taskState, setTaskState] = useState({});
  const [notes, setNotes] = useState({});
  const [activeSprintId, setActiveSprintId] = useState("s1");
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [showDone, setShowDone] = useState(true);
  const [view, setView] = useState("sprint");

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setTaskState(saved.taskState || {});
      setNotes(saved.notes || {});
      setActiveSprintId(saved.activeSprintId || "s1");
    } else {
      const init = buildInitialState();
      setTaskState(init.taskState);
      setNotes(init.notes);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage({ taskState, notes, activeSprintId });
  }, [taskState, notes, activeSprintId, loaded]);

  const updateTask = useCallback((id, status) => {
    setTaskState(prev => ({ ...prev, [id]: status }));
  }, []);

  const updateNote = useCallback((id, note) => {
    setNotes(prev => ({ ...prev, [id]: note }));
  }, []);

  const allStories = SPRINTS.flatMap(s => s.stories);
  const totalDone = allStories.filter(s => taskState[s.id] === STATUS.DONE).length;
  const totalInProg = allStories.filter(s => taskState[s.id] === STATUS.INPROG).length;
  const totalPct = Math.round((totalDone / allStories.length) * 100);
  const totalPts = allStories.reduce((a, s) => a + s.points, 0);
  const donePts = allStories
    .filter(s => taskState[s.id] === STATUS.DONE)
    .reduce((a, s) => a + s.points, 0);

  const activeSprint = SPRINTS.find(s => s.id === activeSprintId);
  const sprintStories = activeSprint?.stories || [];
  const sprintDone = sprintStories.filter(s => taskState[s.id] === STATUS.DONE).length;
  const sprintPct = sprintStories.length ? Math.round((sprintDone / sprintStories.length) * 100) : 0;
  const sprintPts = sprintStories.reduce((a, s) => a + s.points, 0);
  const sprintDonePts = sprintStories
    .filter(s => taskState[s.id] === STATUS.DONE)
    .reduce((a, s) => a + s.points, 0);

  const filteredStories = sprintStories
    .filter(s => filter === "ALL" || s.type === filter)
    .filter(s => showDone || taskState[s.id] !== STATUS.DONE);

  const weekGroups = activeSprint
    ? activeSprint.weeks.map((w, wi) => ({
        label: w,
        stories: filteredStories.filter(s => {
          const base = (activeSprint.num - 1) * 4;
          return s.week === base + wi + 1;
        }),
      }))
    : [];

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e1a", color: "#475569", fontFamily: "system-ui" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0", fontFamily: "system-ui,-apple-system,sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        *{box-sizing:border-box}
        button{transition:all 0.15s}
        a:hover{opacity:0.8}
      `}</style>

      {/* TOP NAV */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 20px",
        display: "flex", alignItems: "center", gap: 16, height: 52,
        background: "rgba(10,14,26,0.95)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 100, flexShrink: 0,
      }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", color: "#f1f5f9", flexShrink: 0 }}>
          AI<span style={{ color: "#f97316" }}>.</span>TRACK
        </div>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", marginLeft: 4 }} />
        {[["sprint","Sprint"],["board","Board"],["overview","Overview"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{
            fontSize: 12, padding: "4px 10px", borderRadius: 5, border: "none", cursor: "pointer",
            background: view === v ? "rgba(249,115,22,0.15)" : "transparent",
            color: view === v ? "#f97316" : "#64748b",
            fontWeight: view === v ? 600 : 400,
          }}>{l}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ProgressRing pct={totalPct} size={32} stroke={3} color="#22c55e" />
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500, color: "#f1f5f9" }}>{totalPct}%</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569" }}>OVERALL</div>
            </div>
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#475569", display: "flex", gap: 12 }}>
            <span style={{ color: "#22c55e" }}>{totalDone} done</span>
            <span style={{ color: "#f59e0b" }}>{totalInProg} active</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", maxHeight: "calc(100vh - 52px)" }}>

        {/* SIDEBAR */}
        <div style={{
          width: 230, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.07)",
          overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2,
        }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#334155", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
            6 SPRINTS
          </div>
          {SPRINTS.map(s => (
            <SprintCard key={s.id} sprint={s} taskState={taskState}
              active={s.id === activeSprintId}
              onClick={() => { setActiveSprintId(s.id); setView("sprint"); }} />
          ))}

          {/* Velocity */}
          <div style={{ marginTop: 12, padding: "12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", color: "#334155", textTransform: "uppercase", marginBottom: 10 }}>VELOCITY</div>
            {SPRINTS.map(s => {
              const sDone = s.stories.filter(st => taskState[st.id] === STATUS.DONE).length;
              const sTotal = s.stories.length;
              const sPct = sTotal ? Math.round((sDone / sTotal) * 100) : 0;
              return (
                <div key={s.id} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569" }}>S{s.num}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: sPct === 100 ? "#22c55e" : sPct > 0 ? s.color : "#334155" }}>
                      {sDone}/{sTotal}
                    </span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${sPct}%`, background: sPct === 100 ? "#22c55e" : s.color, borderRadius: 2, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* ── SPRINT VIEW ── */}
          {view === "sprint" && activeSprint && (
            <>
              <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: activeSprint.color, textTransform: "uppercase" }}>
                      Sprint {activeSprint.num} / Month {activeSprint.num}
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "2px 8px", borderRadius: 10, background: activeSprint.accent, color: activeSprint.color, letterSpacing: "0.08em" }}>
                      {sprintPct}% complete
                    </div>
                  </div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "#f1f5f9", marginBottom: 6 }}>
                    {activeSprint.title}
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748b", maxWidth: 500, lineHeight: 1.5 }}>{activeSprint.goal}</p>
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <div style={{ textAlign: "center", padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 500, color: activeSprint.color }}>
                      {sprintDonePts}<span style={{ fontSize: 11, color: "#475569" }}>/{sprintPts}</span>
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569", textTransform: "uppercase", marginTop: 2 }}>Story Points</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 500, color: "#f1f5f9" }}>
                      {sprintDone}<span style={{ fontSize: 11, color: "#475569" }}>/{sprintStories.length}</span>
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569", textTransform: "uppercase", marginTop: 2 }}>Tasks</div>
                  </div>
                </div>
              </div>

              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${sprintPct}%`, background: `linear-gradient(90deg,${activeSprint.color},${activeSprint.color}aa)`, borderRadius: 3, transition: "width 0.6s ease" }} />
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 4 }}>FILTER</span>
                {["ALL","COURSE","PROJECT","CERT","TASK","SETUP"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    fontSize: 10, padding: "3px 9px", borderRadius: 4, cursor: "pointer", border: "none",
                    background: filter === f ? (f === "ALL" ? "rgba(255,255,255,0.1)" : TYPE_META[f]?.bg || "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.04)",
                    color: filter === f ? (f === "ALL" ? "#e2e8f0" : TYPE_META[f]?.color || "#e2e8f0") : "#475569",
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>{f}</button>
                ))}
                <button onClick={() => setShowDone(p => !p)} style={{
                  marginLeft: "auto", fontSize: 10, padding: "3px 9px", borderRadius: 4, cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: showDone ? "transparent" : "rgba(34,197,94,0.1)",
                  color: showDone ? "#475569" : "#22c55e",
                  fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em",
                }}>{showDone ? "Hide Done" : "Show Done"}</button>
              </div>

              {/* Week columns */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {weekGroups.map(({ label, stories }) => {
                  const wDone = stories.filter(s => taskState[s.id] === STATUS.DONE).length;
                  return (
                    <div key={label}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 500, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "1px 6px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "#475569" }}>{wDone}/{stories.length}</span>
                      </div>
                      {stories.length === 0
                        ? <div style={{ fontSize: 12, color: "#334155", fontStyle: "italic", padding: "8px 0" }}>No matching tasks</div>
                        : stories.map(s => (
                          <StoryCard key={s.id} story={s}
                            status={taskState[s.id] || STATUS.TODO}
                            onStatusChange={st => updateTask(s.id, st)}
                            note={notes[s.id] || ""}
                            onNoteChange={n => updateNote(s.id, n)} />
                        ))
                      }
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── BOARD VIEW ── */}
          {view === "board" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "#f1f5f9", marginBottom: 4 }}>Board View</h1>
                <p style={{ fontSize: 13, color: "#64748b" }}>Kanban for active sprint — {activeSprint?.title}</p>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                {SPRINTS.map(s => (
                  <button key={s.id} onClick={() => setActiveSprintId(s.id)} style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 5, cursor: "pointer", border: "none",
                    background: s.id === activeSprintId ? s.accent : "rgba(255,255,255,0.04)",
                    color: s.id === activeSprintId ? s.color : "#64748b",
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                    fontWeight: s.id === activeSprintId ? 600 : 400,
                  }}>S{s.num}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {[STATUS.TODO, STATUS.INPROG, STATUS.DONE].map(st => {
                  const col = sprintStories.filter(s => taskState[s.id] === st);
                  const sm = STATUS_META[st];
                  return (
                    <div key={st}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: sm.color }} />
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: sm.color, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{sm.label}</span>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#475569", marginLeft: "auto" }}>{col.length}</span>
                      </div>
                      {col.map(s => (
                        <StoryCard key={s.id} story={s}
                          status={taskState[s.id] || STATUS.TODO}
                          onStatusChange={ns => updateTask(s.id, ns)}
                          note={notes[s.id] || ""}
                          onNoteChange={n => updateNote(s.id, n)} />
                      ))}
                      {col.length === 0 && (
                        <div style={{ fontSize: 12, color: "#1e293b", textAlign: "center", padding: "20px 0", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: 8 }}>
                          Empty
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── OVERVIEW ── */}
          {view === "overview" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "#f1f5f9", marginBottom: 4 }}>Program Overview</h1>
                <p style={{ fontSize: 13, color: "#64748b" }}>6-Month AI Engineering · {allStories.length} tasks · {totalPts} story points</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Completion", value: `${totalPct}%`, color: "#22c55e" },
                  { label: "Done", value: totalDone, color: "#22c55e" },
                  { label: "In Progress", value: totalInProg, color: "#f59e0b" },
                  { label: "Points Earned", value: `${donePts}/${totalPts}`, color: "#f97316" },
                ].map(s => (
                  <div key={s.label} style={{ padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 500, color: s.color, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 80px 80px 80px", padding: "10px 16px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["#","Sprint","Progress","Done","Points","%"].map(h => (
                    <span key={h} style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase" }}>{h}</span>
                  ))}
                </div>
                {SPRINTS.map(s => {
                  const sDone = s.stories.filter(st => taskState[st.id] === STATUS.DONE).length;
                  const sTotal = s.stories.length;
                  const sPct = sTotal ? Math.round((sDone / sTotal) * 100) : 0;
                  const sPts = s.stories.reduce((a, st) => a + st.points, 0);
                  const sDonePts = s.stories.filter(st => taskState[st.id] === STATUS.DONE).reduce((a, st) => a + st.points, 0);
                  return (
                    <div key={s.id}
                      onClick={() => { setActiveSprintId(s.id); setView("sprint"); }}
                      style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 80px 80px 80px", padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: sPct === 100 ? "#22c55e" : sPct > 0 ? s.color : "rgba(255,255,255,0.1)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>Sprint {s.num}: {s.title}</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#475569" }}>Month {s.num} · {sTotal} tasks</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ height: 4, width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${sPct}%`, background: sPct === 100 ? "#22c55e" : s.color, borderRadius: 2 }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>{sDone}/{sTotal}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>{sDonePts}/{sPts}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 600, color: sPct === 100 ? "#22c55e" : sPct > 0 ? s.color : "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}>{sPct}%</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
                {Object.entries(TYPE_META).map(([type, meta]) => {
                  const tStories = allStories.filter(s => s.type === type);
                  const tDone = tStories.filter(s => taskState[s.id] === STATUS.DONE).length;
                  const tPct = tStories.length ? Math.round((tDone / tStories.length) * 100) : 0;
                  return (
                    <div key={type} style={{ padding: "14px", borderRadius: 8, background: meta.bg, border: `1px solid ${meta.color}33` }}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: meta.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>{meta.label}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 500, color: meta.color, marginBottom: 4 }}>
                        {tDone}<span style={{ fontSize: 12, color: `${meta.color}99` }}>/{tStories.length}</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(0,0,0,0.2)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${tPct}%`, background: meta.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
