import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const agenticAiOsDevelopment: AssessmentDef = {
  key: "agentic-ai-os-development",
  name: "Agentic AI OS Development Diagnostic",
  tagline: "Autonomous workflows · tool calling · memory graphs · multi-agent swarms · governance",
  indexLabel: "Agentic AI Operating Readiness",
  shortIndex: "AI OS Index",
  description:
    "An architectural diagnostic evaluating autonomous workflow design, tool-use protocols, structured memory layers, multi-agent orchestration, evaluation telemetry, and human-in-the-loop governance.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive
  gatingPointId: 1, // Core Loop Architecture & Planning is master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("Agentic AI Operating Readiness"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "ReAct Loop Architecture & Reasoning Engines",
      focus: "Think-Plan-Act loops · self-correction · chain-of-thought routing · halting bounds",
    },
    {
      index: 1,
      roman: "II",
      name: "Tool Calling & External Function Schemas",
      focus: "Strict JSON schemas · idempotent execution · API error recovery · rate limiters",
    },
    {
      index: 2,
      roman: "III",
      name: "Context Engineering & Memory Graphs",
      focus: "Episodic vs semantic storage · vector retrieval · token budgeting · context pruning",
    },
    {
      index: 3,
      roman: "IV",
      name: "Multi-Agent Orchestration & Swarms",
      focus: "Hierarchical supervisors · specialist handoffs · consensus voting · deadlock guards",
    },
    {
      index: 4,
      roman: "V",
      name: "Eval Harnesses, Tracing & Drift Telemetry",
      focus:
        "Synthetic benchmarking · LLM-as-judge evals · latency & cost telemetry · drift alerts",
    },
    {
      index: 5,
      roman: "VI",
      name: "Cybernetic Governance & Human-in-the-Loop",
      focus: "Permission tiers · rollback controls · prompt injection defense · alignment bounds",
    },
  ],
  points: [
    // Pillar I (190 pts)
    {
      id: 1,
      pillar: 0,
      name: "ReAct Loop Architecture",
      focus: "Robust Thought-Action-Observation loops with guaranteed termination bounds",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "Self-Reflection & Error Correction",
      focus: "Agent detecting its own failed steps and revising plan autonomously",
      weight: 35,
    },
    {
      id: 3,
      pillar: 0,
      name: "Dynamic Prompt Routing",
      focus: "Routing requests to specialized models (fast/cheap vs deep reasoners)",
      weight: 35,
    },
    {
      id: 4,
      pillar: 0,
      name: "Structured Output Enforcement",
      focus: "Enforcing Zod/Pydantic schemas with automatic schema repair loops",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Deterministic Fallbacks",
      focus: "Clean degradation to rule-based logic when LLM reasoning fails",
      weight: 35,
    },

    // Pillar II (165 pts)
    {
      id: 6,
      pillar: 1,
      name: "Strict Tool Schema Definitions",
      focus: "Unambiguous parameter typing, descriptions, and boundary constraints",
      weight: 35,
    },
    {
      id: 7,
      pillar: 1,
      name: "Idempotent Execution Guarantees",
      focus: "Safe retries on external mutations without duplicate writes or side-effects",
      weight: 35,
    },
    {
      id: 8,
      pillar: 1,
      name: "Tool Failure & Backoff Recovery",
      focus: "Graceful handling of 4xx/5xx API codes with exponential jittered retry",
      weight: 35,
    },
    {
      id: 9,
      pillar: 1,
      name: "Sandboxed Execution Environments",
      focus: "Running generated code or bash scripts inside isolated ephemeral containers",
      weight: 30,
    },
    {
      id: 10,
      pillar: 1,
      name: "Dynamic Tool Discovery",
      focus: "Loading tools on-demand via vector search or namespace registry",
      weight: 30,
    },

    // Pillar III (165 pts)
    {
      id: 11,
      pillar: 2,
      name: "Hybrid Search & Semantic RAG",
      focus: "Combining dense vector embeddings with sparse keyword search (BM25)",
      weight: 40,
    },
    {
      id: 12,
      pillar: 2,
      name: "Persistent Long-Term Memory Layer",
      focus: "Storing user preferences, past decisions, and outcomes in graph/key-value store",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Context Window Compaction",
      focus: "Summarizing conversation history and pruning dead token bloat dynamically",
      weight: 30,
    },
    {
      id: 14,
      pillar: 2,
      name: "Chunking & Metadata Filtering",
      focus: "Semantic chunk boundaries with rich tenant, author, and timestamp metadata",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Knowledge Base Synchronization",
      focus: "Automated pipelines keeping agent documentation fresh and accurate",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "Supervisor & Worker Hierarchy",
      focus: "Master router decomposing complex jobs into specialist sub-tasks",
      weight: 40,
    },
    {
      id: 17,
      pillar: 3,
      name: "Clean State Handoff Protocols",
      focus: "Passing structured state between agents without context hallucination",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Agent Deadlock & Loop Detection",
      focus: "Guards against infinite ping-pong between conversational agents",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Consensus & Critic Evaluation",
      focus: "Secondary critic agent vetting proposals before final execution",
      weight: 30,
    },
    {
      id: 20,
      pillar: 3,
      name: "Parallel Agent Fan-Out & Fan-In",
      focus: "Executing independent agent tasks concurrently and synthesizing results",
      weight: 25,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Automated Evaluation Harness",
      focus: "Golden test suites running on every prompt and tool code commit",
      weight: 40,
    },
    {
      id: 22,
      pillar: 4,
      name: "LLM-as-Judge Scoring Metrics",
      focus: "Faithfulness, relevance, and hallucination metrics tracked programmatically",
      weight: 35,
    },
    {
      id: 23,
      pillar: 4,
      name: "Full Tracing & Span Telemetry",
      focus: "Distributed trace spans capturing latency, token count, and step costs",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "Production Drift & Failure Alerts",
      focus: "Real-time alerts when tool failure or refusal rates exceed thresholds",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Cost & Token Budget Enforcers",
      focus: "Hard ceilings preventing runaway loops from consuming excessive credits",
      weight: 25,
    },

    // Pillar VI (160 pts)
    {
      id: 26,
      pillar: 5,
      name: "Human-in-the-Loop Approval Gates",
      focus: "High-risk actions (wire transfers, deletions, email sends) requiring user click",
      weight: 40,
    },
    {
      id: 27,
      pillar: 5,
      name: "Prompt Injection & Jailbreak Defense",
      focus: "Guarding against malicious user inputs overriding system instructions",
      weight: 35,
    },
    {
      id: 28,
      pillar: 5,
      name: "Auditable Action Log",
      focus: "Immutable event log recording every LLM prompt, tool call, and state delta",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Instant Rollback & State Rewind",
      focus: "Reverting agent-driven mutations with a single administrative click",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Value Alignment & Brand Voice Guard",
      focus: "Rigid boundary enforcement ensuring tone, ethics, and legal compliance",
      weight: 25,
    },
  ],
};
